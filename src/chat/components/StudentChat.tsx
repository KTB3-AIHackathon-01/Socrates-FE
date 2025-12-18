import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Brain } from 'lucide-react'
import { ChatSidebar } from '@/chat/components/ChatSidebar'
import { ChatMessages } from '@/chat/components/ChatMessages'
import { ChatComposer } from '@/chat/components/ChatComposer'
import { LearningInsights } from '@/chat/components/LearningInsights'
import type { ChatSession, Message } from '@/chat/types'
import { chatAPI } from '@/chat/api/chatAPI'
import type { ChatSessionResponse, ChatStreamEvent } from '@/chat/api/types'

export function StudentChat() {
  const studentId = localStorage.getItem('student-id')
  if (!studentId) {
    return
  }

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [draftChat, setDraftChat] = useState<ChatSession | null>(null)
  const [activeChatId, setActiveChatId] = useState('')
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const titleGenerationInProgress = useRef<Set<string>>(new Set())

  const activeChat = useMemo(
    () => chatSessions.find((chat) => chat.id === activeChatId) ?? chatSessions[0],
    [activeChatId, chatSessions],
  )
  const currentChat = draftChat ?? activeChat
  const messages = currentChat?.messages ?? []
  const sessionCompleted = !draftChat && currentChat?.status === 'completed'
  const reportStatus = currentChat?.reportStatus
  const reportMarkdown = currentChat?.reportMarkdown
  const sidebarSessions = useMemo(
    () =>
      chatSessions.filter(
        (chat) =>
          chat.isVisible !== false &&
          chat.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      ),
    [chatSessions, searchQuery],
  )
  const applyChatUpdate = useCallback(
    (chatId: string, updater: (chat: ChatSession) => ChatSession) => {
      setDraftChat((prev) => {
        if (prev && prev.id === chatId) {
          return updater(prev)
        }
        return prev
      })
      setChatSessions((prev) =>
        prev.map((chat) => (chat.id === chatId ? updater(chat) : chat)),
      )
    },
    [],
  )

  useEffect(() => {
    const getChatSessions = async () => {
      try {
        const response = await chatAPI.getStudentSessions({ studentId })
        const sessions = response.content.map(
          (session: ChatSessionResponse): ChatSession => ({
            id: session.sessionId,
            sessionId: session.sessionId,
            title: session.name,
            lastMessage: '',
            timestamp: session.startedAt ? new Date(session.startedAt) : new Date(),
            messages: [],
            status: 'completed',
            isUserSession: false,
            isVisible: true,
          }),
        )
        setChatSessions(sessions)
      } catch (error) {
        console.error('Failed to load sessions:', error)
      }
    }

    getChatSessions()
    handleNewChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  const getSessionId = (chat: ChatSession) => chat.sessionId || chat.id

  const parseEventData = (payload: string): unknown => {
    try {
      return JSON.parse(payload)
    } catch {
      return payload
    }
  }

  const extractSessionId = (data: unknown): string | undefined => {
    if (!data || typeof data !== 'object') return undefined
    const record = data as Record<string, unknown>
    if (typeof record.session_id === 'string') return record.session_id
    if (typeof record.sessionId === 'string') return record.sessionId
    return undefined
  }

  const extractMarkdown = (data: unknown, fallback: string) => {
    if (typeof data === 'string') return data || fallback
    if (!data || typeof data !== 'object') return fallback
    const record = data as Record<string, unknown>
    if (typeof record.markdown === 'string') return record.markdown
    if (typeof record.content === 'string') return record.content
    return fallback
  }

  const handleStreamEvent = (chatId: string, sessionId: string, event: ChatStreamEvent) => {
    if (!event.event) return

    const payload = parseEventData(event.data)
    const targetSessionId = extractSessionId(payload)
    if (targetSessionId && targetSessionId !== sessionId) return

    if (event.event === 'chat_end') {
      applyChatUpdate(chatId, (chat) => ({
        ...chat,
        status: 'completed',
        reportStatus: chat.reportStatus === 'ready' ? 'ready' : 'loading',
      }))
      return
    }

    if (event.event === 'report') {
      const markdown = extractMarkdown(payload, event.data)
      applyChatUpdate(chatId, (chat) => ({
        ...chat,
        reportMarkdown: markdown,
        reportStatus: 'ready',
        status: 'completed',
      }))
      return
    }

    if (event.event === 'report_error') {
      applyChatUpdate(chatId, (chat) => ({
        ...chat,
        reportStatus: 'error',
        status: 'completed',
      }))
    }
  }

  const generateTitleInBackground = async (
    chatId: string,
    firstMessage: string,
    sessionId: string,
  ) => {
    if (titleGenerationInProgress.current.has(chatId)) return

    titleGenerationInProgress.current.add(chatId)

    try {
      const title = await chatAPI.generateChatTitle({
        message: firstMessage,
        sessionId,
      })

      await chatAPI.createSession({ sessionId, studentId, name: title })

      applyChatUpdate(chatId, (chat) => ({ ...chat, title }))
    } catch (error) {
      console.error('Failed to generate title:', error)
    } finally {
      titleGenerationInProgress.current.delete(chatId)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const targetChat = currentChat
    if (!targetChat) return
    const isDraft = draftChat?.id === targetChat.id
    if (!isDraft && targetChat.status === 'completed') return

    const currentChatId = targetChat.id
    const isFirstMessage = targetChat.messages.filter((msg) => msg.role === 'user').length === 0
    const wasNewChat = targetChat.title === '새 채팅'
    const userMessageContent = input
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      timestamp: new Date(),
    }

    if (isDraft) {
      setDraftChat((prev) => {
        if (!prev || prev.id !== currentChatId) return prev
        const updatedMessages = [...prev.messages, userMessage]
        return {
          ...prev,
          messages: updatedMessages,
          lastMessage: userMessage.content,
          timestamp: userMessage.timestamp,
        }
      })
    } else {
      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id !== currentChatId) return chat
          const updatedMessages = [...chat.messages, userMessage]
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: userMessage.content,
            timestamp: userMessage.timestamp,
            status: 'active',
            reportStatus: chat.reportStatus ?? 'idle',
          }
        }),
      )
    }
    setInput('')
    setIsThinking(true)

    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      timestamp: new Date(),
      streaming: true,
    }

    if (isDraft) {
      setDraftChat((prev) => {
        if (!prev || prev.id !== currentChatId) return prev
        return {
          ...prev,
          messages: [...prev.messages, aiMessage],
        }
      })
    } else {
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
              }
            : chat,
        ),
      )
    }
    setIsThinking(false)

    const sessionId = getSessionId(targetChat)

    try {
      await chatAPI.streamChat(
        {
          message: userMessageContent,
          userId: studentId,
          sessionId,
        },
        {
          onChunk: (chunk: string) => {
            if (isDraft) {
              setDraftChat((prev) => {
                if (!prev || prev.id !== currentChatId) return prev
                return {
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg.id === aiMessageId ? { ...msg, content: msg.content + chunk } : msg,
                  ),
                  lastMessage:
                    prev.messages.find((msg) => msg.id === aiMessageId)?.content ||
                    prev.lastMessage,
                  timestamp: new Date(),
                }
              })
            } else {
              setChatSessions((prev) =>
                prev.map((chat) => {
                  if (chat.id !== currentChatId) return chat
                  return {
                    ...chat,
                    messages: chat.messages.map((msg) =>
                      msg.id === aiMessageId ? { ...msg, content: msg.content + chunk } : msg,
                    ),
                    lastMessage:
                      chat.messages.find((msg) => msg.id === aiMessageId)?.content ||
                      chat.lastMessage,
                    timestamp: new Date(),
                  }
                }),
              )
            }
          },
          onEvent: (event: ChatStreamEvent) => handleStreamEvent(currentChatId, sessionId, event),
          onComplete: () => {
            if (isDraft) {
              setDraftChat((prev) => {
                if (!prev || prev.id !== currentChatId) return prev
                const updatedMessages = prev.messages.map((msg) =>
                  msg.id === aiMessageId ? { ...msg, streaming: false } : msg,
                )
                const updatedChat = {
                  ...prev,
                  messages: updatedMessages,
                }

                if (isFirstMessage) {
                  const promotedChat = {
                    ...updatedChat,
                    isVisible: true,
                    status: 'active' as const,
                  }
                  setChatSessions((sessions) => [promotedChat, ...sessions])
                  setActiveChatId(promotedChat.id)
                  return null
                }

                return updatedChat
              })
            } else {
              setChatSessions((prev) =>
                prev.map((chat) => {
                  if (chat.id !== currentChatId) return chat
                  return {
                    ...chat,
                    messages: chat.messages.map((msg) =>
                      msg.id === aiMessageId ? { ...msg, streaming: false } : msg,
                    ),
                  }
                }),
              )
            }

            if (isFirstMessage && wasNewChat) {
              generateTitleInBackground(currentChatId, userMessageContent, sessionId)
            }
          },
          onError: (error: Error) => {
            console.error('Chat streaming error:', error)
            if (isDraft) {
              setDraftChat((prev) => {
                if (!prev || prev.id !== currentChatId) return prev
                return {
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg.id === aiMessageId
                      ? {
                          ...msg,
                          content: '오류가 발생했습니다. 다시 시도해주세요.',
                          streaming: false,
                        }
                      : msg,
                  ),
                }
              })
            } else {
              setChatSessions((prev) =>
                prev.map((chat) => {
                  if (chat.id !== currentChatId) return chat
                  return {
                    ...chat,
                    messages: chat.messages.map((msg) =>
                      msg.id === aiMessageId
                        ? {
                            ...msg,
                            content: '오류가 발생했습니다. 다시 시도해주세요.',
                            streaming: false,
                          }
                        : msg,
                    ),
                  }
                }),
              )
            }
          },
        },
      )
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const timestamp = new Date()
    const greeting: Message = {
      id: `${newId}-ai`,
      role: 'ai',
      content: '안녕하세요! 어떤 주제든 단계별로 이해를 도와드릴게요. 무엇을 배우고 싶으신가요?',
      timestamp,
    }

    const newChat: ChatSession = {
      id: newId,
      title: '새 채팅',
      lastMessage: greeting.content,
      timestamp,
      messages: [greeting],
      isUserSession: true,
      status: 'active',
      reportStatus: 'idle',
      isVisible: false,
    }

    setDraftChat(newChat)
    setActiveChatId('')
    setIsThinking(false)
    setSidebarOpen(true)
  }

  const handleSelectChat = async (id: string) => {
    setDraftChat(null)
    setActiveChatId(id)
    setIsThinking(false)

    const targetChat = chatSessions.find((chat) => chat.id === id)
    if (!targetChat) return

    if (targetChat.isUserSession && !targetChat.sessionId) {
      return
    }

    try {
      const historyData = await chatAPI.getChatHistory(id)

      const loadedMessages: Message[] = historyData.flatMap((item) => [
        {
          id: `${item.id}-user`,
          role: 'user',
          content: item.userMessage,
          timestamp: new Date(item.createdAt),
        },
        {
          id: `${item.id}-ai`,
          role: 'ai',
          content: item.assistantMessage,
          timestamp: new Date(item.completedAt || item.createdAt),
        },
      ])

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === id
            ? {
                ...chat,
                messages: loadedMessages,
                lastMessage: loadedMessages[loadedMessages.length - 1]?.content || chat.lastMessage,
                timestamp: loadedMessages[loadedMessages.length - 1]?.timestamp || chat.timestamp,
                status: 'completed',
              }
            : chat,
        ),
      )
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return '오늘'
    if (diffInDays === 1) return '어제'
    if (diffInDays < 7) return `${diffInDays}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)] relative">
      <ChatSidebar
        isOpen={sidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sessions={sidebarSessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onToggle={setSidebarOpen}
        formatTimestamp={formatTimestamp}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6" />
              <div>
                <h2>AI 러닝 세션</h2>
                <p className="text-sm text-blue-100">질문을 통해 성장하는 시간</p>
              </div>
            </div>
          </div>

          <ChatMessages
            messages={messages}
            isThinking={isThinking}
            sessionCompleted={sessionCompleted}
            reportStatus={reportStatus}
            reportMarkdown={reportMarkdown}
          />
          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={sessionCompleted}
          />
        </div>

        <LearningInsights />
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react';
import { Brain } from 'lucide-react';
import { ChatSidebar } from '@/chat/components/ChatSidebar';
import { ChatMessages } from '@/chat/components/ChatMessages';
import { ChatComposer } from '@/chat/components/ChatComposer';
import { LearningInsights } from '@/chat/components/LearningInsights';
import type { ChatSession, Message } from '@/chat/types';
import { streamChat } from '@/chat/api';

const createSession = (id: string, title: string, preview: string, daysAgo = 0): ChatSession => {
  const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const initialMessage: Message = {
    id: `${id}-ai-1`,
    role: 'ai',
    content: preview,
    timestamp,
  };

  return {
    id,
    title,
    lastMessage: preview,
    timestamp,
    messages: [initialMessage],
    isUserSession: false,
  };
};

const initialChatSessions: ChatSession[] = [
  createSession('1', 'TypeScript React 환경 설정', 'TypeScript와 React를 함께 사용하려면 tsconfig 설정부터 맞춰볼까요?'),
  createSession('2', 'LangChain vs LangGraph', 'LangChain과 LangGraph의 차이점을 단계별로 비교해드릴게요.', 1),
  createSession('3', 'Spring AI vs FastAPI', '성능과 개발 생산성 측면에서 어떤 프레임워크가 나을까요?', 2),
  createSession('4', 'Spring AI LangGraph 통합', 'Spring AI에 LangGraph를 연결하는 순서를 정리해보겠습니다.', 3),
  createSession('5', 'MongoDB 데이터 모델링 패턴', '도큐먼트 구조를 어떻게 나눠야 할지 함께 설계해볼까요?', 4),
  createSession('6', '백엔드 아키텍처 설계', '확장 가능한 모듈형 아키텍처를 구성하는 법을 알려드릴게요.', 5),
  createSession('7', '채팅 기록 저장 DB', '채팅 로그를 안정적으로 저장하는 DB 스키마를 살펴볼까요?', 6),
];

export function StudentChat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(initialChatSessions);
  const [activeChatId, setActiveChatId] = useState(() => initialChatSessions[0]?.id ?? '1');
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeChat = useMemo(
    () => chatSessions.find((chat) => chat.id === activeChatId) ?? chatSessions[0],
    [activeChatId, chatSessions],
  );
  const messages = activeChat?.messages ?? [];

  const filteredChats = useMemo(() => {
    const visibleChats = chatSessions.filter(
      (chat) =>
        !chat.isUserSession || chat.messages.some((message) => message.role === 'user'),
    );

    return visibleChats.filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chatSessions, searchQuery]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const currentChatId = activeChat.id;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;
        const updatedMessages = [...chat.messages, userMessage];
        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: userMessage.content,
          timestamp: userMessage.timestamp,
        };
      }),
    );
    setInput('');
    setIsThinking(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      timestamp: new Date(),
      streaming: true,
    };

    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, aiMessage],
            }
          : chat,
      ),
    );
    setIsThinking(false);

    try {
      await streamChat(
        {
          message: userMessage.content,
          userId: activeChat.userId,
          sessionId: activeChat.sessionId || activeChat.id,
        },
        (chunk) => {
          setChatSessions((prev) =>
            prev.map((chat) => {
              if (chat.id !== currentChatId) return chat;
              return {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + chunk }
                    : msg,
                ),
                lastMessage: chat.messages.find((msg) => msg.id === aiMessageId)?.content || chat.lastMessage,
                timestamp: new Date(),
              };
            }),
          );
        },
        () => {
          setChatSessions((prev) =>
            prev.map((chat) => {
              if (chat.id !== currentChatId) return chat;
              return {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, streaming: false }
                    : msg,
                ),
              };
            }),
          );
        },
        (error) => {
          console.error('Chat streaming error:', error);
          setChatSessions((prev) =>
            prev.map((chat) => {
              if (chat.id !== currentChatId) return chat;
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
              };
            }),
          );
        },
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const timestamp = new Date();
    const greeting: Message = {
      id: `${newId}-ai`,
      role: 'ai',
      content: '안녕하세요! 어떤 주제든 단계별로 이해를 도와드릴게요. 무엇을 배우고 싶으신가요?',
      timestamp,
    };

    const existingDraft = chatSessions.find(
      (chat) => chat.isUserSession && !chat.messages.some((message) => message.role === 'user'),
    );

    if (existingDraft) {
      setActiveChatId(existingDraft.id);
      setSidebarOpen(true);
      return;
    }

    const newChat: ChatSession = {
      id: newId,
      title: '새 채팅',
      lastMessage: greeting.content,
      timestamp,
      messages: [greeting],
      isUserSession: true,
    };

    setChatSessions((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    setIsThinking(false);
    setSidebarOpen(true);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setIsThinking(false);
  };

  const handleDeleteChat = (id: string) => {
    setChatSessions((prev) => {
      const next = prev.filter((chat) => chat.id !== id);
      if (id === activeChatId) {
        setActiveChatId(next[0]?.id ?? '');
      }
      return next;
    });
    if (id === activeChatId) {
      setIsThinking(false);
    }
  };

  const handleDeleteAllChats = () => {
    setChatSessions([]);
    setActiveChatId('');
    setIsThinking(false);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)] relative">
      <ChatSidebar
        isOpen={sidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        chats={filteredChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onDeleteAllChats={handleDeleteAllChats}
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

          <ChatMessages messages={messages} isThinking={isThinking} />
          <ChatComposer value={input} onChange={setInput} onSend={handleSend} />
        </div>

        <LearningInsights />
      </div>
    </div>
  );
}

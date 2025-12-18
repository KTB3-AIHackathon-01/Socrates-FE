import { MessageSquare, Plus, Search, Settings, Menu, X } from 'lucide-react'
import type { ChatSession } from '@/chat/types'

interface ChatSidebarProps {
  isOpen: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  chats: ChatSession[]
  activeChatId: string
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onToggle: (open: boolean) => void
  formatTimestamp: (date: Date) => string
}

export function ChatSidebar({
  isOpen,
  searchQuery,
  onSearchChange,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onToggle,
  formatTimestamp,
}: ChatSidebarProps) {
  return (
    <>
      <div
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden`}
      >
        {isOpen && (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white">채팅 목록</h3>
                <button
                  onClick={() => onToggle(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                새 채팅
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="채팅 검색"
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-2 px-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">내 채팅</p>
              </div>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors group ${
                      activeChatId === chat.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm line-clamp-1 ${
                            activeChatId === chat.id
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatTimestamp(chat.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300">
                <Settings className="w-4 h-4" />
                설정
              </button>
            </div>
          </>
        )}
      </div>

      {!isOpen && (
        <button
          onClick={() => onToggle(true)}
          className="absolute left-0 top-4 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </>
  )
}

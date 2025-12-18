import { MessageSquare, Plus, Search, Menu, X } from 'lucide-react'

import type { ChatSessionResponse } from '../api/types'

interface ChatSidebarProps {
  isOpen: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sessions: ChatSessionResponse[]
  activeChatId: string
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onToggle: (open: boolean) => void
  formatTimestamp: (date: Date) => string
}

export function ChatSidebar({ isOpen, searchQuery, onSearchChange, sessions, activeChatId, onSelectChat, onNewChat, onToggle }: ChatSidebarProps) {
  return (
    <>
      <div className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden`}>
        {isOpen && (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 dark:text-white">채팅 목록</h3>
                <button onClick={() => onToggle(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />새 채팅
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
                {sessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1 ${activeChatId === session.sessionId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <button
                      onClick={() => onSelectChat(session.sessionId)}
                      className={`flex-1 text-left px-1 py-1 rounded-lg transition-colors focus:outline-none ${
                        activeChatId === session.sessionId
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-1">{session.name}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
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

import type { Message } from '@/chat/types'

interface ChatMessagesProps {
  messages: Message[]
  isThinking: boolean
}

export function ChatMessages({ messages, isThinking }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            <p className="whitespace-pre-line">{message.content}</p>
            {message.comprehensionCheck && (
              <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">이해도 체크</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                    이해했어요 ✓
                  </button>
                  <button className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                    다시 설명해주세요
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex justify-start">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">생각하는 중...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

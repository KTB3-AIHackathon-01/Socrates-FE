import { AlertTriangle, FileText, Loader2 } from 'lucide-react'
import type { Message } from '@/chat/types'

interface ChatMessagesProps {
  messages: Message[]
  isThinking: boolean
  sessionCompleted?: boolean
  reportStatus?: 'idle' | 'loading' | 'ready' | 'error'
  reportMarkdown?: string
}

export function ChatMessages({ messages, isThinking, sessionCompleted, reportStatus, reportMarkdown }: ChatMessagesProps) {
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

      {sessionCompleted && reportStatus === 'loading' && (
        <div className="flex justify-start">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-blue-900 dark:text-blue-100">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>세션이 종료되었어요. 리포트를 준비하고 있습니다...</span>
          </div>
        </div>
      )}

      {sessionCompleted && reportStatus === 'error' && (
        <div className="flex justify-start">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-red-900 dark:text-red-100">
            <AlertTriangle className="w-4 h-4" />
            <span>리포트를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.</span>
          </div>
        </div>
      )}

      {sessionCompleted && reportStatus === 'ready' && reportMarkdown && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <FileText className="w-4 h-4 text-indigo-500" />
            세션 리포트
          </div>
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{reportMarkdown}</pre>
        </div>
      )}
    </div>
  )
}

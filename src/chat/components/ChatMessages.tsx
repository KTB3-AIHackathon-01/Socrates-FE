import { useEffect, useMemo, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, FileText, Loader2, Maximize2 } from 'lucide-react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '@/chat/types'

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 mb-3" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 text-sm text-gray-800 dark:text-gray-200 space-y-1 mb-3" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 text-sm text-gray-800 dark:text-gray-200 space-y-1 mb-3" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </em>
  ),
  code: ({ children, className }) => {
    const isInline = !className

    if (isInline) {
      return <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>
    }

    return (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-auto mb-4">
        <code className={className}>{children}</code>
      </pre>
    )
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 text-sm text-gray-800 dark:text-gray-100 italic mb-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border border-gray-200 dark:border-gray-700 text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-100 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 align-top" {...props}>
      {children}
    </td>
  ),
}

interface ChatMessagesProps {
  messages: Message[]
  isThinking: boolean
  sessionCompleted?: boolean
  reportStatus?: 'idle' | 'loading' | 'ready' | 'error'
  reportMarkdown?: string
}

export function ChatMessages({ messages, isThinking, sessionCompleted, reportStatus, reportMarkdown }: ChatMessagesProps) {
  const [isReportDialogOpen, setReportDialogOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reportPreview = useMemo(() => reportMarkdown?.slice(0, 1200) ?? '', [reportMarkdown])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isThinking])

  useEffect(() => {
    if (!isReportDialogOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setReportDialogOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isReportDialogOpen])

  const renderMarkdown = (content?: string, clamp?: boolean) => {
    if (!content) return null
    return (
      <div className={`markdown-body ${clamp ? 'max-h-64 overflow-hidden relative pr-2' : ''}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
        {clamp && (
          <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white via-white/70 dark:from-gray-900 dark:via-gray-900/60" />
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
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
        <>
          <button
            type="button"
            onClick={() => setReportDialogOpen(true)}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-4 shadow-sm space-y-4 text-left w-full hover:border-indigo-400 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <FileText className="w-4 h-4 text-indigo-500" />
              세션 리포트
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                클릭하면 크게 볼 수 있어요
              </span>
              <Maximize2 className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
            {renderMarkdown(reportPreview, true)}
          </button>
          {isMounted &&
            isReportDialogOpen &&
            createPortal(
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/70"
                  role="presentation"
                  onClick={() => setReportDialogOpen(false)}
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-[600px] max-w-[90vw] min-h-[600px] max-h-[85vh] overflow-y-auto p-6"
                  style={{ width: '600px', minHeight: '600px' }}
                >
                  <button
                    type="button"
                    onClick={() => setReportDialogOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="Close report dialog"
                  >
                    ✕
                  </button>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      세션 리포트
                    </div>
                    {renderMarkdown(reportMarkdown)}
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  )
}

import { Send } from 'lucide-react'
import { useCallback, type KeyboardEvent } from 'react'

interface ChatComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatComposer({ value, onChange, onSend, disabled = false, placeholder }: ChatComposerProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      if (event.key !== 'Enter') return

      const isComposing = event.nativeEvent.isComposing
      if (isComposing) return

      event.preventDefault()
      onSend()
    },
    [disabled, onSend],
  )

  const isDisabled = disabled || !value.trim()
  const inputPlaceholder = placeholder ?? '질문을 입력하세요...'

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? '해당 세션이 종료되었습니다. 새로운 채팅을 시작해주세요.' : inputPlaceholder}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
        />
        <button
          onClick={onSend}
          disabled={isDisabled}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

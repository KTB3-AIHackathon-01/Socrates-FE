import { useState } from 'react'
import type { FormEvent } from 'react'

interface InstructorPromptProps {
  onSubmit: (nickname: string) => void
}

const copy = {
  title: '강사 닉네임을 입력해주세요',
  description: '대시보드에 접근하기 전에 사용할 닉네임을 등록해야 해요.',
  placeholder: '예: 러닝코치',
  cta: '강사 닉네임 등록',
} as const

export function InstructorPrompt({ onSubmit }: InstructorPromptProps) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = nickname.trim()

    if (!trimmed) {
      setError('닉네임을 입력해주세요.')
      return
    }

    setError('')
    onSubmit(trimmed)
    setNickname('')
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{copy.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{copy.description}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder={copy.placeholder}
              className="
                w-full
                rounded-xl
                border border-gray-200 dark:border-gray-700
                bg-white/80 dark:bg-gray-900/60
                px-4 py-3
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              "
            />
            {error && <p className="text-sm font-medium text-[#ef4444]">{error}</p>}
          </div>

          <button
            type="submit"
            className="
              w-full
              rounded-xl
              bg-gradient-to-r from-blue-600 to-indigo-600
              py-4
              font-medium
              text-white
              shadow-lg shadow-blue-600/20
              transition-colors
              hover:from-blue-500 hover:to-indigo-500
            "
          >
            {copy.cta}
          </button>
        </form>
      </div>
    </div>
  )
}

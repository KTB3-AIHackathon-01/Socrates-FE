import { useState } from 'react'
import type { FormEvent } from 'react'

interface StudentPromptProps {
  onSubmit: (nickname: string, instructorId: string) => void
}

const copy = {
  title: '학생 닉네임을 입력해주세요',
  description: 'AI 러닝 파트너와 대화를 시작하기 전에 사용할 닉네임이 필요해요.',
  placeholder: '예: 코드마스터',
  cta: '학생 닉네임 등록',
} as const

const instructorOptions = [
  { id: 'inst-01', name: '박지훈 강사' },
  { id: 'inst-02', name: '최은서 강사' },
  { id: 'inst-03', name: '한민혁 강사' },
  { id: 'inst-04', name: '정유리 강사' },
] as const

export function StudentPrompt({ onSubmit }: StudentPromptProps) {
  const [nickname, setNickname] = useState('')
  const [selectedInstructor, setSelectedInstructor] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [instructorError, setInstructorError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = nickname.trim()
    let hasError = false

    if (!trimmed) {
      setNicknameError('닉네임을 입력해주세요.')
      hasError = true
    } else {
      setNicknameError('')
    }

    if (!selectedInstructor) {
      setInstructorError('강사를 선택해주세요.')
      hasError = true
    } else {
      setInstructorError('')
    }

    if (hasError) return

    onSubmit(trimmed, selectedInstructor)
    setNickname('')
    setSelectedInstructor('')
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
            {nicknameError && (
              <p className="text-sm font-medium text-[#ef4444]">{nicknameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="instructor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              담당 강사 선택
            </label>
            <select
              id="instructor"
              value={selectedInstructor}
              onChange={(event) => setSelectedInstructor(event.target.value)}
              className="
                w-full
                rounded-xl
                border border-gray-200 dark:border-gray-700
                bg-white/80 dark:bg-gray-900/60
                px-4 py-3
                text-gray-900 dark:text-white
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              "
            >
              <option value="">강사를 선택해주세요</option>
              {instructorOptions.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
            {instructorError && (
              <p className="text-sm font-medium text-[#ef4444]">{instructorError}</p>
            )}
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

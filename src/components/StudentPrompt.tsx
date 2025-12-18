import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { chatAPI } from '@/chat/api/chatAPI'
import type { InstructorResponse } from '@/chat/api/types'

interface StudentPromptProps {
  onSubmit: (studentId: string, instructorId: string) => void
}

const copy = {
  title: '학생 닉네임을 입력해주세요',
  description: 'AI 러닝 파트너와 대화를 시작하기 전에 사용할 닉네임이 필요해요.',
  placeholder: '예: 코드마스터',
  cta: '학생 닉네임 등록',
} as const

export function StudentPrompt({ onSubmit }: StudentPromptProps) {
  const [nickname, setNickname] = useState('')
  const [selectedInstructor, setSelectedInstructor] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [instructorError, setInstructorError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [instructorFetchError, setInstructorFetchError] = useState('')
  const [instructors, setInstructors] = useState<InstructorResponse[]>([])
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isActive = true

    const fetchInstructors = async () => {
      setIsLoadingInstructors(true)
      setInstructorFetchError('')

      try {
        const response = await chatAPI.getInstructors()
        if (!isActive) return
        setInstructors(response)
      } catch {
        if (!isActive) return
        setInstructorFetchError('강사 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
        setInstructors([])
      } finally {
        if (!isActive) return
        setIsLoadingInstructors(false)
      }
    }

    void fetchInstructors()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!selectedInstructor) return
    if (instructors.some((instructor) => instructor.instructorId === selectedInstructor)) return
    setSelectedInstructor('')
  }, [instructors, selectedInstructor])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    if (isLoadingInstructors) {
      setInstructorError('강사 목록을 불러오는 중이에요. 잠시만 기다려주세요.')
      hasError = true
    }

    if (hasError) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const student = await chatAPI.createStudent({
        name: trimmed,
        instructorId: selectedInstructor,
      })
      onSubmit(student.studentId, student.instructorId)
      setNickname('')
      setSelectedInstructor('')
    } catch {
      setSubmitError('등록에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
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
              disabled={isSubmitting}
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
                disabled:cursor-not-allowed disabled:opacity-60
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
              disabled={isSubmitting || isLoadingInstructors || instructors.length === 0}
              className="
                w-full
                rounded-xl
                border border-gray-200 dark:border-gray-700
                bg-white/80 dark:bg-gray-900/60
                px-4 py-3
                text-gray-900 dark:text-white
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              <option value="" disabled={isLoadingInstructors}>
                {isLoadingInstructors ? '강사 목록을 불러오는 중...' : '강사를 선택해주세요'}
              </option>
              {instructors.map((instructor) => (
                <option key={instructor.instructorId} value={instructor.instructorId}>
                  {instructor.instructorName}
                </option>
              ))}
            </select>
            {instructorError && (
              <p className="text-sm font-medium text-[#ef4444]">{instructorError}</p>
            )}
            {instructorFetchError && (
              <p className="text-sm font-medium text-[#ef4444]">{instructorFetchError}</p>
            )}
          </div>

          {submitError && <p className="text-sm font-medium text-[#ef4444]">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
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
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {isSubmitting ? '등록 중...' : copy.cta}
          </button>
        </form>
      </div>
    </div>
  )
}

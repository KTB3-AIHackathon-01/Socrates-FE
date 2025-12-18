import { useState } from 'react'
import { StudentChat } from '@/chat'
import { InstructorDashboard } from '@/dashboard'
import { StudentPrompt } from '@/components/StudentPrompt'
import { InstructorPrompt } from '@/components/InstructorPrompt'
import { GraduationCap, LayoutDashboard } from 'lucide-react'

const STORAGE_KEYS = {
  student: 'student-id',
  instructor: 'instructor-id',
} as const
const STUDENT_INSTRUCTOR_KEY = 'student-instructor'

const getStoredNickname = (key: string) => {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem(key)
}

export default function App() {
  const [mode, setMode] = useState<'student' | 'instructor'>('student')
  const [studentId, setStudentId] = useState<string | null>(() =>
    getStoredNickname(STORAGE_KEYS.student),
  )
  const [instructorId, setInstructorId] = useState<string | null>(() =>
    getStoredNickname(STORAGE_KEYS.instructor),
  )

  const shouldShowNicknamePrompt = mode === 'student' ? !studentId : !instructorId

  const handleStudentNicknameSubmit = (nickname: string, instructorSelection: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.student, nickname)
      window.localStorage.setItem(STUDENT_INSTRUCTOR_KEY, instructorSelection)
    }
    setStudentId(nickname)
  }

  const handleInstructorNicknameSubmit = (nickname: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.instructor, nickname)
    }
    setInstructorId(nickname)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 dark:text-white">AI 러닝 파트너</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  함께 성장하는 AI 학습 플랫폼
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setMode('student')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  mode === 'student'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                학생 모드
              </button>
              <button
                onClick={() => setMode('instructor')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  mode === 'instructor'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                강사 모드
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {shouldShowNicknamePrompt ? (
          mode === 'student' ? (
            <StudentPrompt onSubmit={handleStudentNicknameSubmit} />
          ) : (
            <InstructorPrompt onSubmit={handleInstructorNicknameSubmit} />
          )
        ) : mode === 'student' ? (
          <StudentChat />
        ) : (
          <InstructorDashboard />
        )}
      </main>
    </div>
  )
}

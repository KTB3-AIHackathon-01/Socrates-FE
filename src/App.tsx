import { useCallback, useEffect, useMemo, useState } from 'react'
import { StudentChat } from '@/chat'
import { InstructorDashboard } from '@/dashboard'
import { StudentPrompt } from '@/components/StudentPrompt'
import { InstructorPrompt } from '@/components/InstructorPrompt'
import { GraduationCap } from 'lucide-react'

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
  const [pathname, setPathname] = useState(() => {
    if (typeof window === 'undefined') return '/student'
    return window.location.pathname || '/student'
  })
  const [studentId, setStudentId] = useState<string | null>(() =>
    getStoredNickname(STORAGE_KEYS.student),
  )
  const [instructorId, setInstructorId] = useState<string | null>(() =>
    getStoredNickname(STORAGE_KEYS.instructor),
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onPopState = () => {
      setPathname(window.location.pathname || '/student')
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (pathname !== '/' && pathname !== '') return
    window.history.replaceState({}, '', '/student')
    setPathname('/student')
  }, [pathname])

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPathname(to)
  }, [])

  const isStudentRoute = pathname === '/student' || pathname.startsWith('/student/')
  const isInstructorRoute = pathname === '/instructor' || pathname.startsWith('/instructor/')

  const shouldShowNicknamePrompt = isStudentRoute ? !studentId : !instructorId

  const handleStudentNicknameSubmit = (studentId: string, instructorSelection: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.student, studentId)
      window.localStorage.setItem(STUDENT_INSTRUCTOR_KEY, instructorSelection)
    }
    setStudentId(studentId)
  }

  const handleInstructorNicknameSubmit = (nickname: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.instructor, nickname)
    }
    setInstructorId(nickname)
  }

  const content = useMemo(() => {
    if (!isStudentRoute && !isInstructorRoute) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            페이지를 찾을 수 없어요
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">아래 메뉴로 이동해주세요.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/student')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              학생 페이지
            </button>
            <button
              onClick={() => navigate('/instructor')}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              강사 페이지
            </button>
          </div>
        </div>
      )
    }

    if (shouldShowNicknamePrompt) {
      return isStudentRoute ? (
        <StudentPrompt onSubmit={handleStudentNicknameSubmit} />
      ) : (
        <InstructorPrompt onSubmit={handleInstructorNicknameSubmit} />
      )
    }

    return isStudentRoute ? <StudentChat /> : <InstructorDashboard />
  }, [
    handleInstructorNicknameSubmit,
    handleStudentNicknameSubmit,
    isInstructorRoute,
    isStudentRoute,
    navigate,
    shouldShowNicknamePrompt,
  ])

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

            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{content}</main>
    </div>
  )
}

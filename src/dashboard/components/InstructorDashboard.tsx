import { useEffect, useMemo, useState } from 'react'
import { Users, TrendingUp, MessageSquare, Brain, ChevronRight, Search } from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { dashboardAPI } from '@/dashboard/api'
import type {
  DashboardResponse,
  StudentDetailResponse,
  StudentStatisticsResponse,
} from '@/dashboard/types/api'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'] as const

type Trend = 'up' | 'down' | 'stable'

const formatGrowthRate = (growthRate?: number) => {
  if (typeof growthRate !== 'number') return null
  const percent = Math.abs(growthRate) <= 1 ? growthRate * 100 : growthRate
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(0)}%`
}

const mapTrend = (raw?: string): Trend => {
  if (!raw) return 'stable'
  const lower = raw.toLowerCase()
  if (lower.includes('up') || lower.includes('상승') || lower.includes('increase')) return 'up'
  if (lower.includes('down') || lower.includes('하락') || lower.includes('decrease')) return 'down'
  return 'stable'
}

export function InstructorDashboard() {
  const instructorId = localStorage.getItem('instructor-id') ?? undefined

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
  const [dashboardError, setDashboardError] = useState('')

  const [selectedStudent, setSelectedStudent] = useState<StudentStatisticsResponse | null>(null)
  const [studentDetail, setStudentDetail] = useState<StudentDetailResponse | null>(null)
  const [isLoadingStudentDetail, setIsLoadingStudentDetail] = useState(false)
  const [studentDetailError, setStudentDetailError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isActive = true

    const loadDashboard = async () => {
      setIsLoadingDashboard(true)
      setDashboardError('')

      try {
        const response = await dashboardAPI.getDashboard({ instructorId })
        if (!isActive) return
        setDashboard(response)
      } catch {
        if (!isActive) return
        setDashboard(null)
        setDashboardError('대시보드 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      } finally {
        if (!isActive) return
        setIsLoadingDashboard(false)
      }
    }

    void loadDashboard()

    return () => {
      isActive = false
    }
  }, [instructorId])

  useEffect(() => {
    let isActive = true

    const loadDetail = async () => {
      if (!selectedStudent) return

      setIsLoadingStudentDetail(true)
      setStudentDetailError('')
      setStudentDetail(null)

      try {
        const response = await dashboardAPI.getStudentDetail({ instructorId: instructorId })
        if (!isActive) return
        setStudentDetail(response)
      } catch {
        if (!isActive) return
        setStudentDetailError('학생 상세 정보를 불러오지 못했어요.')
      } finally {
        if (!isActive) return
        setIsLoadingStudentDetail(false)
      }
    }

    void loadDetail()

    return () => {
      isActive = false
    }
  }, [selectedStudent])

  const metrics = dashboard?.metrics
  const students = dashboard?.studentStatistics ?? []

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return students
    return students.filter((student) => student.studentName.toLowerCase().includes(query))
  }, [searchQuery, students])

  const learningTrendData = useMemo(() => {
    return (dashboard?.weeklyTrend ?? []).map((item) => ({
      date: item.dayOfWeek ?? item.date,
      questions: item.questionCount,
      comprehension: item.understandingPercent ?? Math.round(item.understandingScore ?? 0),
    }))
  }, [dashboard])

  const questionTypeData = useMemo(() => {
    const qt = dashboard?.questionTypes
    if (!qt) return []
    return [
      {
        type: qt.conceptUnderstanding.label,
        count: qt.conceptUnderstanding.percent,
        color: qt.conceptUnderstanding.color,
      },
      {
        type: qt.problemSolving.label,
        count: qt.problemSolving.percent,
        color: qt.problemSolving.color,
      },
      {
        type: qt.practicalLearning.label,
        count: qt.practicalLearning.percent,
        color: qt.practicalLearning.color,
      },
      { type: qt.review.label, count: qt.review.percent, color: qt.review.color },
    ]
  }, [dashboard])

  return (
    <div className="space-y-6">
      {dashboardError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-sm text-red-700 dark:text-red-200">
          {dashboardError}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {formatGrowthRate(metrics?.activeStudents.growthRate) ?? '-'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">활성 학생</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {isLoadingDashboard ? '-' : `${metrics?.activeStudents.currentValue ?? 0}명`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {formatGrowthRate(metrics?.todayQuestions.growthRate) ?? '-'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">오늘의 질문</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {isLoadingDashboard ? '-' : `${metrics?.todayQuestions.currentValue ?? 0}개`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {formatGrowthRate(metrics?.averageUnderstanding.growthRate) ?? '-'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">평균 이해도</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {isLoadingDashboard ? '-' : `${metrics?.averageUnderstanding.currentValue ?? 0}%`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {formatGrowthRate(metrics?.learningParticipation.growthRate) ?? '-'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">학습 참여율</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {isLoadingDashboard ? '-' : `${metrics?.learningParticipation.currentValue ?? 0}%`}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">주간 학습 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningTrendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                className="dark:stroke-gray-700"
              />
              <XAxis dataKey="date" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <YAxis stroke="#9ca3af" className="dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="questions"
                stroke="#3b82f6"
                strokeWidth={2}
                name="질문 수"
              />
              <Line
                type="monotone"
                dataKey="comprehension"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="이해도 %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Question Types */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">질문 유형 분석</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={questionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {questionTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 dark:text-white">학생 현황</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="학생 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  학생명
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  질문 수
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  이해도
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  최근 활동
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  추세
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const trend = mapTrend(student.trend)
                return (
                  <tr
                    key={student.studentId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                          {student.studentName[0]}
                        </div>
                        <span className="text-gray-900 dark:text-gray-100">
                          {student.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {student.questionCount}개
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              student.understandingPercent >= 90
                                ? 'bg-green-500'
                                : student.understandingPercent >= 80
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                            }`}
                            style={{ width: `${student.understandingPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {student.understandingPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {student.lastActivityFormatted ?? student.lastActivity ?? '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          trend === 'up'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : trend === 'down'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                        {trend === 'up' ? '상승' : trend === 'down' ? '하락' : '유지'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        상세보기
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!isLoadingDashboard && !students.length && (
            <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">
              표시할 학생이 없어요.
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl">
                  {selectedStudent.studentName[0]}
                </div>
                <div>
                  <h2 className="text-gray-900 dark:text-white">{selectedStudent.studentName}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">학습 상세 정보</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">총 질문 수</p>
                  <p className="text-blue-900 dark:text-blue-200">
                    {studentDetail?.totalQuestions ?? selectedStudent.questionCount}개
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">이해도</p>
                  <p className="text-green-900 dark:text-green-200">
                    {studentDetail?.learningSummary?.overallProgressScore
                      ? `${Math.round(studentDetail.learningSummary.overallProgressScore)}%`
                      : `${selectedStudent.understandingPercent}%`}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">최근 활동</p>
                  <p className="text-purple-900 dark:text-purple-200">
                    {studentDetail?.lastActivity ?? selectedStudent.lastActivityFormatted ?? '-'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 dark:text-white mb-3">학습 가이드</h4>
                {isLoadingStudentDetail ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">불러오는 중...</div>
                ) : studentDetailError ? (
                  <div className="text-sm text-[#ef4444]">{studentDetailError}</div>
                ) : studentDetail ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-gray-100">다음 세션 목표</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {studentDetail.instructionalGuidance?.nextSessionGoal ?? '-'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-gray-100">추천 연습</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {studentDetail.instructionalGuidance?.recommendedPractice ?? '-'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    표시할 정보가 없어요.
                  </div>
                )}
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="text-amber-900 dark:text-amber-100 mb-2">AI 추천 사항</h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {studentDetail?.instructionalGuidance?.teachingRecommendations?.[0]
                    ? studentDetail.instructionalGuidance.teachingRecommendations[0]
                    : '추천 사항을 불러오는 중이에요.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

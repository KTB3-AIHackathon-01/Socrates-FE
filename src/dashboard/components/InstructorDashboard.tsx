import { useState } from 'react';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Brain,
  AlertTriangle,
  Search,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Student {
  id: string;
  name: string;
  questionsCount: number;
  comprehensionRate: number;
  lastActive: string;
  trend: 'up' | 'down' | 'stable';
}

interface KeywordData {
  keyword: string;
  count: number;
}

interface TopicData {
  topic: string;
  questions: number;
}

interface RepeatStudent {
  id: string;
  name: string;
  concept: string;
  repeatCount: number;
}

const mockStudents: Student[] = [
  { id: '1', name: '김지훈', questionsCount: 45, comprehensionRate: 92, lastActive: '5분 전', trend: 'up' },
  { id: '2', name: '이서연', questionsCount: 38, comprehensionRate: 88, lastActive: '12분 전', trend: 'up' },
  { id: '3', name: '박민준', questionsCount: 29, comprehensionRate: 76, lastActive: '25분 전', trend: 'down' },
  { id: '4', name: '최예은', questionsCount: 52, comprehensionRate: 95, lastActive: '2분 전', trend: 'up' },
  { id: '5', name: '정우진', questionsCount: 41, comprehensionRate: 82, lastActive: '18분 전', trend: 'stable' },
];

const learningTrendData = [
  { date: '월', questions: 24, comprehension: 78 },
  { date: '화', questions: 32, comprehension: 82 },
  { date: '수', questions: 28, comprehension: 80 },
  { date: '목', questions: 41, comprehension: 85 },
  { date: '금', questions: 35, comprehension: 88 },
];

// MVP 지표 ① 질문 키워드 빈도 TOP N
const keywordFrequency: KeywordData[] = [
  { keyword: 'async/await', count: 18 },
  { keyword: 'Promise', count: 12 },
  { keyword: 'EventLoop', count: 9 },
  { keyword: 'Callback', count: 7 },
  { keyword: 'Redux', count: 6 },
];

// MVP 지표 ② 주제별 질문 밀집도
const topicDensity: TopicData[] = [
  { topic: '비동기 처리', questions: 45 },
  { topic: 'React Hooks', questions: 32 },
  { topic: 'TypeScript', questions: 28 },
  { topic: 'HTTP 통신', questions: 18 },
  { topic: 'State 관리', questions: 15 },
  { topic: 'DB 트랜잭션', questions: 8 },
];

// MVP 지표 ③ 반복 질문 학생
const repeatStudents: RepeatStudent[] = [
  { id: 's12', name: '박민준', concept: 'async/await', repeatCount: 4 },
  { id: 's07', name: '정우진', concept: 'Promise', repeatCount: 3 },
  { id: 's23', name: '김수진', concept: 'Redux', repeatCount: 3 },
  { id: 's15', name: '이준호', concept: 'EventLoop', repeatCount: 2 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export function InstructorDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">활성 학생</p>
          <p className="text-gray-900 dark:text-white mt-1">128명</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">오늘의 질문</p>
          <p className="text-gray-900 dark:text-white mt-1">1,247개</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +5%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">평균 이해도</p>
          <p className="text-gray-900 dark:text-white mt-1">86.5%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              주의 필요
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">반복 질문 학생</p>
          <p className="text-gray-900 dark:text-white mt-1">{repeatStudents.length}명</p>
        </div>
      </div>

      {/* 학습 추이 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900 dark:text-white">학습 추세</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">질문 수와 이해도 추이</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">최근 5일</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
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
              <Line type="monotone" dataKey="questions" stroke="#3b82f6" strokeWidth={2} name="질문 수" />
              <Line type="monotone" dataKey="comprehension" stroke="#8b5cf6" strokeWidth={2} name="이해도 %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">질문 유형 분석</h3>
          <ul className="space-y-3">
            {['개념 이해', '문제 해결', '심화 학습', '복습'].map((type, index) => (
              <li key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-gray-900 dark:text-gray-100">{type}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{[45, 38, 22, 15][index]}건</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MVP 핵심 지표 3개 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MVP 지표 ① 질문 키워드 빈도 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="mb-4">
            <h3 className="text-gray-900 dark:text-white mb-1">가장 많이 막히는 개념</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              학생들이 반복적으로 질문하는 키워드 TOP 5
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={keywordFrequency} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
              <XAxis type="number" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <YAxis dataKey="keyword" type="category" stroke="#9ca3af" className="dark:stroke-gray-400" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} name="질문 수" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>액션:</strong> 다음 수업에서 'async/await' 개념 보강 권장
            </p>
          </div>
        </div>

        {/* MVP 지표 ② 주제별 질문 밀집도 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="mb-4">
            <h3 className="text-gray-900 dark:text-white mb-1">커리큘럼별 어려움 구간</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">주제별 질문 밀집도 분석</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topicDensity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
              <XAxis type="number" stroke="#9ca3af" className="dark:stroke-gray-400" />
              <YAxis dataKey="topic" type="category" stroke="#9ca3af" className="dark:stroke-gray-400" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="questions" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="질문 수" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              💡 <strong>액션:</strong> '비동기 처리' 섹션에 추가 예제 제공 필요
            </p>
          </div>
        </div>
      </div>

      {/* MVP 지표 ③ 반복 질문 학생 (Risk Indicator) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-gray-900 dark:text-white">개별 케어 필요 학생</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            같은 개념을 반복적으로 질문하는 학생 목록 (조기 식별)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {repeatStudents.map((student) => (
            <div
              key={student.id}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white">
                  {student.name[0]}
                </div>
                <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                  {student.repeatCount}회
                </span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 mb-1">{student.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                반복 개념: <span className="text-amber-700 dark:text-amber-300">{student.concept}</span>
              </p>
              <button className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition-colors">
                1:1 케어 시작
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            💡 <strong>액션:</strong> 위 학생들에게 개별 질문 유도 또는 보충 자료 전달 권장
          </p>
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
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">학생명</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">질문 수</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">이해도</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">최근 활동</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">추세</th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
                        {student.name[0]}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{student.questionsCount}개</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            student.comprehensionRate >= 90
                              ? 'bg-green-500'
                              : student.comprehensionRate >= 80
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${student.comprehensionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{student.comprehensionRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{student.lastActive}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        student.trend === 'up'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : student.trend === 'down'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {student.trend === 'up' ? '↑' : student.trend === 'down' ? '↓' : '→'}
                      {student.trend === 'up' ? '상승' : student.trend === 'down' ? '하락' : '유지'}
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
              ))}
            </tbody>
          </table>
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
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h2 className="text-gray-900 dark:text-white">{selectedStudent.name}</h2>
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
                  <p className="text-blue-900 dark:text-blue-200">{selectedStudent.questionsCount}개</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">이해도</p>
                  <p className="text-green-900 dark:text-green-200">{selectedStudent.comprehensionRate}%</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">최근 활동</p>
                  <p className="text-purple-900 dark:text-purple-200">{selectedStudent.lastActive}</p>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 dark:text-white mb-3">최근 학습 활동</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Python 리스트 컴프리헨션 개념 학습</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">15분 전 • 이해도 95%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">반복문 최적화 방법 질문</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">1시간 전 • 이해도 88%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">함수 재귀 호출 개념 복습</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">2시간 전 • 이해도 92%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="text-amber-900 dark:text-amber-100 mb-2">AI 추천 사항</h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {selectedStudent.name} 학생은 개념 이해가 빠르지만, 심화 문제에서 어려움을 겪고 있습니다. 실전 연습 문제를 더 제공하는 것을 추천합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react'

export function LearningInsights() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          오늘의 학습
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">질문 횟수</span>
              <span className="text-gray-900 dark:text-gray-100">12회</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">이해도</span>
              <span className="text-gray-900 dark:text-gray-100">85%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-800">
        <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          학습 팁
        </h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
            <span className="text-gray-700 dark:text-gray-300">답을 바로 요구하지 말고, 문제 해결 과정을 질문하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
            <span className="text-gray-700 dark:text-gray-300">이해가 안 되면 즉시 "다시 설명해주세요"를 눌러주세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
            <span className="text-gray-700 dark:text-gray-300">스스로 먼저 생각하고, AI는 가이드로 활용하세요</span>
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-lg p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-amber-900 dark:text-amber-100 mb-1">주의하세요</h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              AI가 제공하는 답변을 무조건 복사하지 말고, 이해하고 자신의 언어로 표현해보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface MetricResponse {
  currentValue: number
  growthRate?: number
  previousValue?: number
}

export interface ParticipationRateResponse {
  currentValue: number
  growthRate?: number
  previousValue?: number
  activeStudents?: number
  totalStudents?: number
}

export interface MetricsSection {
  activeStudents: MetricResponse
  todayQuestions: MetricResponse
  averageUnderstanding: MetricResponse
  learningParticipation: ParticipationRateResponse
}

export interface WeeklyTrendResponse {
  date: string
  dayOfWeek?: string
  questionCount: number
  understandingScore?: number
  understandingPercent?: number
}

export interface QuestionTypeItem {
  label: string
  ratio: number
  percent: number
  color: string
}

export interface QuestionTypeResponse {
  conceptUnderstanding: QuestionTypeItem
  problemSolving: QuestionTypeItem
  practicalLearning: QuestionTypeItem
  review: QuestionTypeItem
}

export interface StudentStatisticsResponse {
  studentId: string
  studentName: string
  questionCount: number
  understandingScore?: number
  understandingPercent: number
  understandingLevel?: string
  lastActivity?: string
  lastActivityFormatted?: string
  trend?: string
  trendIcon?: string
}

export interface DashboardResponse {
  metrics: MetricsSection
  weeklyTrend: WeeklyTrendResponse[]
  questionTypes: QuestionTypeResponse
  studentStatistics: StudentStatisticsResponse[]
}

export interface StudentPageResponse {
  content: StudentStatisticsResponse[]
  totalElements: number
  totalPages: number
  currentPage: number
}

export interface LearningSummary {
  overallProgressScore: number
  overallDifficultyScore: number
  masteryRatio: number
}

export interface StuckConcept {
  concept: string
  stuckTurns: number
  resolved: boolean
}

export interface LearningDifficulty {
  primaryRootCause: string
  secondaryRootCause: string
  stuckConcepts: StuckConcept[]
}

export interface QuestionTypeRatio {
  definition: number
  mechanism: number
  comparison: number
}

export interface LearningBehavior {
  questionDepthScore: number
  questionTypeRatio: QuestionTypeRatio
  conceptLinkScore: number
  confirmationQuestionRatio: number
}

export interface ConceptMastery {
  concept: string
  importance: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'NOT_STARTED' | 'PARTIAL' | 'MASTERED'
  understandingScore: number
  breakthrough: boolean
  evidenceQuestion: string
}

export interface InstructionalGuidance {
  nextFocusConcepts: string[]
  teachingRecommendations: string[]
  nextSessionGoal: string
  recommendedPractice: string
}

export interface StudentDetailResponse {
  studentId: string
  studentName: string
  totalQuestions: number
  lastActivity: string
  learningSummary: LearningSummary
  conceptMastery: ConceptMastery[]
  learningDifficulty: LearningDifficulty
  learningBehavior: LearningBehavior
  instructionalGuidance: InstructionalGuidance
  trend: string
}

export interface ActiveUsersResponse {
  activeUsers: number
  timeWindow: string
  timestamp: string
}

export interface UnderperformingStudent {
  studentId: string
  studentName: string
  progressScore: number
  unresolvedConcepts: string[]
  stuckDuration: string
}

export interface UnderperformingStudentResponse {
  students: UnderperformingStudent[]
  totalCount: number
}

export interface ResponseTimeResponse {
  avgResponseTime: number
  avgResponseTimeFormatted: string
  minResponseTime: number
  maxResponseTime: number
}

export interface HourlyActivityResponse {
  hour: number
  messageCount: number
}

export interface ConceptMasteryResponse {
  concept: string
  masteredCount: number
  totalStudents: number
  masteryRate: number
  masteryPercent: number
}

export interface DashboardAPIService {
  getDashboard(params?: {
    instructorId?: string
    studentIds?: string[]
  }): Promise<DashboardResponse>
  getWeeklyTrend(params?: {
    startDate?: string
    endDate?: string
    days?: number
  }): Promise<WeeklyTrendResponse[]>
  getStudentStatistics(params?: {
    instructorId?: string
    studentIds?: string[]
    page?: number
    size?: number
    sortBy?: string
    order?: string
  }): Promise<StudentPageResponse>
  getStudentDetail(params: { instructorId?: string }): Promise<StudentDetailResponse>

  getActiveUsers(params?: { minutes?: number }): Promise<ActiveUsersResponse>
  getQuestionTypes(params?: { period?: 'WEEK' | 'MONTH' | 'ALL' }): Promise<QuestionTypeResponse>
  getTodayQuestions(): Promise<MetricResponse>
  getParticipationRate(): Promise<ParticipationRateResponse>
  getAverageUnderstanding(params?: { period?: 'WEEK' | 'MONTH' | 'ALL' }): Promise<MetricResponse>
  getActiveStudents(params?: { period?: 'WEEK' | 'MONTH' | 'ALL' }): Promise<MetricResponse>

  getUnderperformingStudents(params?: {
    threshold?: number
  }): Promise<UnderperformingStudentResponse>
  getResponseTime(): Promise<ResponseTimeResponse>
  getHourlyActivity(params?: {
    startDate?: string
    endDate?: string
  }): Promise<HourlyActivityResponse[]>
  getConceptMastery(params: { concept: string }): Promise<ConceptMasteryResponse>
}

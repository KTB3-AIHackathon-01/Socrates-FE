import apiClient from './client'
import type {
  DashboardAPIService,
  ActiveUsersResponse,
  ConceptMasteryResponse,
  DashboardResponse,
  HourlyActivityResponse,
  MetricResponse,
  ParticipationRateResponse,
  QuestionTypeResponse,
  ResponseTimeResponse,
  StudentDetailResponse,
  StudentPageResponse,
  UnderperformingStudentResponse,
  WeeklyTrendResponse,
} from '../types/api'

export const dashboardAPI: DashboardAPIService = {
  async getDashboard(params) {
    const response = await apiClient.get<DashboardResponse>('/dashboard', { params })
    return response.data
  },

  async getWeeklyTrend(params) {
    const response = await apiClient.get<WeeklyTrendResponse[]>('/dashboard/weekly-trend', {
      params,
    })
    return response.data
  },

  async getStudentStatistics(params) {
    const response = await apiClient.get<StudentPageResponse>('/dashboard/students', { params })
    return response.data
  },

  async getStudentDetail(params) {
    const response = await apiClient.get<StudentDetailResponse>(`/dashboard/students`, { params })
    return response.data
  },

  async getActiveUsers(params) {
    const response = await apiClient.get<ActiveUsersResponse>('/dashboard/realtime/active-users', {
      params,
    })
    return response.data
  },

  async getQuestionTypes(params) {
    const response = await apiClient.get<QuestionTypeResponse>('/dashboard/question-types', {
      params,
    })
    return response.data
  },

  async getTodayQuestions() {
    const response = await apiClient.get<MetricResponse>('/dashboard/metrics/today-questions')
    return response.data
  },

  async getParticipationRate() {
    const response = await apiClient.get<ParticipationRateResponse>(
      '/dashboard/metrics/participation-rate',
    )
    return response.data
  },

  async getAverageUnderstanding(params) {
    const response = await apiClient.get<MetricResponse>(
      '/dashboard/metrics/average-understanding',
      { params },
    )
    return response.data
  },

  async getActiveStudents(params) {
    const response = await apiClient.get<MetricResponse>('/dashboard/metrics/active-students', {
      params,
    })
    return response.data
  },

  async getUnderperformingStudents(params) {
    const response = await apiClient.get<UnderperformingStudentResponse>(
      '/dashboard/analytics/underperforming-students',
      { params },
    )
    return response.data
  },

  async getResponseTime() {
    const response = await apiClient.get<ResponseTimeResponse>('/dashboard/analytics/response-time')
    return response.data
  },

  async getHourlyActivity(params) {
    const response = await apiClient.get<HourlyActivityResponse[]>(
      '/dashboard/analytics/hourly-activity',
      { params },
    )
    return response.data
  },

  async getConceptMastery(params) {
    const response = await apiClient.get<ConceptMasteryResponse>(
      '/dashboard/analytics/concept-mastery',
      { params },
    )
    return response.data
  },
}

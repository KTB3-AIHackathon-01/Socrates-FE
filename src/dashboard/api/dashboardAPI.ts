import apiClient from './client'
import type {
  DashboardAPIService,
  GetDashboardStatsResponse,
  GetLearningTrendResponse,
  GetQuestionTypesResponse,
  GetStudentsResponse,
  GetStudentDetailResponse,
  KeywordFrequency,
  TopicQuestionSummary,
  KeywordQuestion,
} from '../types/api'

export const dashboardAPI: DashboardAPIService = {
  async getDashboardStats() {
    const response = await apiClient.get<GetDashboardStatsResponse>('/dashboard/stats')
    return response.data
  },

  async getLearningTrend(period = 'week') {
    const response = await apiClient.get<GetLearningTrendResponse>('/dashboard/learning-trend', {
      params: { period },
    })
    return response.data
  },

  async getQuestionTypes(period = 'week') {
    const response = await apiClient.get<GetQuestionTypesResponse>('/dashboard/question-types', {
      params: { period },
    })
    return response.data
  },

  async getStudents(params) {
    const response = await apiClient.get<GetStudentsResponse>('/dashboard/students', {
      params,
    })
    return response.data
  },

  async getStudentDetail(studentId: string) {
    const response = await apiClient.get<GetStudentDetailResponse>(
      `/dashboard/students/${studentId}`,
    )
    return response.data
  },

  async getKeywordFrequencies(params) {
    const response = await apiClient.get<KeywordFrequency[]>('/dashboard/keywords', {
      params,
    })
    return response.data
  },

  async getTopicQuestionSummaries(params) {
    const response = await apiClient.get<TopicQuestionSummary[]>('/dashboard/topics', {
      params,
    })
    return response.data
  },

  async getKeywordQuestions(params) {
    const response = await apiClient.get<KeywordQuestion[]>('/dashboard/questions', {
      params,
    })
    return response.data
  },
}

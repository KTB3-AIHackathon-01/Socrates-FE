import apiClient from './client'
import type {
  DashboardAPIService,
  GetDashboardStatsResponse,
  GetLearningTrendResponse,
  GetQuestionTypesResponse,
  GetStudentsResponse,
  GetStudentDetailResponse,
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
}

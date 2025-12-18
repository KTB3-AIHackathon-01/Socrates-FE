import apiClient from './client'
import type {
  ChatAPIService,
  ChatHistoryResponse,
  ChatMessageResponse,
  ChatSessionResponse,
  CreateChatSessionRequest,
  CreateStudentRequest,
  GetSessionMessagesParams,
  GetStudentSessionsParams,
  InstructorResponse,
  PagedResponse,
  StudentResponse,
} from './types'

export const chatAPI: ChatAPIService = {
  async createStudent(payload: CreateStudentRequest) {
    const response = await apiClient.post<StudentResponse>('/students', payload)
    return response.data
  },

  async getStudentProfile(studentId: string) {
    const response = await apiClient.get<StudentResponse>('/students/me', {
      headers: {
        'X-Student-Id': studentId,
      },
    })
    return response.data
  },

  async getInstructors() {
    const response = await apiClient.get<InstructorResponse[]>('/instructors')
    return response.data
  },

  async createSession(payload: CreateChatSessionRequest) {
    const response = await apiClient.post<ChatSessionResponse>('/sessions', payload)
    return response.data
  },

  async getSession(sessionId: string) {
    const response = await apiClient.get<ChatSessionResponse>(`/sessions/${sessionId}`)
    return response.data
  },

  async getStudentSessions({ studentId, page = 0, size = 10 }: GetStudentSessionsParams) {
    const response = await apiClient.get<PagedResponse<ChatSessionResponse>>('/sessions/student', {
      params: { page, size },
      headers: {
        'X-Student-Id': studentId,
      },
    })
    return response.data
  },

  async getSessionMessages(sessionId: string, { studentId, page = 0, size = 20 }: GetSessionMessagesParams) {
    const response = await apiClient.get<PagedResponse<ChatMessageResponse>>(`/messages/session/${sessionId}`, {
      params: { page, size },
      headers: {
        'X-Student-Id': studentId,
      },
    })
    return response.data
  },

  async getChatHistory(sessionId: string) {
    const response = await apiClient.get<ChatHistoryResponse[]>(`/chat/history/${sessionId}`)
    return response.data
  },
}

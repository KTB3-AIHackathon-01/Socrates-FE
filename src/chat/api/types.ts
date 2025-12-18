export interface CreateChatSessionRequest {
  sessionId: string
  studentId: string
  name: string
}

export interface ChatSessionResponse {
  sessionId: string
  studentId: string
  name: string
  startedAt: string
  endedAt: string | null
}

export type ChatMessageStatus = 'PENDING' | 'STREAMING' | 'COMPLETED' | 'FAILED'

export interface ChatMessageResponse {
  messageId: string
  userMessage: string
  assistantMessage: string
  createdAt: string
  completedAt: string | null
  status: ChatMessageStatus
  isComplete: boolean | null
}

export interface PageMetadata {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface PagedResponse<T> {
  content: T[]
  metadata: PageMetadata
}

export interface GetStudentSessionsParams {
  studentId: string
  page?: number
  size?: number
}

export interface GetSessionMessagesParams {
  studentId: string
  page?: number
  size?: number
}

export interface ChatAPIService {
  createStudent(payload: CreateStudentRequest): Promise<StudentResponse>
  getStudentProfile(studentId: string): Promise<StudentResponse>
  getInstructors(): Promise<InstructorResponse[]>
  createSession(payload: CreateChatSessionRequest): Promise<ChatSessionResponse>
  getSession(sessionId: string): Promise<ChatSessionResponse>
  getStudentSessions(
    params: GetStudentSessionsParams,
  ): Promise<PagedResponse<ChatSessionResponse>>
  getSessionMessages(
    sessionId: string,
    params: GetSessionMessagesParams,
  ): Promise<PagedResponse<ChatMessageResponse>>
}

export interface CreateStudentRequest {
  name: string
  instructorId: string
}

export interface StudentResponse {
  studentId: string
  studentName: string
  instructorId: string
  instructorName: string
}

export interface InstructorResponse {
  instructorId: string
  instructorName: string
  createdAt: string
}

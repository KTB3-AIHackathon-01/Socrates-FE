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

export interface ChatHistoryResponse {
  id: string
  userMessage: string
  assistantMessage: string
  createdAt: string
  completedAt: string | null
  status: 'COMPLETED' | 'PENDING' | 'STREAMING' | 'FAILED'
  isComplete: boolean
}

export interface ChatRequest {
  message: string
  userId?: string
  sessionId?: string
}

export interface ChatStreamEvent {
  event?: string
  data: string
}

export interface StreamCallbacks {
  onChunk: (chunk: string) => void
  onEvent?: (event: ChatStreamEvent) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export interface GenerateTitleRequest {
  message: string
  sessionId: string
}

export interface GenerateTitleResponse {
  title: string
}

export interface Instructor {
  instructorId: string
}

export interface ChatAPIService {
  createStudent(payload: CreateStudentRequest): Promise<StudentResponse>
  getStudentProfile(studentId: string): Promise<StudentResponse>
  getInstructors(): Promise<InstructorResponse[]>
  getInstructorProfile(instructorId: string): Promise<InstructorResponse>
  createSession(payload: CreateChatSessionRequest): Promise<ChatSessionResponse>
  getSession(sessionId: string): Promise<ChatSessionResponse>
  getStudentSessions(params: GetStudentSessionsParams): Promise<PagedResponse<ChatSessionResponse>>
  getSessionMessages(
    sessionId: string,
    params: GetSessionMessagesParams,
  ): Promise<PagedResponse<ChatMessageResponse>>
  getChatHistory(sessionId: string): Promise<ChatHistoryResponse[]>
  streamChat(request: ChatRequest, callbacks: StreamCallbacks): Promise<void>
  generateChatTitle(request: GenerateTitleRequest): Promise<string>
  checkHealth(): Promise<boolean>
  createInstructor(params: { name: string }): Promise<Instructor>
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

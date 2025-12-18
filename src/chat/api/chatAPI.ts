import apiClient, { CHAT_API_BASE_URL } from './client'
import type {
  ChatAPIService,
  ChatMessageResponse,
  ChatSessionResponse,
  CreateChatSessionRequest,
  CreateStudentRequest,
  GetSessionMessagesParams,
  GetStudentSessionsParams,
  Instructor,
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

  async getInstructorProfile(instructorId: string) {
    const response = await apiClient.get<InstructorResponse>('/instructors/me', {
      headers: {
        'X-Instructor-Id': instructorId,
      },
    })
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

  async getSessionMessages(
    sessionId: string,
    { studentId, page = 0, size = 20 }: GetSessionMessagesParams,
  ) {
    const response = await apiClient.get<PagedResponse<ChatMessageResponse>>(
      `/messages/session/${sessionId}`,
      {
        params: { page, size },
        headers: {
          'X-Student-Id': studentId,
        },
      },
    )
    return response.data
  },

  async createInstructor(params) {
    const response = await apiClient.post<Instructor>('/instructors', params)
    return response.data
  },

  async getChatHistory(sessionId: string) {
    const response = await fetch(`${CHAT_API_BASE_URL}/history/${sessionId}`)
    return response.json()
  },

  async streamChat(request, callbacks) {
    const { onChunk, onEvent, onComplete, onError } = callbacks

    try {
      const response = await fetch(`${CHAT_API_BASE_URL}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let pendingEvent: { name?: string; dataLines: string[] } = { dataLines: [] }

      const flushPendingEvent = () => {
        if (!pendingEvent.dataLines.length) {
          pendingEvent = { dataLines: [] }
          return
        }

        const payload = pendingEvent.dataLines.join('\n')

        if (pendingEvent.name === 'message') {
          onChunk(payload)
        } else if (pendingEvent.name) {
          onEvent?.({ event: pendingEvent.name, data: payload })
        } else if (payload) {
          onChunk(payload)
        }

        pendingEvent = { dataLines: [] }
      }

      const handleLine = (rawLine: string) => {
        const cleanLine = rawLine.replace(/\r$/, '')

        if (!cleanLine) {
          flushPendingEvent()
          return
        }

        if (cleanLine.startsWith('event:')) {
          pendingEvent.name = cleanLine.slice(6).trim()
          return
        }

        if (cleanLine.startsWith('data:')) {
          const data = cleanLine.slice(5)
          pendingEvent.dataLines.push(data)
          return
        }

        pendingEvent.dataLines.push(cleanLine)
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          if (buffer) {
            handleLine(buffer)
            buffer = ''
          }
          flushPendingEvent()
          onComplete?.()
          break
        }

        buffer += decoder.decode(value, { stream: true })

        let newlineIndex: number
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex)
          buffer = buffer.slice(newlineIndex + 1)
          handleLine(line)
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      onError?.(err)
      throw err
    }
  },

  async generateChatTitle(request) {
    try {
      const response = await fetch(`${CHAT_API_BASE_URL}/title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.title
    } catch (error) {
      console.error('Failed to generate title:', error)
      throw error
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${CHAT_API_BASE_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  },

  async getSessionReport(sessionId: string) {
    const response = await fetch(`${CHAT_API_BASE_URL}/report/${sessionId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.status}`)
    }
    return response.json()
  },
}

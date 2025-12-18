export interface ChatRequest {
  message: string
  userId?: string
  sessionId?: string
}

export interface ChatStreamResponse {
  content: string
  isComplete?: boolean
}

const CHAT_API_BASE_URL = 'https://api.socrates-hkt.shop/api/chat'

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

export async function streamChat(
  request: ChatRequest,
  callbacks: StreamCallbacks,
): Promise<void> {
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

      if (pendingEvent.name) {
        if (onEvent) {
          onEvent({ event: pendingEvent.name, data: payload })
        } else if (payload) {
          onChunk(payload)
        }
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
        let data = cleanLine.slice(5)
        if (data.startsWith(' ') && data.length > 1) {
          data = data.slice(1)
        }
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
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${CHAT_API_BASE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}

export interface GenerateTitleRequest {
  message: string
  sessionId: string
}

export interface GenerateTitleResponse {
  title: string
}

export async function generateChatTitle(request: GenerateTitleRequest): Promise<string> {
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

    const data: GenerateTitleResponse = await response.json()
    return data.title
  } catch (error) {
    console.error('Failed to generate title:', error)
    throw error
  }
}

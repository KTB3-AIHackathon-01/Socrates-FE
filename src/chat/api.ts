export interface ChatRequest {
  message: string
  userId?: string
  sessionId?: string
}

export interface ChatStreamResponse {
  content: string
  isComplete?: boolean
}

const CHAT_API_BASE_URL =
  import.meta.env.VITE_CHAT_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function streamChat(
  request: ChatRequest,
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  try {
    const response = await fetch(`${CHAT_API_BASE_URL}/api/chat/stream`, {
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

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        if (buffer.trim()) {
          onChunk(buffer)
        }
        onComplete?.()
        break
      }

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const cleanLine = line.replace(/\r$/, '')
        if (!cleanLine.startsWith('data:')) continue

        let data = cleanLine.slice(5)
        if (data.startsWith(' ') && data.length > 1) {
          data = data.slice(1)
        }

        if (data) {
          onChunk(data)
        }
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
    const response = await fetch(`${CHAT_API_BASE_URL}/api/chat/health`)
    return response.ok
  } catch {
    return false
  }
}

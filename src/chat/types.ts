export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  comprehensionCheck?: boolean
  streaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
  isUserSession?: boolean
  userId?: string
  sessionId?: string
  status?: 'active' | 'completed'
  reportStatus?: 'idle' | 'loading' | 'ready' | 'error'
  reportMarkdown?: string
}

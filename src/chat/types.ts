export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  comprehensionCheck?: boolean
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
  isUserSession?: boolean
}

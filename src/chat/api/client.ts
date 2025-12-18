import axios from 'axios'
import { API_ANALYTICS_BASE_URL, API_CHAT_BASE_URL } from '@/config/api'

const apiClient = axios.create({
  baseURL: `${API_ANALYTICS_BASE_URL}/analytics`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const CHAT_API_BASE_URL = `${API_CHAT_BASE_URL}/chat`

export default apiClient

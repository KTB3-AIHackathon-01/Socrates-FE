import { API_ANALYTICS_BASE_URL } from '@/config/api'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${API_ANALYTICS_BASE_URL}/analytics`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient

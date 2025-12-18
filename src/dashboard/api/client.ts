import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/analytics',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient

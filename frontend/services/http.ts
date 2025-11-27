import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// instancia base
const api = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  baseURL: 'http://localhost:4000',
})

// forma simple: hook para componentes
export function useApi() {
  const { token } = useAuth()

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}

export default api

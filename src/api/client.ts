import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://dietswad-api.azurewebsites.net/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ds_jwt')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ds_jwt')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

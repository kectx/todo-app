import axios from 'axios'
import { useAccountStore } from '../store/account'

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error('VITE_BACKEND_URL is not defined')
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const accountStore = useAccountStore()
  if (accountStore.token) {
    config.headers.Authorization = `Bearer ${accountStore.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const accountStore = useAccountStore()
      accountStore.logout()
    }
    return Promise.reject(error)
  }
)

export default api

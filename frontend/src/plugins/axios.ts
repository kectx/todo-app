import axios from 'axios'
import { useAccountStore } from '../store/account'

const api = axios.create({
  baseURL: '/',
})

api.interceptors.request.use((config) => {
  const accountStore = useAccountStore()
  if (accountStore.token) {
    config.headers.Authorization = `Bearer ${accountStore.token}`
  }
  return config
})

export default api

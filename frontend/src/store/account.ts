import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '../firebase/auth'
import axios from '../plugins/axios'
import { router } from '../router'

interface User {
  uid: string
  email: string
  username?: string | null
  avatar?: string | null
  isLoggedIn?: boolean
}

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: null as null | User,
    token: '' as string,
  }),
  actions: {
    setUser(user: User | null, token = '') {
      this.user = user
      this.token = token
    },
    async login(email: string, password: string) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await userCred.user.getIdToken()

        await axios.post(
          '/api/auth/sync',
          {},
          {
            headers: { Authorization: `Bearer ${idToken}` },
            withCredentials: true,
          }
        )

        const userRes = await axios.get('/api/auth/me', { withCredentials: true })
        this.setUser({ ...userRes.data, isLoggedIn: true }, idToken)

        router.push('/todos')
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    async register(email: string, password: string) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        const idToken = await userCred.user.getIdToken()

        await axios.post(
          '/api/auth/sync',
          {},
          {
            headers: { Authorization: `Bearer ${idToken}` },
            withCredentials: true,
          }
        )

        const userRes = await axios.get('/api/auth/me', { withCredentials: true })
        this.setUser({ ...userRes.data, isLoggedIn: true }, idToken)

        router.push('/todos')
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },
    async logout() {
      try {
        await axios.delete('/api/auth/logout', { withCredentials: true })
      } catch (error) {
        console.warn('Logout request failed:', error)
      }

      await auth.signOut()
      this.setUser(null, '')
      router.push('/')
    },
    async restoreSession() {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true })
        this.setUser({ ...res.data, isLoggedIn: true })
      } catch {
        this.setUser(null)
      }
    },
    async updateProfile(username?: string, avatar?: string | null | undefined) {
      try {
        const payload: any = {}
        if (username !== undefined) payload.username = username || null
        if (avatar !== undefined) payload.avatar = avatar || null

        const res = await axios.put('/api/auth/profile', payload, { withCredentials: true })
        this.setUser({ ...res.data, isLoggedIn: true }, this.token)
        return res.data
      } catch (error: any) {
        console.error('Update profile failed:', error)
        throw error
      }
    },
    async sendPasswordReset(email: string) {
      if (!email || !email.trim()) {
        throw new Error('Email jest wymagany')
      }
      try {
        await sendPasswordResetEmail(auth, email)
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          throw new Error('Użytkownik o podanym adresie email nie istnieje')
        } else if (error.code === 'auth/invalid-email') {
          throw new Error('Nieprawidłowy adres email')
        } else {
          throw new Error('Wystąpił błąd podczas wysyłania emaila')
        }
      }
    },
  },
})

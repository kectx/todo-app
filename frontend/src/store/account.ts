import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '../firebase/auth'
import axios from 'axios'
import { router } from '../router'

interface User {
  uid: string
  email: string
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

        this.setUser({ uid: userCred.user.uid, email: userCred.user.email!, isLoggedIn: true })

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

        this.setUser({ uid: userCred.user.uid, email: userCred.user.email!, isLoggedIn: true })

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
  },
})

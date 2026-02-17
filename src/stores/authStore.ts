/**
 * AuthStore - JWT authentication state management
 *
 * Persists only the token to localStorage. User profile is fetched
 * on app load from the /auth/profile endpoint.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, ApiError } from '@/lib/api'
import type { ApiUser } from '@/lib/api'

interface AuthState {
  token: string | null
  user: ApiUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, displayName: string) => Promise<boolean>
  logout: () => void
  refreshProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await api.auth.login(email, password)
          if (!result) {
            set({ isLoading: false, error: 'Server unreachable' })
            return false
          }
          set({
            token: result.token,
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Login failed'
          set({ isLoading: false, error: message })
          return false
        }
      },

      register: async (email: string, password: string, displayName: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await api.auth.register(email, password, displayName)
          if (!result) {
            set({ isLoading: false, error: 'Server unreachable' })
            return false
          }
          set({
            token: result.token,
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Registration failed'
          set({ isLoading: false, error: message })
          return false
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      refreshProfile: async () => {
        const { token } = get()
        if (!token) return
        try {
          const profile = await api.auth.profile()
          if (profile) {
            set({ user: profile, isAuthenticated: true })
          } else {
            // Server unreachable but we have a token — stay authenticated
          }
        } catch {
          // Token expired or invalid
          set({ token: null, user: null, isAuthenticated: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'polarcraft-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)

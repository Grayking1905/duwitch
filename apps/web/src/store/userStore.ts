import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from '@duwitch/types'

interface UserState {
  user: User | null
  accessToken: string | null
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      set => ({
        user: null,
        accessToken: null,
        setUser: user => set({ user }, false, 'setUser'),
        setAccessToken: accessToken => set({ accessToken }, false, 'setAccessToken'),
        logout: () => set({ user: null, accessToken: null }, false, 'logout'),
      }),
      {
        name: 'duwitch-user',
        partialize: state => ({ accessToken: state.accessToken }),
      }
    ),
    { name: 'UserStore' }
  )
)

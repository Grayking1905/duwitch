import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Notification } from '@duwitch/types'

interface NotifState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notif: Notification) => void
  markAllRead: () => void
  clearAll: () => void
}

export const useNotifStore = create<NotifState>()(
  devtools(
    set => ({
      notifications: [],
      unreadCount: 0,
      addNotification: notif =>
        set(
          state => ({
            notifications: [notif, ...state.notifications].slice(0, 50),
            unreadCount:   state.unreadCount + (notif.read ? 0 : 1),
          }),
          false,
          'addNotification'
        ),
      markAllRead: () =>
        set(
          state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount:   0,
          }),
          false,
          'markAllRead'
        ),
      clearAll: () => set({ notifications: [], unreadCount: 0 }, false, 'clearAll'),
    }),
    { name: 'NotifStore' }
  )
)

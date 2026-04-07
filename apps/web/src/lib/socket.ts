import { io, type Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001'

let socket: Socket | null = null

export function getSocket(token?: string): Socket {
  if (!socket || !socket.connected) {
    socket = io(WS_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getRoomsSocket(token?: string): Socket {
  return getSocket(token).io.socket('/rooms')
}

export function getDmSocket(token?: string): Socket {
  return getSocket(token).io.socket('/dm')
}

export function getNotifSocket(token?: string): Socket {
  return getSocket(token).io.socket('/notif')
}

import type { FastifyInstance } from 'fastify'
import type { Server, Socket } from 'socket.io'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../db/postgres/client'

export function initWebSocket(app: FastifyInstance, io: Server) {
  // ── Auth middleware ───────────────────────────────────────────────────
  const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth['token'] as string | undefined
    if (!token) return next(new Error('UNAUTHORIZED'))

    try {
      const payload = app.jwt.verify<{ sub: string }>(token)
      socket.data.userId = payload.sub
      next()
    } catch {
      next(new Error('UNAUTHORIZED'))
    }
  })

  // ── /rooms namespace ─────────────────────────────────────────────────
  const roomsNs = io.of('/rooms')
  roomsNs.use(authMiddleware)
  roomsNs.on('connection', (socket: Socket) => {
    socket.on('join-room', async (roomId: string) => {
      await socket.join(roomId)
      socket.to(roomId).emit('presence-update', { userId: socket.data.userId, action: 'joined' })
    })

    socket.on('leave-room', async (roomId: string) => {
      await socket.leave(roomId)
      socket.to(roomId).emit('presence-update', { userId: socket.data.userId, action: 'left' })
    })

    socket.on('chat-message', (payload: { roomId: string; content: string; type: string }) => {
      roomsNs.to(payload.roomId).emit('chat-message', {
        ...payload,
        authorId: socket.data.userId as string,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('disconnect', () => {
      // Cleanup presence when socket disconnects
    })
  })

  // ── /dm namespace ────────────────────────────────────────────────────
  const dmNs = io.of('/dm')
  dmNs.use(authMiddleware)
  dmNs.on('connection', (socket: Socket) => {
    socket.on('join-conversation', async (conversationId: string) => {
      const userId = socket.data.userId as string
      // 🛡️ Sentinel: Verify participation to prevent BOLA
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
      })

      if (!participant) {
        return socket.emit('error', { code: 'FORBIDDEN', message: 'Not a participant' })
      }

      await socket.join(conversationId)
      socket.emit('joined-conversation', { conversationId })
    })

    socket.on('message', async (payload: { conversationId: string; content: string }) => {
      const { conversationId } = payload
      const userId = socket.data.userId as string

      // Ensure user is in the room (Socket.io room)
      if (!socket.rooms.has(conversationId)) {
        return socket.emit('error', { code: 'FORBIDDEN', message: 'Must join conversation first' })
      }

      dmNs.to(conversationId).emit('message', {
        ...payload,
        senderId: userId,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('typing', (payload: { conversationId: string }) => {
      const { conversationId } = payload
      if (!socket.rooms.has(conversationId)) return

      socket.to(conversationId).emit('typing', { userId: socket.data.userId as string })
    })
  })

  // ── /notif namespace ─────────────────────────────────────────────────
  const notifNs = io.of('/notif')
  notifNs.use(authMiddleware)
  notifNs.on('connection', (socket: Socket) => {
    // Join personal room so server can push to specific user
    const userId = socket.data.userId as string | undefined
    if (userId) socket.join(`user:${userId}`)
  })

  return { roomsNs, dmNs, notifNs }
}

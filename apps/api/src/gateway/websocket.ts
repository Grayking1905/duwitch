import type { Server, Socket } from 'socket.io'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../db/postgres/client'

export function initWebSocket(io: Server, app: FastifyInstance) {
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
  }

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
      try {
        const participant = await prisma.conversationParticipant.findUnique({
          where: { conversationId_userId: { conversationId, userId } },
        })

        if (participant) {
          await socket.join(conversationId)
        } else {
          socket.emit('error', { code: 'FORBIDDEN', message: 'Not a participant' })
        }
      } catch (err) {
        app.log.error(err, 'WebSocket join-conversation error')
        socket.emit('error', { code: 'INTERNAL_ERROR', message: 'Failed to join conversation' })
      }
    })

    socket.on('message', (payload: { conversationId: string; content: string }) => {
      if (!socket.rooms.has(payload.conversationId)) return

      dmNs.to(payload.conversationId).emit('message', {
        ...payload,
        senderId: socket.data.userId as string,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('typing', (payload: { conversationId: string }) => {
      if (!socket.rooms.has(payload.conversationId)) return
      socket.to(payload.conversationId).emit('typing', { userId: socket.data.userId as string })
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

import type { Server, Socket } from 'socket.io'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../db/postgres/client'

export function initWebSocket(io: Server, app: FastifyInstance) {
  // ── Auth middleware ───────────────────────────────────────────────────
  const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token as string | undefined
    if (!token) return next(new Error('UNAUTHORIZED'))

    try {
      const payload = app.jwt.verify<{ sub: string }>(token)
      socket.data.userId = payload.sub
      next()
    } catch {
      next(new Error('UNAUTHORIZED'))
    }
  }

  io.use(authMiddleware)

  // ── /rooms namespace ─────────────────────────────────────────────────
  const roomsNs = io.of('/rooms')
  roomsNs.use(authMiddleware)
  roomsNs.on('connection', (socket: Socket) => {
    socket.on('join-room', async (roomId: string) => {
      // 🛡️ Sentinel: Verify room exists and is live (BOLA)
      const room = await prisma.room.findUnique({ where: { id: roomId } })
      if (!room || !room.isLive) return

      await socket.join(roomId)
      socket.to(roomId).emit('presence-update', { userId: socket.data.userId, action: 'joined' })
    })

    socket.on('leave-room', async (roomId: string) => {
      await socket.leave(roomId)
      socket.to(roomId).emit('presence-update', { userId: socket.data.userId, action: 'left' })
    })

    socket.on('chat-message', async (payload: { roomId: string; content: string; type: string }) => {
      // 🛡️ Sentinel: Verify room exists and is live (BOLA)
      const room = await prisma.room.findUnique({ where: { id: payload.roomId } })
      if (!room || !room.isLive) return

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
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
      })
      if (!participant) return // Silently ignore unauthorized join

      await socket.join(conversationId)
    })

    socket.on('message', async (payload: { conversationId: string; content: string }) => {
      const userId = socket.data.userId as string
      // 🛡️ Sentinel: Verify conversation participation (BOLA)
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: payload.conversationId, userId } },
      })
      if (!participant) return

      dmNs.to(payload.conversationId).emit('message', {
        ...payload,
        senderId: userId,
        timestamp: new Date().toISOString(),
      })
    })

    socket.on('typing', async (payload: { conversationId: string }) => {
      const userId = socket.data.userId as string
      // 🛡️ Sentinel: Verify conversation participation (BOLA)
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: payload.conversationId, userId } },
      })
      if (!participant) return

      socket.to(payload.conversationId).emit('typing', { userId })
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

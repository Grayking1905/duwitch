import type { FastifyInstance } from 'fastify'
import type { Server, Socket } from 'socket.io'
import { prisma } from '../db/postgres/client'

export function initWebSocket(io: Server, app: FastifyInstance) {
  // ── Auth middleware ───────────────────────────────────────────────────
  io.use(async (socket, next) => {
    const token = socket.handshake.auth['token'] as string | undefined
    if (!token) return next(new Error('UNAUTHORIZED'))

    try {
      const payload = await app.jwt.verify<{ sub: string }>(token)
      socket.data.userId = payload.sub
      next()
    } catch {
      next(new Error('INVALID_TOKEN'))
    }
  })

  // ── /rooms namespace ─────────────────────────────────────────────────
  const roomsNs = io.of('/rooms')
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
  dmNs.on('connection', (socket: Socket) => {
    socket.on('join-conversation', async (conversationId: string) => {
      const userId = socket.data.userId as string
      // 🛡️ Sentinel: Verify user is a participant of the conversation (BOLA protection)
      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId,
          },
        },
      })

      if (!participant) {
        socket.emit('error', { code: 'FORBIDDEN', message: 'Not a participant' })
        return
      }

      await socket.join(conversationId)
    })

    socket.on('message', (payload: { conversationId: string; content: string }) => {
      // 🛡️ Sentinel: Ensure the user has actually joined the room (is a participant)
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
  notifNs.on('connection', (socket: Socket) => {
    // Join personal room so server can push to specific user
    const userId = socket.data.userId as string | undefined
    if (userId) socket.join(`user:${userId}`)
  })

  return { roomsNs, dmNs, notifNs }
}

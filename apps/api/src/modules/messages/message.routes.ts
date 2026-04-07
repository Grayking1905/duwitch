import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'

type ConvParams = { conversationId: string }

export async function messagesRoutes(app: FastifyInstance) {
  // GET /messages — list conversations
  app.get(
    '/',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub
      const conversations = await prisma.conversation.findMany({
        where:   { participants: { some: { userId } } },
        include: {
          participants: { include: { user: { select: { id: true, username: true, avatar: true } } } },
          messages:     { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
      })
      return reply.send({ conversations })
    }
  )

  // GET /messages/:conversationId — message history
  app.get<{ Params: ConvParams }>(
    '/:conversationId',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const { conversationId } = req.params
      const messages = await prisma.directMessage.findMany({
        where:   { conversationId },
        include: { sender: { select: { id: true, username: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
        take:    100,
      })
      return reply.send({ messages })
    }
  )
}

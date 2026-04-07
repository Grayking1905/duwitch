import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'

export async function messagesRoutes(app: FastifyInstance) {
  // GET /messages — list conversations
  app.get('/', { preHandler: [app.authenticate] }, async (req, reply) => {
    const userId = (req as any).user.sub as string
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: { include: { user: { select: { id: true, username: true, avatar: true } } } },
        messages:     { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    })
    return reply.send({ conversations })
  })

  // GET /messages/:conversationId — message history
  app.get('/:conversationId', { preHandler: [app.authenticate] }, async (req, reply) => {
    const { conversationId } = req.params as { conversationId: string }
    const messages = await prisma.directMessage.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, username: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })
    return reply.send({ messages })
  })
}

import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'

export async function notificationsRoutes(app: FastifyInstance) {
  // GET /notifications — user's notifications
  app.get('/', { preHandler: [app.authenticate] }, async (req, reply) => {
    const userId = (req as any).user.sub as string
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return reply.send({ notifications })
  })

  // PATCH /notifications/read-all
  app.patch('/read-all', { preHandler: [app.authenticate] }, async (req, reply) => {
    const userId = (req as any).user.sub as string
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
    return reply.send({ message: 'All notifications marked as read' })
  })
}

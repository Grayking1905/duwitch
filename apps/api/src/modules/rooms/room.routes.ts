import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'
import { CreateRoomInputSchema } from '@duwitch/types'

type RoomParams = { roomId: string }

export async function roomsRoutes(app: FastifyInstance) {
  // GET /rooms — list live rooms
  app.get('/', async (_req, reply) => {
    const rooms = await prisma.room.findMany({
      where: { isLive: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return reply.send({ rooms })
  })

  // POST /rooms — create
  app.post(
    '/',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub
      const body = CreateRoomInputSchema.parse(req.body)
      const room = await prisma.room.create({
        data: {
          name: body.name,
          description: body.description,
          hostId: userId,
          maxMembers: body.maxMembers ?? 50,
          tags: body.tags ?? [],
          isLive: true,
        },
      })
      return reply.code(201).send(room)
    }
  )

  // GET /rooms/:roomId
  app.get<{ Params: RoomParams }>('/:roomId', async (req, reply) => {
    const { roomId } = req.params
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) return reply.code(404).send({ code: 'NOT_FOUND', message: 'Room not found' })
    return reply.send(room)
  })

  // DELETE /rooms/:roomId — end room (host only)
  app.delete<{ Params: RoomParams }>(
    '/:roomId',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub
      const { roomId } = req.params
      const room = await prisma.room.findUnique({ where: { id: roomId } })
      if (!room) return reply.code(404).send({ code: 'NOT_FOUND', message: 'Room not found' })
      if (room.hostId !== userId) {
        return reply
          .code(403)
          .send({ code: 'FORBIDDEN', message: 'Only the host can end the room' })
      }
      await prisma.room.update({ where: { id: roomId }, data: { isLive: false } })
      return reply.send({ message: 'Room ended' })
    }
  )
}

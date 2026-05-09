import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'
import { UpdateUserInputSchema } from '@duwitch/types'

export async function usersRoutes(app: FastifyInstance) {
  // GET /users/:username — public dev profile
  app.get<{ Params: { username: string } }>('/:username', async (req, reply) => {
    const { username } = req.params
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        availability: true,
        xp: true,
        githubUrl: true,
        portfolioLinks: true,
        skills: { include: { skill: true } },
        _count: { select: { ownedProjects: true, articles: true } },
        createdAt: true,
      },
    })
    if (!user) return reply.code(404).send({ code: 'USER_NOT_FOUND', message: 'User not found' })
    return reply.send(user)
  })

  // PATCH /users/me — update own profile (auth required)
  app.patch('/me', { preHandler: [app.authenticate] }, async (req, reply) => {
    const userId = req.user.sub
    const body = UpdateUserInputSchema.parse(req.body)

    const updated = await prisma.user.update({
      where: { id: userId },
      data: body,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        availability: true,
        xp: true,
        updatedAt: true,
      },
    })
    return reply.send(updated)
  })
}

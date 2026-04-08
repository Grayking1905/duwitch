import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'

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
    const body = req.body as {
      bio?: string
      avatar?: string
      githubUrl?: string
      portfolioLinks?: string[]
      availability?: 'OPEN' | 'BUSY' | 'UNAVAILABLE'
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: body.bio,
        avatar: body.avatar,
        githubUrl: body.githubUrl,
        portfolioLinks: body.portfolioLinks,
        availability: body.availability,
      },
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

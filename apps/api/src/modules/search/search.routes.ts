import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'

type SearchQuery = { q?: string; type?: string; limit?: string }

export async function searchRoutes(app: FastifyInstance) {
  // GET /search?q=&type=devs,projects,news
  app.get<{ Querystring: SearchQuery }>(
    '/',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const { q = '', type = 'devs,projects,news', limit = '10' } = req.query
      const types = type.split(',')
      const take  = parseInt(limit)

      if (!q.trim()) return reply.send({ devs: [], projects: [], articles: [] })

      const [devs, projects, articles] = await Promise.all([
        types.includes('devs')
          ? prisma.user.findMany({
              where: {
                OR: [
                  { username: { contains: q, mode: 'insensitive' } },
                  { bio:      { contains: q, mode: 'insensitive' } },
                ],
              },
              take,
              select: { id: true, username: true, avatar: true, bio: true, availability: true, xp: true },
            })
          : Promise.resolve([]),
        types.includes('projects')
          ? prisma.project.findMany({
              where: {
                OR: [
                  { title:       { contains: q, mode: 'insensitive' } },
                  { description: { contains: q, mode: 'insensitive' } },
                  { techTags:    { has: q } },
                ],
              },
              take,
              include: { owner: { select: { id: true, username: true, avatar: true } } },
            })
          : Promise.resolve([]),
        types.includes('news')
          ? prisma.article.findMany({
              where: {
                published: true,
                OR: [
                  { title: { contains: q, mode: 'insensitive' } },
                  { tags:  { has: q } },
                ],
              },
              take,
              select: { id: true, slug: true, title: true, excerpt: true, tags: true, publishedAt: true },
            })
          : Promise.resolve([]),
      ])

      return reply.send({ devs, projects, articles })
    }
  )
}

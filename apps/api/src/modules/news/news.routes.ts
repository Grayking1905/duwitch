import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'
import { CreateArticleInputSchema } from '@duwitch/types'

type NewsQuery = { tag?: string; page?: string; limit?: string }
type SlugParams = { slug: string }

export async function newsRoutes(app: FastifyInstance) {
  // GET /news — paginated article feed
  app.get<{ Querystring: NewsQuery }>('/', async (req, reply) => {
    const { tag, page = '1', limit = '20' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      published: true,
      ...(tag ? { tags: { has: tag } } : {}),
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          tags: true,
          source: true,
          externalUrl: true,
          views: true,
          _count: { select: { bookmarks: true, comments: true } },
          author: { select: { id: true, username: true, avatar: true } },
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ])

    return reply.send({ articles, total, page: parseInt(page) })
  })

  // GET /news/:slug — full article
  app.get<{ Params: SlugParams }>('/:slug', async (req, reply) => {
    const { slug } = req.params
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, username: true, avatar: true } },
            replies: {
              include: { author: { select: { id: true, username: true, avatar: true } } },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!article || !article.published) {
      return reply.code(404).send({ code: 'NOT_FOUND', message: 'Article not found' })
    }

    // Increment view count asynchronously (fire & forget)
    prisma.article.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => null)

    return reply.send(article)
  })

  // POST /news/articles — community submission
  app.post(
    '/articles',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub
      const body = CreateArticleInputSchema.parse(req.body)
      const slug =
        body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        Date.now()

      const article = await prisma.article.create({
        data: {
          slug,
          title: body.title,
          content: body.content,
          tags: body.tags ?? [],
          source: 'COMMUNITY',
          authorId: userId,
          published: false, // requires review
        },
      })
      return reply.code(201).send({ article, message: 'Article submitted for review' })
    }
  )
}

import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'

export async function projectsRoutes(app: FastifyInstance) {
  // GET /projects — list with filters
  app.get('/', async (req, reply) => {
    const { status, tag, page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      ...(status ? { status: status as any } : {}),
      ...(tag ? { techTags: { has: tag } } : {}),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, username: true, avatar: true } },
          roles: true,
          _count: { select: { members: true, proposals: true } },
        },
      }),
      prisma.project.count({ where }),
    ])

    return reply.send({ projects, total, page: parseInt(page) })
  })

  // POST /projects — create
  app.post('/', { preHandler: [app.authenticate] }, async (req, reply) => {
    const userId = (req as any).user.sub as string
    const body = req.body as any
    const project = await prisma.project.create({
      data: {
        title: body.title, description: body.description,
        techTags: body.techTags ?? [],
        ownerId: userId,
        members: { create: { userId } },
      },
      include: { owner: { select: { id: true, username: true, avatar: true } } },
    })
    return reply.code(201).send(project)
  })

  // GET /projects/:id
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, username: true, avatar: true } },
        roles: true,
        members: { include: { user: { select: { id: true, username: true, avatar: true } } } },
        _count: { select: { proposals: true } },
      },
    })
    if (!project) return reply.code(404).send({ code: 'NOT_FOUND', message: 'Project not found' })
    return reply.send(project)
  })

  // POST /projects/:id/proposals
  app.post('/:id/proposals', { preHandler: [app.authenticate] }, async (req, reply) => {
    const userId = (req as any).user.sub as string
    const { id } = req.params as { id: string }
    const body = req.body as { content: string; roleId?: string }
    const proposal = await prisma.proposal.create({
      data: { projectId: id, authorId: userId, content: body.content, roleId: body.roleId },
      include: { author: { select: { id: true, username: true, avatar: true } } },
    })
    return reply.code(201).send(proposal)
  })
}

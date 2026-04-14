import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'
import { CreateProjectInputSchema, ProposalSchema, type ProjectStatus } from '@duwitch/types'

type ProjectsQuery = { status?: string; tag?: string; page?: string; limit?: string }
type ProjectParams = { id: string }
type ProposalBody = { content: string; roleId?: string }

export async function projectsRoutes(app: FastifyInstance) {
  // GET /projects — list with filters
  app.get<{ Querystring: ProjectsQuery }>('/', async (req, reply) => {
    const { status, tag, page = '1', limit = '20' } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {
      ...(status ? { status: status as ProjectStatus } : {}),
      ...(tag ? { techTags: { has: tag } } : {}),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit),
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
    const userId = req.user.sub
    const body = CreateProjectInputSchema.parse(req.body)
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        techTags: body.techTags,
        ownerId: userId,
        members: { create: { userId } },
      },
      include: { owner: { select: { id: true, username: true, avatar: true } } },
    })
    return reply.code(201).send(project)
  })

  // GET /projects/:id
  app.get<{ Params: ProjectParams }>('/:id', async (req, reply) => {
    const { id } = req.params
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
  app.post<{ Params: ProjectParams; Body: ProposalBody }>(
    '/:id/proposals',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub
      const { id: projectId } = req.params
      const { content, roleId } = ProposalSchema.pick({ content: true, roleId: true }).parse(
        req.body
      )

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, ownerId: true, status: true },
      })

      if (!project) {
        return reply.code(404).send({ code: 'NOT_FOUND', message: 'Project not found' })
      }

      if (project.status !== 'OPEN') {
        return reply.code(400).send({
          code: 'PROJECT_NOT_OPEN',
          message: 'Proposals can only be submitted to open projects',
        })
      }

      // 🛡️ Sentinel: BOLA check — owner cannot submit proposal to their own project
      if (project.ownerId === userId) {
        return reply.code(403).send({
          code: 'FORBIDDEN',
          message: 'Project owners cannot submit proposals to their own projects',
        })
      }

      // 🛡️ Sentinel: IDOR check — if roleId is provided, it must belong to this project
      if (roleId) {
        const role = await prisma.roleOpening.findFirst({
          where: { id: roleId, projectId },
        })
        if (!role) {
          return reply.code(400).send({
            code: 'INVALID_ROLE',
            message: 'The specified role does not exist in this project',
          })
        }
      }

      const proposal = await prisma.proposal.create({
        data: { projectId, authorId: userId, content, roleId },
        include: { author: { select: { id: true, username: true, avatar: true } } },
      })
      return reply.code(201).send(proposal)
    }
  )
}

import type { FastifyInstance } from 'fastify'
import { prisma } from '../../db/postgres/client'
import { CreateProjectInputSchema, ProposalSchema, type ProjectStatus } from '@duwitch/types'

type ProjectsQuery = { status?: string; tag?: string; page?: string; limit?: string }
type ProjectParams = { id: string }

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
        techTags: body.techTags ?? [],
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
  app.post<{ Params: ProjectParams }>(
    '/:id/proposals',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const userId = req.user.sub
      const { id: projectId } = req.params
      const { content, roleId } = ProposalSchema.pick({ content: true, roleId: true }).parse(
        req.body
      )

      // 🛡️ Sentinel: Verify that the role belongs to the project to prevent cross-resource IDOR
      if (roleId) {
        const role = await prisma.roleOpening.findFirst({
          where: { id: roleId, projectId },
        })

        if (!role) {
          return reply.code(400).send({
            code: 'BAD_REQUEST',
            message: 'The specified role does not exist or does not belong to this project',
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

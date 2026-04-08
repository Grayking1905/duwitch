import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthService } from './auth.service'
import { RegisterInputSchema, LoginInputSchema } from '@duwitch/types'

const authService = new AuthService()

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/register
  app.post('/register', async (req, reply) => {
    const body = RegisterInputSchema.parse(req.body)
    const result = await authService.register(body)
    return reply.code(201).send(result)
  })

  // POST /auth/login
  app.post('/login', async (req, reply) => {
    const body = LoginInputSchema.parse(req.body)
    const result = await authService.login(body)
    return reply.send(result)
  })

  // POST /auth/refresh
  app.post('/refresh', async (req, reply) => {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body)
    const result = await authService.refreshToken(refreshToken)
    return reply.send(result)
  })

  // GET /auth/me — requires JWT
  app.get('/me', { preHandler: [app.authenticate] }, async (req, reply) => {
    const user = await authService.getMe(req.user.sub)
    return reply.send(user)
  })
}

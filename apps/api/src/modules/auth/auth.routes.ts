import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthService } from './auth.service'
import { RegisterInputSchema, LoginInputSchema } from '@duwitch/types'

const authService = new AuthService()

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/register
  app.post('/register', async (req, reply) => {
    const body = RegisterInputSchema.parse(req.body)
    const { user, refreshToken, message } = await authService.register(body)
    const accessToken = app.jwt.sign({ sub: user.id })

    return reply.code(201).send({
      user,
      accessToken,
      refreshToken,
      message,
    })
  })

  // POST /auth/login
  app.post('/login', async (req, reply) => {
    const body = LoginInputSchema.parse(req.body)
    const { user, refreshToken } = await authService.login(body)
    const accessToken = app.jwt.sign({ sub: user.id })

    return reply.send({
      user,
      accessToken,
      refreshToken,
    })
  })

  // POST /auth/refresh
  app.post('/refresh', async (req, reply) => {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body)
    const { userId, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken)
    const accessToken = app.jwt.sign({ sub: userId })

    return reply.send({
      accessToken,
      refreshToken: newRefreshToken,
    })
  })

  // GET /auth/me — requires JWT
  app.get('/me', { preHandler: [app.authenticate] }, async (req, reply) => {
    const user = await authService.getMe(req.user.sub)
    return reply.send(user)
  })
}

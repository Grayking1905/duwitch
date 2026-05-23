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
    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '15m' })
    return reply.code(201).send({ user, accessToken, refreshToken, expiresIn: 900, message })
  })

  // POST /auth/login
  app.post('/login', async (req, reply) => {
    const body = LoginInputSchema.parse(req.body)
    const { user, refreshToken } = await authService.login(body)
    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '15m' })
    return reply.send({ user, accessToken, refreshToken, expiresIn: 900 })
  })

  // POST /auth/refresh
  app.post('/refresh', async (req, reply) => {
    const { refreshToken: oldToken } = z.object({ refreshToken: z.string() }).parse(req.body)
    const { userId, refreshToken } = await authService.refreshToken(oldToken)
    const accessToken = app.jwt.sign({ sub: userId }, { expiresIn: '15m' })
    return reply.send({ accessToken, refreshToken, expiresIn: 900 })
  })

  // GET /auth/me — requires JWT
  app.get('/me', { preHandler: [app.authenticate] }, async (req, reply) => {
    const user = await authService.getMe(req.user.sub)
    return reply.send(user)
  })
}

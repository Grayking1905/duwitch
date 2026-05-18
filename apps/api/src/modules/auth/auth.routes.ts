import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthService } from './auth.service'
import { RegisterInputSchema, LoginInputSchema } from '@duwitch/types'

const authService = new AuthService()

export async function authRoutes(app: FastifyInstance) {
  // POST /auth/register
  app.post('/register', async (req, reply) => {
    const body = RegisterInputSchema.parse(req.body)
    const { user, message } = await authService.register(body)

    // 🛡️ Sentinel: Sign real JWT immediately after registration for session start
    const accessToken = app.jwt.sign({ sub: user.id })
    const refreshToken = await authService.issueRefreshToken(user.id)

    return reply.code(201).send({
      user,
      message,
      accessToken,
      refreshToken,
      expiresIn: 900, // 15m
    })
  })

  // POST /auth/login
  app.post('/login', async (req, reply) => {
    const body = LoginInputSchema.parse(req.body)
    const { userId, refreshToken, user } = await authService.login(body)

    // 🛡️ Sentinel: Replace placeholder with real cryptographically signed JWT
    const accessToken = app.jwt.sign({ sub: userId })

    return reply.send({
      accessToken,
      refreshToken,
      user,
      expiresIn: 900, // 15m
    })
  })

  // POST /auth/refresh
  app.post('/refresh', async (req, reply) => {
    const { refreshToken: oldToken } = z.object({ refreshToken: z.string() }).parse(req.body)
    const { userId, refreshToken } = await authService.refreshToken(oldToken)

    // 🛡️ Sentinel: Sign new real JWT on refresh
    const accessToken = app.jwt.sign({ sub: userId })

    return reply.send({
      accessToken,
      refreshToken,
      expiresIn: 900, // 15m
    })
  })

  // GET /auth/me — requires JWT
  app.get('/me', { preHandler: [app.authenticate] }, async (req, reply) => {
    const user = await authService.getMe(req.user.sub)
    return reply.send(user)
  })
}

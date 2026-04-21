import Fastify from 'fastify'
import { z } from 'zod'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwtPlugin from '@fastify/jwt'
import { Server } from 'socket.io'
import { registerRoutes } from './gateway/router'
import { initWebSocket } from './gateway/websocket'
import { redisClient } from './db/redis/client'
import { connectMongo } from './db/mongo/client'
// Side-effect import: augments @fastify/jwt types
import './types/fastify'

const isDev = process.env['NODE_ENV'] === 'development'

const app = Fastify({
  logger: isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
    : true,
})

async function bootstrap(): Promise<void> {
  // ── Security ──────────────────────────────────────────────────────
  await app.register(helmet, { contentSecurityPolicy: false })

  await app.register(cors, {
    origin: [process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis: redisClient,
  })

  // ── JWT ───────────────────────────────────────────────────────────
  await app.register(jwtPlugin, {
    secret: process.env['JWT_SECRET'] ?? 'dev-secret-change-me',
    sign: { expiresIn: '15m' },
  })

  // Authenticate decorator — used as preHandler in route definitions
  app.decorate(
    'authenticate',
    async function authenticate(
      request: Parameters<typeof app.authenticate>[0],
      reply: Parameters<typeof app.authenticate>[1]
    ) {
      try {
        await request.jwtVerify()
      } catch {
        reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' })
      }
    }
  )

  // ── Error Handling ────────────────────────────────────────────────
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({ code: 'VALIDATION_ERROR', details: error.errors })
    }
    if (error.statusCode) return reply.send(error)
    app.log.error(error)
    reply.code(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' })
  })

  // ── Routes ────────────────────────────────────────────────────────
  await registerRoutes(app)

  // ── Socket.io ─────────────────────────────────────────────────────
  const io = new Server(app.server, {
    cors: {
      origin: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
      credentials: true,
    },
  })
  initWebSocket(io)

  // ── Health ────────────────────────────────────────────────────────
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // ── Start ─────────────────────────────────────────────────────────
  const port = Number(process.env['PORT'] ?? 3001)
  const host = '0.0.0.0'

  await connectMongo()
  await app.listen({ port, host })
  app.log.info(`🚀 API running on http://${host}:${port}`)
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

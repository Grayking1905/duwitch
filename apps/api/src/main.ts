import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import { Server } from 'socket.io'
import { registerRoutes } from './gateway/router'
import { initWebSocket } from './gateway/websocket'
import { prisma } from './db/postgres/client'
import { redisClient } from './db/redis/client'
import { connectMongo } from './db/mongo/client'

const app = Fastify({
  logger: {
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
})

async function bootstrap() {
  // ── Plugins ──────────────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // managed separately for WebSocket
  })

  await app.register(cors, {
    origin: [
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis: redisClient,
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    sign: { expiresIn: '15m' },
  })

  // ── Routes ───────────────────────────────────────────────────────────
  await registerRoutes(app)

  // ── Socket.io ────────────────────────────────────────────────────────
  const io = new Server(app.server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      credentials: true,
    },
  })
  initWebSocket(io)

  // ── Health ───────────────────────────────────────────────────────────
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // ── Start ────────────────────────────────────────────────────────────
  const port = Number(process.env.PORT ?? 3001)
  const host = '0.0.0.0'

  await connectMongo()
  await app.listen({ port, host })
  app.log.info(`🚀 API running on http://${host}:${port}`)
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

import type { FastifyRequest, FastifyReply } from 'fastify'

// Augment @fastify/jwt to define the verified JWT payload shape
import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string }
    user: { sub: string }
  }
}

// Declare the `authenticate` decorator added via app.decorate('authenticate', ...) in main.ts
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

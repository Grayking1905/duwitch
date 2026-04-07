import bcrypt from 'bcryptjs'
import { prisma } from '../../db/postgres/client'
import { redisClient } from '../../db/redis/client'
import type { RegisterInput, LoginInput } from '@duwitch/types'

const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
const SALT_ROUNDS = 12

export class AuthService {
  async register(input: RegisterInput) {
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] },
    })
    if (exists) {
      throw Object.assign(new Error('User already exists'), { statusCode: 409, code: 'USER_EXISTS' })
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true, username: true, email: true, avatar: true,
        bio: true, availability: true, xp: true, createdAt: true,
      },
    })

    return { user, message: 'Registration successful' }
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    })
    if (!user || !user.passwordHash) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401, code: 'INVALID_CREDENTIALS' })
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401, code: 'INVALID_CREDENTIALS' })
    }

    const { accessToken, refreshToken } = await this.issueTokens(user.id)
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id, username: user.username, email: user.email,
        avatar: user.avatar, availability: user.availability, xp: user.xp,
      },
    }
  }

  async refreshToken(token: string) {
    const stored = await redisClient.get(`refresh:${token}`)
    if (!stored) {
      throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401, code: 'INVALID_REFRESH_TOKEN' })
    }
    const userId = stored
    await redisClient.del(`refresh:${token}`)
    return this.issueTokens(userId)
  }

  async getMe(userId: string) {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true, username: true, email: true, avatar: true,
        bio: true, availability: true, xp: true,
        skills: { include: { skill: true } },
        createdAt: true,
      },
    })
  }

  private async issueTokens(userId: string) {
    const { randomUUID } = await import('crypto')
    const refreshToken = randomUUID()

    await redisClient.setex(`refresh:${refreshToken}`, REFRESH_TTL_SECONDS, userId)

    // NOTE: accessToken signing needs app.jwt — injected at route level in production
    // For now we return a placeholder; hook up app.jwt.sign() in auth.routes.ts
    const accessToken = `placeholder.${Buffer.from(JSON.stringify({ sub: userId })).toString('base64')}.sig`
    return { accessToken, refreshToken }
  }
}

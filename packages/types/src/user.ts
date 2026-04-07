import { z } from 'zod'

// ─── Enums ───────────────────────────────────────────────────────────────────

export const AvailStatusSchema = z.enum(['OPEN', 'BUSY', 'UNAVAILABLE'])
export type AvailStatus = z.infer<typeof AvailStatusSchema>

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
})
export type Skill = z.infer<typeof SkillSchema>

// ─── User ─────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  avatar: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  portfolioLinks: z.array(z.string().url()).default([]),
  availability: AvailStatusSchema,
  xp: z.number().int().min(0),
  skills: z.array(SkillSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type User = z.infer<typeof UserSchema>

export const DevProfileSchema = UserSchema.extend({
  projectCount: z.number().int().default(0),
  articleCount: z.number().int().default(0),
  reputation: z.number().int().default(0),
  isFollowing: z.boolean().optional(),
})
export type DevProfile = z.infer<typeof DevProfileSchema>

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const RegisterInputSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(72),
})
export type RegisterInput = z.infer<typeof RegisterInputSchema>

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type LoginInput = z.infer<typeof LoginInputSchema>

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
})
export type AuthTokens = z.infer<typeof AuthTokensSchema>

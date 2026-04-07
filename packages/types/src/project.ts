import { z } from 'zod'
import { UserSchema } from './user'

// ─── Enums ───────────────────────────────────────────────────────────────────

export const ProjectStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>

// ─── Role Opening ─────────────────────────────────────────────────────────────

export const RoleOpeningSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string().min(2).max(80),
  description: z.string().max(1000).optional(),
  techTags: z.array(z.string()),
  isPaid: z.boolean().default(false),
  filledBy: z.string().nullable().optional(),
})
export type RoleOpening = z.infer<typeof RoleOpeningSchema>

// ─── Proposal ─────────────────────────────────────────────────────────────────

export const ProposalStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED'])
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>

export const ProposalSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  roleId: z.string().nullable().optional(),
  authorId: z.string(),
  author: UserSchema.pick({ id: true, username: true, avatar: true }).optional(),
  content: z.string().min(10).max(2000),
  status: ProposalStatusSchema,
  createdAt: z.string().datetime(),
})
export type Proposal = z.infer<typeof ProposalSchema>

// ─── Project ─────────────────────────────────────────────────────────────────

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(5000),
  techTags: z.array(z.string()).min(1).max(10),
  status: ProjectStatusSchema,
  ownerId: z.string(),
  owner: UserSchema.pick({ id: true, username: true, avatar: true }).optional(),
  memberCount: z.number().int().default(0),
  roles: z.array(RoleOpeningSchema).optional(),
  proposalCount: z.number().int().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type Project = z.infer<typeof ProjectSchema>

export const CreateProjectInputSchema = ProjectSchema.pick({
  title: true, description: true, techTags: true,
})
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>

import { z } from 'zod'
import { UserSchema } from './user'

// ─── Article ─────────────────────────────────────────────────────────────────

export const ArticleSourceSchema = z.enum(['RSS', 'COMMUNITY', 'CURATED'])
export type ArticleSource = z.infer<typeof ArticleSourceSchema>

export const CommentSchema = z.object({
  id: z.string(),
  articleId: z.string(),
  authorId: z.string(),
  author: UserSchema.pick({ id: true, username: true, avatar: true }).optional(),
  content: z.string().min(1).max(2000),
  parentId: z.string().nullable().optional(),
  replies: z.array(z.lazy((): z.ZodTypeAny => CommentSchema)).optional(),
  createdAt: z.string().datetime(),
})
export type Comment = z.infer<typeof CommentSchema>

export const ArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string().min(5).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(), // full content loaded lazily
  source: ArticleSourceSchema,
  externalUrl: z.string().url().nullable().optional(),
  authorId: z.string().nullable().optional(),
  author: UserSchema.pick({ id: true, username: true, avatar: true }).nullable().optional(),
  tags: z.array(z.string()),
  views: z.number().int().default(0),
  bookmarkCount: z.number().int().default(0),
  commentCount: z.number().int().default(0),
  isBookmarked: z.boolean().optional(),
  published: z.boolean(),
  publishedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
})
export type Article = z.infer<typeof ArticleSchema>

export const CreateArticleInputSchema = ArticleSchema.pick({
  title: true, content: true, tags: true,
}).extend({
  content: z.string().min(100),
})
export type CreateArticleInput = z.infer<typeof CreateArticleInputSchema>

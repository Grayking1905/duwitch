import { z } from 'zod'
import { UserSchema } from './user'

// ─── Direct Message ───────────────────────────────────────────────────────────

export const DirectMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  sender: UserSchema.pick({ id: true, username: true, avatar: true }).optional(),
  content: z.string().min(1).max(4000),
  read: z.boolean().default(false),
  timestamp: z.string().datetime(),
})
export type DirectMessage = z.infer<typeof DirectMessageSchema>

export const ConversationSchema = z.object({
  id: z.string(),
  participants: z.array(UserSchema.pick({ id: true, username: true, avatar: true })),
  lastMessage: DirectMessageSchema.nullable().optional(),
  unreadCount: z.number().int().default(0),
  updatedAt: z.string().datetime(),
})
export type Conversation = z.infer<typeof ConversationSchema>

// ─── Notification ─────────────────────────────────────────────────────────────

export const NotifTypeSchema = z.enum([
  'PROPOSAL_ACCEPTED',
  'PROPOSAL_RECEIVED',
  'NEW_MESSAGE',
  'ROOM_LIVE',
  'ARTICLE_BOOKMARKED',
  'XP_MILESTONE',
  'PROJECT_MEMBER_JOINED',
])
export type NotifType = z.infer<typeof NotifTypeSchema>

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotifTypeSchema,
  title: z.string(),
  body: z.string(),
  href: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.string().datetime(),
})
export type Notification = z.infer<typeof NotificationSchema>

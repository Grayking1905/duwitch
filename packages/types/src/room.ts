import { z } from 'zod'
import { UserSchema } from './user'

// ─── Room ─────────────────────────────────────────────────────────────────────

export const RoomRoleSchema = z.enum(['HOST', 'MEMBER', 'VIEWER'])
export type RoomRole = z.infer<typeof RoomRoleSchema>

export const ParticipantSchema = z.object({
  userId: z.string(),
  username: z.string(),
  avatar: z.string().url().nullable().optional(),
  role: RoomRoleSchema,
  isMuted: z.boolean().default(false),
  isCameraOff: z.boolean().default(false),
  isSharingScreen: z.boolean().default(false),
  joinedAt: z.string().datetime(),
})
export type Participant = z.infer<typeof ParticipantSchema>

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(80),
  description: z.string().max(500).nullable().optional(),
  hostId: z.string(),
  host: UserSchema.pick({ id: true, username: true, avatar: true }).optional(),
  isLive: z.boolean(),
  maxMembers: z.number().int().min(2).max(100).default(50),
  participantCount: z.number().int().default(0),
  participants: z.array(ParticipantSchema).optional(),
  tags: z.array(z.string()).default([]),
  recordingEnabled: z.boolean().default(false),
  createdAt: z.string().datetime(),
})
export type Room = z.infer<typeof RoomSchema>

export const CreateRoomInputSchema = RoomSchema.pick({
  name: true, description: true, maxMembers: true, tags: true,
})
export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>

// ─── Chat Message ─────────────────────────────────────────────────────────────

export const ChatMessageTypeSchema = z.enum(['text', 'code', 'file', 'system'])
export type ChatMessageType = z.infer<typeof ChatMessageTypeSchema>

export const ChatMessageSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  authorId: z.string(),
  author: UserSchema.pick({ id: true, username: true, avatar: true }).optional(),
  content: z.string().max(4000),
  type: ChatMessageTypeSchema,
  language: z.string().optional(), // for code type
  reactions: z.array(z.object({ emoji: z.string(), users: z.array(z.string()) })).default([]),
  edited: z.boolean().default(false),
  timestamp: z.string().datetime(),
})
export type ChatMessage = z.infer<typeof ChatMessageSchema>

// ─── WebSocket Events ─────────────────────────────────────────────────────────

export const WsRoomEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('join-room'), roomId: z.string() }),
  z.object({ type: z.literal('leave-room'), roomId: z.string() }),
  z.object({ type: z.literal('chat-message'), roomId: z.string(), content: z.string(), msgType: ChatMessageTypeSchema }),
  z.object({ type: z.literal('presence-update'), participants: z.array(ParticipantSchema) }),
])
export type WsRoomEvent = z.infer<typeof WsRoomEventSchema>

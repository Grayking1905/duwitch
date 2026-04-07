import type { FastifyInstance } from 'fastify'
import { authRoutes } from '../modules/auth/auth.routes'
import { usersRoutes } from '../modules/users/users.routes'
import { projectsRoutes } from '../modules/projects/project.routes'
import { roomsRoutes } from '../modules/rooms/room.routes'
import { newsRoutes } from '../modules/news/news.routes'
import { searchRoutes } from '../modules/search/search.routes'
import { notificationsRoutes } from '../modules/notifications/notif.routes'
import { messagesRoutes } from '../modules/messages/message.routes'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes,          { prefix: '/auth' })
  await app.register(usersRoutes,         { prefix: '/users' })
  await app.register(projectsRoutes,      { prefix: '/projects' })
  await app.register(roomsRoutes,         { prefix: '/rooms' })
  await app.register(newsRoutes,          { prefix: '/news' })
  await app.register(searchRoutes,        { prefix: '/search' })
  await app.register(notificationsRoutes, { prefix: '/notifications' })
  await app.register(messagesRoutes,      { prefix: '/messages' })
}

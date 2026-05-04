## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2026-04-14 - WebSocket Authentication and BOLA
**Vulnerability:** The WebSocket gateway lacked robust authentication and authorization (BOLA). While it had a placeholder for auth, it didn't verify JWTs, and users could join any room or conversation by knowing its ID.
**Learning:** WebSocket namespaces in Socket.io require explicit middleware application. Authenticating at the root level (`/`) does not automatically protect other namespaces (e.g., `/rooms`, `/dm`). Authorization checks (BOLA) must be performed for every sensitive event (e.g., joining a conversation, sending a message) by verifying the user's relationship to the resource in the database.
**Prevention:** Use `namespace.use(authMiddleware)` for every namespace. Implement BOLA checks at the event level (e.g., `socket.on('message', ...)`). For conversations, verify `conversationParticipant` records. For rooms, verify existence and `isLive` status.

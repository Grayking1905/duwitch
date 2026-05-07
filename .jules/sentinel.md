## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2026-05-20 - Unauthenticated and Unauthorized WebSocket Namespaces
**Vulnerability:** WebSocket namespaces (`/rooms`, `/dm`, `/notif`) were completely unauthenticated, and event handlers lacked BOLA checks. Any user could join any room or conversation and spoof messages by simply knowing the ID.
**Learning:** Middleware in Socket.io must be applied to *each* namespace individually. Applying it only to the main `io` instance doesn't protect sub-namespaces. Furthermore, room membership (`socket.rooms.has(id)`) must be explicitly checked in event handlers to prevent cross-room message injection.
**Prevention:** Always enforce JWT verification on every WebSocket namespace. In event handlers, verify that the socket is actually joined to the target room before processing emissions.

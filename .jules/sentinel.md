## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2024-05-22 - WebSocket Authorization Bypass (BOLA)
**Vulnerability:** A Broken Object Level Authorization (BOLA) risk was identified in the `/dm` WebSocket namespace. While the HTTP API was protected, any authenticated user could join any conversation's Socket.io room and eavesdrop on or spoof messages by simply emitting a `join` event without backend verification.
**Learning:** WebSocket room management often operates outside the standard middleware chain used for REST endpoints. Authentication (verifying who they are) is not the same as Authorization (verifying what they can access).
**Prevention:** Explicitly verify resource membership (e.g., via Prisma) before allowing a socket to join a specific room or emit events targeting a specific resource ID.

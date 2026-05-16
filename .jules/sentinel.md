## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging

**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2025-05-15 - Mass Assignment in Profile Update

**Vulnerability:** The `PATCH /users/me` endpoint used manual TypeScript type casting (`req.body as ...`) instead of runtime validation. This allowed users to potentially overwrite sensitive fields if they were added to the `User` model in the future and not explicitly filtered in the route.
**Learning:** TypeScript types are erased at runtime and provide no protection against malicious payloads. `as` casting is particularly dangerous for request bodies.
**Prevention:** Use Zod schemas with `.parse()` or `.safeParse()` for all incoming request bodies. This ensures both type safety and that only allowed fields are passed to the database layer (automatic filtering).

## 2025-05-16 - Broken Object Level Authorization (BOLA) in Room WebSockets

**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was identified in the `/rooms` WebSocket namespace. Authenticated users could join any room by `roomId` without verifying if the room existed or was currently live. Additionally, users could broadcast messages to any room without being a member of that room.
**Learning:** WebSocket event handlers often bypass the standard route-level authorization logic. Membership and resource state must be explicitly verified within the socket event handlers.
**Prevention:** In WebSocket handlers, always verify the target resource's state (e.g., `isLive`) and the user's authorization/membership (e.g., `socket.rooms.has(roomId)`) before processing actions or broadcasting messages.

## 2026-05-16 - Insecure Placeholder Access Tokens

**Vulnerability:** The authentication system was using a mock, hardcoded placeholder for access tokens instead of real cryptographically signed JWTs. This meant tokens could not be verified for integrity or authenticity.
**Learning:** Decoupling token signing from business logic (Service) is good, but it must be correctly implemented at the delivery layer (Route/Controller) where the signing keys are available.
**Prevention:** Always verify that authentication tokens are signed with a strong secret and never use placeholders in production-bound code. Implement Refresh Token Rotation to mitigate the risk of token theft.

## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2025-05-15 - Missing Runtime Input Validation in API Routes
**Vulnerability:** Several API endpoints (Users, News, Rooms) relied on manual type casting (`req.body as Type`) or manual property extraction without runtime validation. This allowed potentially invalid or malicious data to reach the database layer.
**Learning:** Even with shared TypeScript types/schemas, developers may skip runtime validation for speed or due to oversight, especially when schemas are in a separate package.
**Prevention:** Use `.parse()` on Zod schemas for all POST/PATCH request bodies at the route level. Ensure the shared types package is updated and built whenever new validation requirements arise.

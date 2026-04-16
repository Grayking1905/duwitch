## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2025-05-15 - IDOR in Project Proposals
**Vulnerability:** An Insecure Direct Object Reference (IDOR) was identified in the `POST /projects/:id/proposals` endpoint. A user could submit a proposal with a `roleId` belonging to a different project than the one specified by `:id`.
**Learning:** Route parameters (`:id`) and request body fields (`roleId`) are often treated as implicitly linked, but without explicit database verification, they can be manipulated independently.
**Prevention:** When a request involves multiple related resources (e.g., a project and a role), always verify the relationship in the database (e.g., `role.projectId === project.id`) before proceeding with the operation.

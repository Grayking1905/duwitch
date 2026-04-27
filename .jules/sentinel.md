## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2026-04-15 - Missing Runtime Validation and Mass Assignment Risks
**Vulnerability:** Multiple endpoints (`PATCH /users/me`, `POST /rooms`, `POST /news/articles`) used manual type casting or simple destructuring without runtime validation. This allowed potential mass assignment if sensitive fields were passed and could cause internal errors if malformed data was provided.
**Learning:** Type casting only provides compile-time safety. Runtime validation is necessary to ensure data integrity and security when dealing with external inputs.
**Prevention:** Always use Zod schemas from `@duwitch/types` to parse and validate request bodies. Use `.pick()` or `.omit()` in schemas to strictly control which fields can be modified.

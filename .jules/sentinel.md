## 2026-04-14 - Broken Object Level Authorization (BOLA) in Messaging
**Vulnerability:** A Broken Object Level Authorization (BOLA) vulnerability was found in the `GET /messages/:conversationId` endpoint. Any authenticated user could access the message history of any conversation by providing its `conversationId`, even if they were not a participant.
**Learning:** The route only used the `authenticate` middleware, which ensures the user is logged in but doesn't verify if they have permission to access the specific resource requested.
**Prevention:** Always verify ownership or participation when accessing resources that are not public. Use composite unique constraints in Prisma (like `conversationId_userId`) to efficiently check for participation or access rights.

## 2026-04-15 - IDOR in Resource Linking and BOLA in Proposals
**Vulnerability:** An Insecure Direct Object Reference (IDOR) was found in `POST /projects/:id/proposals` where a `roleId` could be provided without verifying it belonged to the target project. Additionally, a BOLA/Logic flaw allowed project owners to submit proposals to their own projects.
**Learning:** Resource linking (e.g., associating a proposal with a role) must be validated against the parent resource (the project) to prevent cross-resource contamination. Relying solely on the presence of an ID in the request body is insufficient.
**Prevention:** When creating associations between resources, always verify that the child resource (e.g., `roleId`) belongs to the parent resource (e.g., `projectId`) in the same query or via an explicit check.

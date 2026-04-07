# 🌐 Duwitch

> **Build without boundaries.** — A global developer community platform for real-time collaboration, freelance projects, live rooms, and the latest dev news.

---

## What is Duwitch?

Duwitch is a borderless space for developers to:

- 🤝 **Collaborate** — find projects, propose ideas, and contribute across the globe
- 🎙️ **Stream & Share** — Discord-like rooms with live video, audio, screen share, and collaborative code editing
- 💼 **Find Freelance Work** — browse open projects with role-based applications (frontend, backend, etc.)
- 📰 **Stay Informed** — curated RSS news + community articles with tag subscriptions
- 👤 **Build a Profile** — GitHub-linked portfolio with XP, skills, availability, and reputation

---

## Architecture

Full architecture documentation: **[ARCHITECTURE.md](./ARCHITECTURE.md)**

| Area | Stack |
|------|-------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query |
| Backend | Node.js, Fastify, Socket.io, Prisma ORM, BullMQ |
| Real-Time | Socket.io + mediasoup SFU (WebRTC) |
| Code Share | Monaco Editor + Yjs CRDT |
| Databases | PostgreSQL · MongoDB · Redis · Elasticsearch |
| Storage | Cloudflare R2 (media, recordings) |
| Infra | Docker · Kubernetes · GitHub Actions |
| Monorepo | Turborepo + pnpm workspaces |

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start infrastructure (Postgres, Redis, Mongo, Elasticsearch)
docker compose up -d

# Run DB migrations
pnpm --filter @duwitch/api prisma migrate dev

# Start all apps in dev mode
pnpm dev
# → web:  http://localhost:3000
# → api:  http://localhost:3001
```

---

## Repo Structure

```
duwitch/
├── apps/
│   ├── web/        # Next.js 14 frontend
│   └── api/        # Fastify backend
├── packages/
│   ├── ui/         # Shared component library
│   ├── types/      # Shared TypeScript types + Zod schemas
│   └── config/     # Shared ESLint, TSConfig, Tailwind base
├── infra/
│   ├── docker-compose.yml
│   └── k8s/
└── .github/workflows/
```

---

*Duwitch — April 2026*
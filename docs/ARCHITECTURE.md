# 🌐 Duwitch — Complete Project Architecture

> **Duwitch** is a borderless developer community platform where engineers worldwide collaborate, find projects, stream live work sessions, and stay current with the latest dev news — all without walls.

---

## Table of Contents

1. [Vision & Core Principles](#1-vision--core-principles)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Frontend — `apps/web`](#4-frontend--appsweb)
5. [Backend — `apps/api`](#5-backend--appsapi)
6. [Shared Packages — `packages/`](#6-shared-packages--packages)
7. [Infrastructure — `infra/`](#7-infrastructure--infra)
8. [Database Architecture](#8-database-architecture)
9. [Real-Time & Media Architecture](#9-real-time--media-architecture)
10. [Feature Module Breakdown](#10-feature-module-breakdown)
11. [Authentication & Authorization](#11-authentication--authorization)
12. [Search Architecture](#12-search-architecture)
13. [Notification System](#13-notification-system)
14. [CI/CD Pipeline](#14-cicd-pipeline)
15. [Security Considerations](#15-security-considerations)
16. [Tech Stack Summary](#16-tech-stack-summary)
17. [Development Roadmap](#17-development-roadmap)
18. [Environment Variables Reference](#18-environment-variables-reference)

---

## 1. Vision & Core Principles

### What is Duwitch?
Duwitch is a **developer-first community platform** designed to break geographic and professional isolation. It serves as:

- A **collaboration hub** — developers find projects, propose ideas, and contribute across the globe
- A **Discord-like rooms system** — live video/audio + screen-share + code-share rooms for real-time collaboration
- A **freelancer marketplace** — open project listings with role-based applications (frontend, backend, etc.)
- A **dev news aggregator** — RSS-curated and community-submitted articles with tag subscriptions
- A **portfolio-backed profile system** — GitHub-linked dev profiles with XP, skills, and availability status

### Design Principles

| Principle | Application |
|-----------|-------------|
| **Real-time first** | WebSockets for all live interactions; HTTP only for initial loads |
| **Type-safe end-to-end** | Shared Zod schemas from `packages/types` used in both API and UI |
| **Separation of concerns** | Self-contained feature modules in both API and frontend |
| **Scalable by design** | Redis pub/sub, mediasoup SFU, BullMQ workers — no single-point bottlenecks |
| **Security by default** | JWT + RBAC, rate limiting, helmet headers on every route |
| **Open & extensible** | Monorepo design allows teams to own a single module independently |

---

## 2. System Architecture Overview

```
+---------------------------------------------------------------------+
|                         CLIENT LAYER                                |
|  +--------------+  +----------+  +-------------+  +-------------+  |
|  | Web App      |  | Rooms UI |  | News Feed   |  | Projects    |  |
|  | (Next.js 14) |  | live/collab  | articles   |  | Board       |  |
|  +--------------+  +----------+  +-------------+  +-------------+  |
+----------------------------------+----------------------------------+
                                   |  REST / GraphQL · WebSocket · WebRTC
+----------------------------------v----------------------------------+
|                         GATEWAY LAYER                               |
|  +-----------------+  +------------------+  +-------------------+  |
|  | API Gateway     |  | WebSocket Server |  | Media Server      |  |
|  | rate-limit,auth |  | rooms, presence  |  | mediasoup SFU     |  |
|  +-----------------+  +------------------+  +-------------------+  |
+----------------------------------+----------------------------------+
                                   |  internal service calls
+----------------------------------v----------------------------------+
|                        SERVICES LAYER                               |
|  +------------+  +------------+  +-------------+  +-------------+  |
|  |Auth Service|  |User Service|  |Project Svc  |  | News Service|  |
|  |JWT, OAuth  |  |profiles    |  |listings,role|  |RSS, articles|  |
|  +------------+  +------------+  +-------------+  +-------------+  |
|  +--------------------+  +-------------------------+               |
|  | Community Service  |  | Notification Service    |               |
|  | rooms, threads     |  | push, email, bell        |               |
|  +--------------------+  +-------------------------+               |
+----------------------------------+----------------------------------+
                                   |  data persistence
+----------------------------------v----------------------------------+
|                          DATA LAYER                                 |
|  +-----------+  +-------+  +----------+  +------+  +------------+  |
|  | PostgreSQL|  | Redis |  | MongoDB  |  | S3/R2|  |Elasticsearch  |
|  | core data |  |session|  | chat hist|  | media|  | full-text  |  |
|  +-----------+  +-------+  +----------+  +------+  +------------+  |
+---------------------------------------------------------------------+
```

---

## 3. Monorepo Structure

The project uses **Turborepo** with **pnpm workspaces** for a high-performance, build-cached monorepo.

```
duwitch/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   └── api/                    # Fastify backend
├── packages/
│   ├── ui/                     # Shared design system components
│   ├── types/                  # Shared TypeScript types + Zod schemas
│   └── config/                 # Shared ESLint, TSConfig, Tailwind base
├── infra/
│   ├── docker-compose.yml      # Local dev stack
│   ├── docker-compose.prod.yml # Production stack
│   ├── k8s/                    # Kubernetes manifests
│   │   ├── web.yaml
│   │   ├── api.yaml
│   │   ├── media-server.yaml
│   │   ├── redis.yaml
│   │   └── ingress.yaml
│   └── nginx/
│       └── nginx.conf
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, test, type-check
│       ├── deploy-staging.yml
│       └── deploy-prod.yml
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 4. Frontend — `apps/web`

### Directory Layout

```
apps/web/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout (Providers, fonts, meta)
│   ├── (auth)/                   # Auth route group (no main nav)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── callback/             # OAuth callback handler
│   │       └── page.tsx
│   └── (main)/                   # Authenticated app shell
│       ├── layout.tsx            # Main nav + sidebar wrapper
│       ├── feed/                 # Home timeline
│       │   └── page.tsx
│       ├── projects/
│       │   ├── page.tsx          # Project marketplace listing
│       │   ├── new/
│       │   │   └── page.tsx      # Create project form
│       │   └── [id]/
│       │       ├── page.tsx      # Project detail view
│       │       ├── board/        # Status board
│       │       │   └── page.tsx
│       │       └── proposals/    # Dev proposals/suggestions
│       │           └── page.tsx
│       ├── rooms/
│       │   ├── page.tsx          # Room browser
│       │   ├── create/
│       │   │   └── page.tsx      # Create room
│       │   └── [roomId]/
│       │       ├── page.tsx      # Live room (video/audio/chat)
│       │       └── loading.tsx   # Skeleton loader
│       ├── news/
│       │   ├── page.tsx          # News feed / trending
│       │   ├── write/            # Community article editor
│       │   │   └── page.tsx
│       │   ├── topics/[tag]/     # Tag-filtered news
│       │   │   └── page.tsx
│       │   └── [slug]/           # Full article view
│       │       └── page.tsx
│       ├── devs/
│       │   ├── page.tsx          # Developer directory
│       │   └── [username]/       # Dev profile
│       │       └── page.tsx
│       └── messages/
│           ├── page.tsx          # Inbox / conversation list
│           └── [userId]/         # Direct message thread
│               └── page.tsx
├── components/
│   ├── ui/                       # Base design system (shadcn/ui)
│   │   ├── Button.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── Input.tsx
│   │   ├── Tooltip.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── feed/
│   │   ├── FeedItem.tsx
│   │   ├── FeedSkeleton.tsx
│   │   └── CreatePostBox.tsx
│   ├── project/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── RoleTag.tsx
│   │   ├── ProposalThread.tsx
│   │   └── StatusBadge.tsx
│   ├── room/
│   │   ├── RoomCard.tsx
│   │   ├── VideoGrid.tsx
│   │   ├── VideoTile.tsx
│   │   ├── RoomControls.tsx      # Mic/camera/screen-share toggles
│   │   ├── ChatPanel.tsx
│   │   ├── ParticipantList.tsx
│   │   └── CodeSharePanel.tsx    # Monaco Editor integration
│   ├── news/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleEditor.tsx     # Rich text editor
│   │   ├── TagPill.tsx
│   │   └── TrendingBar.tsx
│   ├── dev/
│   │   ├── DevCard.tsx
│   │   ├── SkillChip.tsx
│   │   ├── AvailabilityDot.tsx
│   │   └── ReputationBar.tsx
│   └── shared/
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── SearchBar.tsx
│       └── NotificationBell.tsx
├── hooks/
│   ├── useRoom.ts                # Room join/leave/media control
│   ├── usePresence.ts            # Active user presence
│   ├── useSocket.ts              # Socket.io connection manager
│   ├── useWebRTC.ts              # mediasoup-client wrapper
│   ├── useAuth.ts                # Auth state + session refresh
│   └── useInfiniteScroll.ts      # Virtualized feed scrolling
├── lib/
│   ├── api.ts                    # Typed fetch wrapper (REST)
│   ├── socket.ts                 # Socket.io-client singleton
│   ├── webrtc.ts                 # mediasoup-client peer logic
│   ├── auth.ts                   # JWT helpers + NextAuth config
│   └── constants.ts              # App-wide constants
├── store/                        # Zustand global state slices
│   ├── roomStore.ts              # Active room participants, media tracks
│   ├── userStore.ts              # Current user + profile
│   ├── notifStore.ts             # Notification queue
│   └── uiStore.ts                # Modal, drawer, theme state
├── styles/
│   ├── globals.css
│   └── tokens.css                # CSS custom properties (design tokens)
├── public/
│   ├── icons/
│   └── og/                       # Open Graph images
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### State Management Strategy

| State Type | Tool | Example |
|---|---|---|
| Global UI / Ephemeral | Zustand | theme, modal open, room participants |
| Server data / cached | TanStack Query | user feed, project list, news articles |
| Real-time / live | Zustand + Socket events | room chat, presence, incoming calls |
| URL-derived | Next.js `useSearchParams` | filters, search query, pagination |

### Routing Groups Rationale

- `(auth)/` — unauthenticated pages; share a minimal layout with no sidebar
- `(main)/` — all authenticated pages; share a persistent Sidebar + Navbar
- Dynamic segments like `[roomId]` use SSR for meta/SEO and WebSocket on the client

---

## 5. Backend — `apps/api`

### Directory Layout

```
apps/api/
├── src/
│   ├── main.ts                   # App entry, Fastify server bootstrap
│   ├── gateway/
│   │   ├── router.ts             # Central route registry
│   │   ├── websocket.ts          # Socket.io hub (rooms, presence, DMs)
│   │   └── middleware/
│   │       ├── auth.ts           # JWT verify, attach req.user
│   │       ├── rateLimit.ts      # @fastify/rate-limit config
│   │       └── logger.ts         # Pino structured logging
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.ts   # Login, register, token refresh logic
│   │   │   ├── auth.routes.ts    # POST /auth/login, /register, /refresh
│   │   │   ├── auth.schema.ts    # Zod validation schemas
│   │   │   └── oauth/
│   │   │       ├── github.ts     # GitHub OAuth strategy
│   │   │       └── google.ts     # Google OAuth strategy
│   │   ├── users/
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.schema.ts
│   │   ├── projects/
│   │   │   ├── project.service.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── project.schema.ts
│   │   │   └── roles.service.ts  # Role openings (frontend, backend…)
│   │   ├── rooms/
│   │   │   ├── room.service.ts   # Create, join, end rooms
│   │   │   ├── room.routes.ts    # REST endpoints for room CRUD
│   │   │   ├── room.gateway.ts   # Socket.io events + mediasoup signaling
│   │   │   └── room.schema.ts
│   │   ├── news/
│   │   │   ├── news.service.ts   # Article CRUD + feed assembly
│   │   │   ├── news.routes.ts
│   │   │   ├── news.schema.ts
│   │   │   └── scraper.ts        # RSS feed fetcher / HTML crawler
│   │   ├── messages/
│   │   │   ├── message.service.ts
│   │   │   ├── message.routes.ts # REST history endpoints
│   │   │   └── message.gateway.ts # Real-time DM via Socket.io
│   │   ├── search/
│   │   │   ├── search.service.ts # Elasticsearch query builder
│   │   │   └── search.routes.ts  # GET /search?q=&type=
│   │   └── notifications/
│   │       ├── notif.service.ts
│   │       ├── notif.routes.ts
│   │       └── notif.gateway.ts  # Push via Socket.io
│   ├── db/
│   │   ├── postgres/
│   │   │   └── client.ts         # Prisma client singleton
│   │   ├── mongo/
│   │   │   ├── client.ts         # Mongoose connection
│   │   │   └── models/
│   │   │       ├── ChatMessage.ts
│   │   │       └── RoomEvent.ts
│   │   └── redis/
│   │       └── client.ts         # ioredis singleton
│   ├── media/
│   │   ├── mediasoup.ts          # Worker/Router bootstrap
│   │   ├── transport.ts          # WebRTC transport helpers
│   │   └── recorder.ts           # Room recording → Cloudflare R2
│   ├── jobs/                     # BullMQ background workers
│   │   ├── email.job.ts          # Transactional emails (Resend/SendGrid)
│   │   ├── scraper.job.ts        # RSS feed refresh (cron every 15m)
│   │   └── notif.job.ts          # Async notification dispatch
│   └── utils/
│       ├── jwt.ts
│       ├── crypto.ts
│       └── slug.ts
├── prisma/
│   └── schema.prisma
├── package.json
└── tsconfig.json
```

### API Route Map

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register with email + password |
| `POST` | `/auth/login` | ❌ | Login, receive JWT pair |
| `GET` | `/auth/github` | ❌ | GitHub OAuth redirect |
| `GET` | `/auth/google` | ❌ | Google OAuth redirect |
| `POST` | `/auth/refresh` | ❌ | Refresh access token |
| `GET` | `/users/:username` | ✅ | Get dev profile |
| `PATCH` | `/users/me` | ✅ | Update own profile |
| `GET` | `/projects` | ✅ | List projects (paginated, filtered) |
| `POST` | `/projects` | ✅ | Create project |
| `GET` | `/projects/:id` | ✅ | Project detail |
| `POST` | `/projects/:id/proposals` | ✅ | Submit proposal/suggestion |
| `GET` | `/rooms` | ✅ | List active rooms |
| `POST` | `/rooms` | ✅ | Create room |
| `GET` | `/rooms/:roomId` | ✅ | Room detail |
| `GET` | `/news` | ❌ | News feed (public) |
| `POST` | `/news/articles` | ✅ | Submit community article |
| `GET` | `/news/:slug` | ❌ | Single article view |
| `GET` | `/search` | ✅ | Universal search (devs, projects, news) |
| `GET` | `/notifications` | ✅ | Notification history |

### WebSocket Events (Socket.io)

| Namespace | Event | Direction | Purpose |
|-----------|-------|-----------|---------|
| `/rooms` | `join-room` | C→S | User enters a room |
| `/rooms` | `leave-room` | C→S | User leaves a room |
| `/rooms` | `presence-update` | S→C | Participant list changed |
| `/rooms` | `chat-message` | C↔S | Room chat message |
| `/rooms` | `rtp-capabilities` | S→C | mediasoup RTP caps |
| `/rooms` | `create-transport` | C→S | Request WebRTC transport |
| `/rooms` | `transport-params` | S→C | Return transport params |
| `/rooms` | `produce` | C→S | Start producing media track |
| `/rooms` | `new-producer` | S→C | Notify others of new producer |
| `/rooms` | `consume` | C→S | Start consuming a track |
| `/dm` | `message` | C↔S | Direct message |
| `/dm` | `typing` | C↔S | Typing indicator |
| `/notif` | `notification` | S→C | Push a notification bell |

---

## 6. Shared Packages — `packages/`

### `packages/types`
```
packages/types/
├── src/
│   ├── user.ts           # User, DevProfile, SkillTag — types + Zod schemas
│   ├── project.ts        # Project, RoleOpening, Proposal
│   ├── room.ts           # Room, Participant, RoomEvent
│   ├── news.ts           # Article, NewsSource, Comment
│   ├── message.ts        # DirectMessage, ChatMessage
│   └── index.ts          # barrel export
├── package.json
└── tsconfig.json
```

All types are generated from **Zod schemas** — so both the API (validation) and web (form validation, typed responses) use the same single source of truth.

### `packages/ui`
```
packages/ui/
├── src/
│   ├── components/       # Button, Card, Avatar, Badge, Dialog, Input…
│   ├── tokens/           # Design tokens (colors, spacing, typography)
│   └── hooks/            # useMediaQuery, useClickOutside
├── tailwind.config.ts
└── package.json
```

### `packages/config`
```
packages/config/
├── eslint/
│   └── index.js          # Shared ESLint config (extends Airbnb + TS)
├── tsconfig/
│   ├── base.json
│   ├── nextjs.json
│   └── node.json
└── tailwind-base.ts      # Shared Tailwind base config
```

---

## 7. Infrastructure — `infra/`

### `docker-compose.yml` (Local Dev)
```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: duwitch
      POSTGRES_USER: duwitch
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
    volumes: ["pg_data:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: ["mongo_data:/data/db"]

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    environment:
      discovery.type: single-node
      xpack.security.enabled: "false"
    ports: ["9200:9200"]

  coturn:
    image: coturn/coturn:latest
    ports:
      - "3478:3478/udp"
      - "3478:3478/tcp"

volumes:
  pg_data:
  mongo_data:
```

### Kubernetes Structure (`infra/k8s/`)
```
k8s/
├── namespaces.yaml
├── web/
│   ├── deployment.yaml         # Next.js pods
│   ├── service.yaml
│   └── hpa.yaml                # Horizontal Pod Autoscaler
├── api/
│   ├── deployment.yaml         # Fastify pods (stateless)
│   ├── service.yaml
│   └── hpa.yaml
├── media/
│   ├── deployment.yaml         # mediasoup pods (needs UDP port range)
│   └── service.yaml
├── ingress.yaml                # NGINX Ingress + TLS via cert-manager
└── configmaps/
    └── app-config.yaml
```

---

## 8. Database Architecture

### PostgreSQL — Primary Relational Store (Prisma ORM)

```prisma
model User {
  id           String      @id @default(cuid())
  username     String      @unique
  email        String      @unique
  passwordHash String?
  githubId     String?     @unique
  googleId     String?     @unique
  avatar       String?
  bio          String?
  availability AvailStatus @default(OPEN)
  xp           Int         @default(0)
  skills       Skill[]
  projects     ProjectMember[]
  proposals    Proposal[]
  articles     Article[]
  notifications Notification[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model Project {
  id          String        @id @default(cuid())
  title       String
  description String
  techTags    String[]
  status      ProjectStatus @default(OPEN)
  ownerId     String
  owner       User          @relation(fields: [ownerId], references: [id])
  members     ProjectMember[]
  roles       RoleOpening[]
  proposals   Proposal[]
  createdAt   DateTime      @default(now())
}

model Room {
  id          String   @id @default(cuid())
  name        String
  description String?
  hostId      String
  isLive      Boolean  @default(false)
  maxMembers  Int      @default(50)
  createdAt   DateTime @default(now())
}

model Article {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  content   String   @db.Text
  authorId  String?
  source    String?
  tags      String[]
  published Boolean  @default(false)
  views     Int      @default(0)
  createdAt DateTime @default(now())
}

enum ProjectStatus { OPEN IN_PROGRESS COMPLETED ARCHIVED }
enum AvailStatus   { OPEN BUSY UNAVAILABLE }
```

### MongoDB — Append-Heavy Message Store

```js
// ChatMessage document
{
  roomId:    ObjectId,
  authorId:  String,       // User cuid from Postgres
  content:   String,
  type:      "text" | "code" | "file",
  timestamp: Date,
  edited:    Boolean,
  reactions: [{ emoji: String, users: [String] }]
}

// RoomEvent document (audit log)
{
  roomId:    ObjectId,
  event:     "join" | "leave" | "record-start" | "record-stop",
  userId:    String,
  timestamp: Date
}
```

### Redis — Cache, Sessions, Pub/Sub

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `sess:{userId}` | 7d | Refresh token session |
| `presence:{roomId}` | 30s | Live participant set (SADD) |
| `room:sfu:{roomId}` | ∞ | mediasoup Router ID mapping |
| `ratelimit:{ip}` | 60s | Rate limit sliding window |
| `notif:queue:{userId}` | — | BullMQ notification queue |

### Elasticsearch — Full-Text Search

Three indices with denormalized fields:

```
duwitch-users    → username, bio, skills[]
duwitch-projects → title, description, techTags[], status
duwitch-news     → title, content (excerpt), tags[], author
```

---

## 9. Real-Time & Media Architecture

### Socket.io Namespaces

```
/rooms   — room presence, chat, mediasoup signaling
/dm      — direct messaging between users
/notif   — server-pushed notification bells
```

Socket.io uses the **Redis adapter** (`@socket.io/redis-adapter`) so events broadcast correctly across all API pod replicas in Kubernetes.

### mediasoup SFU — WebRTC Flow

```
Browser A (Producer)
    |
    |-- WebSocket signaling --> Fastify /rooms gateway
    |                               |
    |                          mediasoup
    |                          Worker -> Router (= 1 Room)
    |                               |
    |-- RTP media (UDP) ----------->|
                                    |-- RTP media (UDP) --> Browser B (Consumer)
                                    |-- RTP media (UDP) --> Browser C (Consumer)
```

**Key mediasoup objects:**
- **Worker** — 1 per CPU core, spawned at startup
- **Router** — 1 per room; handles RTP routing between transports
- **WebRtcTransport** — 1 send + 1 receive per participant
- **Producer** — 1 per media track (audio, video, screen)
- **Consumer** — 1 per (track × subscriber) pair

**TURN/STUN:** `coturn` handles NAT traversal; required for users on corporate networks or mobile carriers.

### Collaborative Code Share in Rooms

- **Editor:** Monaco Editor (VS Code engine) in `CodeSharePanel.tsx`
- **Sync:** **Yjs CRDT** over the `/rooms` Socket.io namespace — conflict-free real-time editing
- **Language support:** Syntax highlighting for all major languages via Monaco

### Room Recording & Replay

```
mediasoup PlainTransport
    --> FFmpeg (raw RTP transcoding)
    --> HLS segments (.ts + .m3u8)
    --> Upload to Cloudflare R2
    --> CDN-served replay URL
```

---

## 10. Feature Module Breakdown

### Feed (Home Timeline)
- Aggregates: project updates, new live rooms, trending articles, followed dev activity
- Pagination: cursor-based infinite scroll
- Personalization: weighted by subscribed skills/tags + recency score

### Rooms (Discord-like)

| Sub-feature | Implementation |
|-------------|---------------|
| Video/Audio | mediasoup SFU (VP8/VP9 + Opus) |
| Screen Share | `getDisplayMedia()` → additional Producer track |
| Code Share | Monaco Editor + Yjs CRDT sync over Socket.io |
| Room Chat | Socket.io events → MongoDB persistence |
| Role system | host / member / viewer (enforced server-side) |
| Recording | mediasoup PlainTransport → FFmpeg → R2 |
| Replay | HLS stream from R2 served via CDN |

### Projects Marketplace

| Sub-feature | Implementation |
|-------------|---------------|
| Project listing | Postgres `projects` table + Elasticsearch |
| Role openings | `RoleOpening` model with tech tag filtering |
| Status board | Kanban columns via `/projects/:id/board` |
| Proposals/Suggestions | Threaded `Proposal` model; real-time via Socket.io |
| Dev-to-dev DM | `/dm` Socket.io namespace + Mongo message store |

### News & Articles

| Sub-feature | Implementation |
|-------------|---------------|
| RSS aggregation | BullMQ cron job every 15m → `scraper.ts` → Postgres + ES |
| Community articles | Rich-text editor → POST `/news/articles` |
| Tag subscriptions | `user_tag_subscriptions` join table; filtered feed |
| Trending | View count + bookmark count compound sort |
| Comments | Nested `Comment` model in Postgres |
| Bookmarks | Many-to-many `article_bookmarks` table |

### Dev Profiles

| Sub-feature | Implementation |
|-------------|---------------|
| GitHub OAuth | Passport.js GitHub strategy; syncs avatar + username |
| Skill tags | Many-to-many `skills` join table |
| Availability | Enum column `AvailStatus` (OPEN / BUSY / UNAVAILABLE) |
| XP / Reputation | Server-side event scoring (proposal accepted = +50 XP) |
| Portfolio links | `portfolioLinks` JSON column |
| Project history | Derived from `ProjectMember` join table |

---

## 11. Authentication & Authorization

### Auth Flow (JWT)

```
Browser --> POST /auth/login { email, password }
        <-- { accessToken (15m), refreshToken (7d cookie) }

Browser --> GET /api/resource
            Authorization: Bearer <accessToken>
        <-- 200 OK data

// Token refresh
Browser --> POST /auth/refresh
        <-- { newAccessToken }
```

### OAuth (GitHub / Google)

```
Browser --> GET /auth/github
        <-- redirect to GitHub
GitHub  --> GET /auth/github/callback?code=...
API     --> upsert User, issue JWT
        <-- redirect to /feed
```

### RBAC Roles

| Role | Scope | Permissions |
|------|-------|-------------|
| `admin` | Platform | Full access, user management |
| `user` | Platform | Create projects, join rooms, post articles |
| `host` | Room | Kick participants, control recording |
| `member` | Room | Produce media, send chat |
| `viewer` | Room | Consume media only |
| `owner` | Project | Edit/delete project, manage roles |
| `contributor` | Project | Post proposals, update status |

---

## 12. Search Architecture

```
User types in SearchBar
    |
    v
GET /search?q=react&type=devs,projects,news&page=1
    |
    v
search.service.ts
  --> Elasticsearch multi-search (one query, three indices)
  --> Returns unified ranked results

SearchResultsPage renders:
  - DevCard components
  - ProjectCard components
  - ArticleCard components
```

**Index sync:** A BullMQ worker listens for Postgres events (pg-notify) and keeps Elasticsearch indices current within ~5 seconds.

---

## 13. Notification System

### Flow

```
API Event (e.g. "proposal accepted")
    |
    v
notif.service.ts --> push to BullMQ notif queue
    |
    v
notif.job.ts (worker)
  ├── In-app:  notif.gateway.ts --> Socket.io --> browser bell icon
  ├── Email:   email.job.ts --> Resend / SendGrid
  └── Persist: save to Postgres notifications table
```

### Notification Types

| Trigger | In-App | Email |
|---------|--------|-------|
| Proposal accepted on your project | ✅ | ✅ |
| New DM received | ✅ | ✅ (digest) |
| Room you follow went live | ✅ | ❌ |
| Your article was bookmarked | ✅ | ❌ |
| XP rank milestone reached | ✅ | ❌ |
| New dev joined your project | ✅ | ✅ |

---

## 14. CI/CD Pipeline

### GitHub Actions Workflow

```
Push to any branch
    |
    v  ci.yml
    ├── pnpm install (frozen lockfile)
    ├── turbo lint
    ├── turbo type-check
    └── turbo test  (with Postgres + Redis services)

Push to main (after CI green)
    |
    v  deploy-staging.yml
    ├── Docker build (web + api images)
    ├── Push to GHCR
    └── kubectl rollout update (staging namespace)

Manual approval
    |
    v  deploy-prod.yml
    └── kubectl rollout update (production namespace, zero downtime)
```

### Deployment Stages

```
feature/* --> PR --> CI passes --> staging (auto) --> prod (manual approve)
```

---

## 15. Security Considerations

| Area | Measure |
|------|---------|
| Auth tokens | JWT RS256 signed; access token 15m, refresh 7d |
| Transport | HTTPS + HSTS; WSS for WebSocket |
| Input | Zod validation on every API endpoint |
| Rate limiting | `@fastify/rate-limit` per IP + per user |
| HTTP headers | `@fastify/helmet` (CSP, HSTS, X-Frame-Options) |
| WebRTC media | DTLS-SRTP encryption on all mediasoup transports |
| File uploads | Type + size limits; malware scan before R2 |
| SQL safety | Prisma parameterized queries (zero raw SQL in app) |
| XSS | React auto-escaping + DOMPurify on rich-text render |
| CORS | Explicit allowlist; credentials only same-origin |

---

## 16. Tech Stack Summary

### Frontend

| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | SSR/SSG, routing, edge API routes |
| TypeScript | End-to-end type safety |
| Tailwind CSS | Utility-first styling |
| Zustand | Global ephemeral state |
| TanStack Query | Server state, caching, mutations |
| Socket.io-client | WebSocket connection |
| mediasoup-client | WebRTC peer management |
| Monaco Editor | In-room collaborative code editor |
| Yjs | CRDT for conflict-free real-time editing |
| shadcn/ui | Accessible base UI components |

### Backend

| Technology | Purpose |
|-----------|---------|
| Node.js 20+ | Runtime |
| Fastify | High-performance HTTP server |
| TypeScript | Type-safe server code |
| Socket.io | WebSocket server (rooms, DM, notif) |
| Prisma ORM | PostgreSQL schema + migrations |
| Mongoose | MongoDB ODM (chat messages) |
| mediasoup | SFU for WebRTC media routing |
| BullMQ | Background job queues |
| Passport.js | OAuth strategies |
| Zod | Schema validation |
| Pino | Structured JSON logging |

### Data & Infrastructure

| Technology | Purpose |
|-----------|---------|
| PostgreSQL 16 | Primary relational database |
| MongoDB 7 | Chat messages, room event logs |
| Redis 7 | Sessions, pub/sub, rate limiting, queues |
| Elasticsearch 8 | Full-text search across all entities |
| Cloudflare R2 | Media storage (recordings, avatars, uploads) |
| coturn | STUN/TURN server for NAT traversal |
| Docker | Containerization |
| Kubernetes | Orchestration + auto-scaling |
| GitHub Actions | CI/CD pipelines |
| Turborepo | Monorepo build cache |
| pnpm | Fast, space-efficient package manager |

---

## 17. Development Roadmap

### Phase 1 — Foundation (Weeks 1–4)
- [ ] Monorepo scaffold (Turborepo + pnpm)
- [ ] Database schemas + Prisma migrations
- [ ] Auth system (email + GitHub OAuth)
- [ ] Basic user profiles
- [ ] Project listing CRUD
- [ ] News RSS scraper (basic)

### Phase 2 — Core Features (Weeks 5–10)
- [ ] Projects Marketplace (proposals, role openings, status board)
- [ ] Direct Messaging (DM) system
- [ ] Rooms (text-only first → then audio/video)
- [ ] mediasoup SFU integration + TURN
- [ ] Code Share (Monaco + Yjs)
- [ ] News articles + community submission

### Phase 3 — Growth Features (Weeks 11–16)
- [ ] Dev Profiles (XP, reputation, portfolio)
- [ ] Full-text search (Elasticsearch)
- [ ] Notification system (in-app + email)
- [ ] Room recording + HLS replay
- [ ] Trending / Personalized feed algorithm
- [ ] Tag subscriptions for news

### Phase 4 — Scale & Polish (Weeks 17–20)
- [ ] Kubernetes production deployment
- [ ] Performance monitoring (OpenTelemetry + Grafana)
- [ ] Mobile-responsive refinement
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] API abuse detection
- [ ] Public documentation site

---

## 18. Environment Variables Reference

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_MEDIA_URL=wss://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `apps/api/.env`
```env
# Server
PORT=3001
NODE_ENV=development

# Auth
JWT_SECRET=your-rs256-private-key
JWT_REFRESH_SECRET=your-refresh-secret
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Databases
DATABASE_URL=postgresql://duwitch:secret@localhost:5432/duwitch
MONGODB_URI=mongodb://localhost:27017/duwitch
REDIS_URL=redis://localhost:6379

# Search
ELASTICSEARCH_URL=http://localhost:9200

# Storage
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=duwitch-media

# Email
RESEND_API_KEY=...

# mediasoup
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=<your-public-ip>
MEDIASOUP_RTC_MIN_PORT=10000
MEDIASOUP_RTC_MAX_PORT=10100

# TURN
COTURN_SERVER=turn:your-server.com:3478
COTURN_USERNAME=...
COTURN_CREDENTIAL=...
```

---

## Quick Start (Development)

```bash
# 1. Clone the repo
git clone https://github.com/your-org/duwitch.git
cd duwitch

# 2. Install dependencies
pnpm install

# 3. Start infrastructure (Postgres, Redis, Mongo, Elasticsearch)
docker compose up -d

# 4. Run database migrations
pnpm --filter @duwitch/api prisma migrate dev

# 5. Start all apps (hot reload)
pnpm dev
# web:  http://localhost:3000
# api:  http://localhost:3001
```

---

*Architecture version: 1.0 | April 2026*  
*Duwitch — Build without boundaries.*

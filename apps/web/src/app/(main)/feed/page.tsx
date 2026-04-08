import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Star,
  GitFork,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Feed',
  description:
    'Your personalized developer activity feed on Duwitch — stay connected with the dev community',
}

/* ── Mock Data ──────────────────────────────────────────────────────── */
const activeRooms = [
  {
    id: '1',
    title: 'Refactoring Duwitch Core',
    host: '@dev_neo',
    tech: 'Rust / WebAssembly',
    viewers: 142,
    color: 'from-brand-500 to-brand-700',
  },
  {
    id: '2',
    title: 'Building a Shaders Engine',
    host: '@glsl_wizard',
    tech: 'Three.js / GLSL',
    viewers: 89,
    color: 'from-neon-cyan to-blue-500',
  },
  {
    id: '3',
    title: 'React 19 Server Components',
    host: '@sarah_codes',
    tech: 'Next.js / React',
    viewers: 214,
    color: 'from-neon-pink to-red-500',
  },
]

const feedPosts = [
  {
    id: '1',
    author: 'Alex Rivera',
    handle: '@rivera_ops',
    avatar: 'AR',
    time: '2h ago',
    content:
      "Just pushed the initial beta for the #Synthetix engine. It's handling over 100k concurrent WebSocket connections with <10ms latency. Anyone want to help stress test the cluster this weekend? 🚀",
    likes: 248,
    comments: 42,
    shares: 18,
  },
  {
    id: '2',
    author: 'Maya Zhang',
    handle: '@maya_z',
    avatar: 'MZ',
    time: '5h ago',
    content:
      'Finally got the @Duwitch API integration working with my local VS Code extension. The productivity gains are actually insane. 🤯',
    likes: 156,
    comments: 28,
    shares: 11,
  },
]

const trendingProjects = [
  {
    id: '1',
    name: 'Lumina Shader Lab',
    version: 'v2.4.1',
    description: 'A collaborative real-time shader playground for WebGL and Vulkan enthusiasts.',
    stars: '8.2k',
    forks: 420,
    trend: '+12%',
    color: 'brand',
  },
  {
    id: '2',
    name: 'EtherOS',
    version: 'BETA',
    description:
      'Micro-kernel operating system written entirely in Zig. Focus on privacy and low latency.',
    stars: '3.1k',
    forks: 156,
    trend: '+5%',
    color: 'cyan',
  },
  {
    id: '3',
    name: 'NebulaDB',
    version: 'v1.0-RC',
    description: 'Distributed vector database optimized for edge computing and local-first AI.',
    stars: '1.9k',
    forks: 89,
    trend: 'HOT',
    color: 'pink',
  },
]

const devOfWeek = {
  name: 'Marcus Thorne',
  title: 'Core Contributor at Linux',
  quote:
    '"Consistency is the secret ingredient. I\'ve been shipping code daily for 1,400 days straight."',
  avatar: 'MT',
}

const featuredProject = {
  title: 'AI-Driven UI Generator for Tailwind',
  description:
    'Looking for senior frontend engineers and LLM specialists to build a next-gen visual editor that translates prompt logic directly into optimized Tailwind structures.',
  tags: ['React', 'LLM', 'Tailwind', 'TypeScript'],
}

export default function FeedPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] animate-fade-in gap-6 p-6">
      {/* ── Main Feed Column ── */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Active Dev Rooms */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Active Dev Rooms</h2>
              <p className="mt-0.5 text-sm text-text-muted">Real-time pair programming</p>
            </div>
            <Link
              href="/rooms"
              className="flex items-center gap-1 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="stagger-children grid grid-cols-1 gap-4 lg:grid-cols-3">
            {activeRooms.map(room => (
              <Link
                key={room.id}
                href={`/rooms/${room.id}`}
                className="card group cursor-pointer p-4"
              >
                <div
                  className={`h-2 w-full rounded-full bg-gradient-to-r ${room.color} mb-4 opacity-60 transition-opacity group-hover:opacity-100`}
                />
                <h3 className="mb-1 text-[15px] font-semibold text-text-primary">{room.title}</h3>
                <p className="mb-3 font-mono text-sm text-xs text-text-muted">
                  {room.host} • {room.tech}
                </p>
                <div className="flex items-center justify-between">
                  <span className="live-badge">
                    <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-neon-cyan" />
                    LIVE
                  </span>
                  <span className="font-label text-xs text-text-muted">
                    {room.viewers} watching
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Community Feed */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Community Feed</h2>
          <div className="stagger-children space-y-4">
            {feedPosts.map(post => (
              <div key={post.id} className="card-static p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="gradient-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    {post.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{post.author}</span>
                      <span className="font-mono text-xs text-text-muted">{post.handle}</span>
                      <span className="text-xs text-text-muted">• {post.time}</span>
                    </div>
                  </div>
                </div>
                <p className="mb-4 pl-[52px] text-sm leading-relaxed text-text-secondary">
                  {post.content}
                </p>
                <div className="flex items-center gap-5 pl-[52px] text-text-muted">
                  <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-neon-pink">
                    <Heart className="h-3.5 w-3.5" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-brand-300">
                    <MessageSquare className="h-3.5 w-3.5" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-neon-cyan">
                    <Share2 className="h-3.5 w-3.5" /> {post.shares}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Project Card */}
          <div
            className="card-static mt-4 p-5"
            style={{ border: '1px solid rgba(194, 155, 255, 0.15)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="tag tag-primary text-[11px]">FEATURED PROJECT</span>
            </div>
            <h3 className="mb-2 font-display text-base font-bold">{featuredProject.title}</h3>
            <p className="mb-3 text-sm leading-relaxed text-text-secondary">
              {featuredProject.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredProject.tags.map(tag => (
                <span key={tag} className="tag tag-neutral text-[11px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Right Sidebar ── */}
      <aside className="hidden w-[320px] shrink-0 space-y-6 xl:block">
        {/* Trending Projects */}
        <section className="card-static p-5">
          <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
            <TrendingUp className="h-4 w-4 text-brand-300" />
            Trending Projects
          </h3>
          <div className="space-y-4">
            {trendingProjects.map(project => (
              <div key={project.id} className="group">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h4 className="cursor-pointer text-sm font-semibold text-text-primary transition-colors group-hover:text-brand-300">
                    {project.name}
                  </h4>
                  <span
                    className={`tag text-[10px] ${
                      project.color === 'brand'
                        ? 'tag-primary'
                        : project.color === 'cyan'
                          ? 'tag-secondary'
                          : 'tag-accent'
                    }`}
                  >
                    {project.version}
                  </span>
                </div>
                <p className="mb-2 text-xs leading-relaxed text-text-muted">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400" /> {project.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {project.forks}
                  </span>
                  <span className="ml-auto font-label font-semibold text-neon-cyan">
                    {project.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/projects"
            className="btn btn-ghost mt-4 flex w-full items-center justify-center gap-1.5 py-2 text-xs"
          >
            Explore All Projects <ExternalLink className="h-3 w-3" />
          </Link>
        </section>

        {/* Dev of the Week */}
        <section
          className="card-static p-5"
          style={{ border: '1px solid rgba(194, 155, 255, 0.1)' }}
        >
          <span className="section-label">Dev of the Week</span>
          <div className="mb-3 mt-2 flex items-center gap-3">
            <div className="gradient-brand-vivid flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-glow-brand">
              {devOfWeek.avatar}
            </div>
            <div>
              <h4 className="text-sm font-semibold">{devOfWeek.name}</h4>
              <p className="text-xs text-text-muted">{devOfWeek.title}</p>
            </div>
          </div>
          <blockquote className="border-l-2 border-brand-500/30 pl-3 text-sm italic leading-relaxed text-text-secondary">
            {devOfWeek.quote}
          </blockquote>
          <Link
            href="/devs/marcus"
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
          >
            View Portfolio <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </aside>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Eye, Clock, Shield, Hash, ArrowRight, Mic, Video, MonitorPlay } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dev Rooms',
  description:
    'Browse and join live developer rooms on Duwitch — real-time collaboration and knowledge sharing',
}

const featuredRoom = {
  id: 'featured-1',
  title: 'Building a High-Performance Neural Engine',
  host: 'alex_dev_master',
  verified: true,
  viewers: 342,
  tech: ['Rust', 'WASM', 'Neural'],
  duration: '2h 15m',
  description:
    'Live-coding a high-performance neural network inference engine optimized for WebAssembly. Join for deep systems programming discussion.',
}

const liveRooms = [
  {
    id: '1',
    title: 'Kubernetes Cluster Refactor',
    host: 'cloud_ops_pro',
    viewers: 156,
    tech: ['Kubernetes', 'Go', 'Docker'],
    duration: '1h 30m',
    hasVideo: true,
    hasAudio: true,
    hasScreen: true,
  },
  {
    id: '2',
    title: 'React 19 Server Components deep dive',
    host: 'sarah_codes',
    viewers: 214,
    tech: ['React', 'Next.js', 'TypeScript'],
    duration: '45m',
    hasVideo: true,
    hasAudio: true,
    hasScreen: false,
  },
  {
    id: '3',
    title: 'Tailwind v4 - First Impressions',
    host: 'adam_ui_ux',
    viewers: 98,
    tech: ['Tailwind', 'CSS', 'Design'],
    duration: '30m',
    hasVideo: false,
    hasAudio: true,
    hasScreen: true,
  },
  {
    id: '4',
    title: 'FastAPI + Postgres Real-time Sync',
    host: 'python_wizard',
    viewers: 127,
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    duration: '1h 10m',
    hasVideo: true,
    hasAudio: true,
    hasScreen: true,
  },
]

const tags = [
  { label: '#typescript', count: 342 },
  { label: '#kubernetes', count: 218 },
  { label: '#ai_agents', count: 456 },
  { label: '#web3', count: 189 },
  { label: '#docker', count: 267 },
  { label: '#rust_lang', count: 312 },
]

export default function RoomsPage() {
  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dev Rooms</h1>
          <p className="mt-1 text-sm text-text-muted">
            Real-time collaboration and knowledge sharing from top engineers.
          </p>
        </div>
        <button className="btn btn-primary">Create Room</button>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Featured Room */}
          <div
            className="card-static relative overflow-hidden rounded-2xl p-6"
            style={{
              background:
                'linear-gradient(135deg, rgba(160, 96, 255, 0.08), rgba(0, 244, 254, 0.04))',
              border: '1px solid rgba(194, 155, 255, 0.15)',
            }}
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="live-badge">
                  <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-neon-cyan" />
                  LIVE NOW
                </span>
                <span className="tag tag-primary text-[10px]">FEATURED</span>
              </div>
              <h2 className="mb-2 font-display text-xl font-bold">{featuredRoom.title}</h2>
              <p className="mb-4 max-w-xl text-sm text-text-secondary">
                {featuredRoom.description}
              </p>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="gradient-brand-vivid flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white">
                    AD
                  </div>
                  <span className="text-sm font-medium">{featuredRoom.host}</span>
                  {featuredRoom.verified && <Shield className="h-3.5 w-3.5 text-neon-cyan" />}
                </div>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Eye className="h-3 w-3" /> {featuredRoom.viewers}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="h-3 w-3" /> {featuredRoom.duration}
                </span>
              </div>
              <div className="mb-5 flex items-center gap-2">
                {featuredRoom.tech.map(t => (
                  <span key={t} className="tag tag-neutral text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
              <Link href={`/rooms/${featuredRoom.id}`} className="btn btn-primary">
                Join Room <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Live Rooms Grid */}
          <section>
            <h3 className="mb-4 font-display text-base font-semibold">All Live Rooms</h3>
            <div className="stagger-children grid grid-cols-1 gap-4 lg:grid-cols-2">
              {liveRooms.map(room => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="card group cursor-pointer p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-[15px] font-semibold text-text-primary transition-colors group-hover:text-brand-300">
                      {room.title}
                    </h4>
                    <span className="live-badge ml-2 shrink-0">
                      <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-neon-cyan" />
                      LIVE
                    </span>
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-bright text-[9px] font-bold text-text-secondary">
                      {room.host.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-mono text-xs text-text-muted">{room.host}</span>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {room.tech.map(t => (
                      <span key={t} className="tag tag-neutral py-0.5 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {room.viewers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {room.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.hasVideo && <Video className="h-3.5 w-3.5 text-neon-cyan" />}
                      {room.hasAudio && <Mic className="h-3.5 w-3.5 text-brand-300" />}
                      {room.hasScreen && <MonitorPlay className="h-3.5 w-3.5 text-neon-pink" />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar — Tags */}
        <aside className="hidden w-[260px] shrink-0 xl:block">
          <div className="card-static p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold">
              <Hash className="h-4 w-4 text-brand-300" />
              Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Link
                  key={tag.label}
                  href={`/rooms?tag=${tag.label.slice(1)}`}
                  className="tag tag-primary cursor-pointer text-[11px] transition-colors hover:bg-brand-500/20"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

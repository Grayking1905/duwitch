import Link from 'next/link'
import {
  ArrowRight,
  Code2,
  Globe,
  Layers,
  Radio,
  Rss,
  Users,
  Zap,
  Cpu,
  Shield,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-base text-text-primary">
      {/* ── Nav ── */}
      <header
        className="glass sticky top-0 z-50"
        style={{ borderBottom: '1px solid rgba(70, 71, 82, 0.1)' }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text font-display text-xl font-bold">Duwitch</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-text-secondary md:flex">
            <Link href="/projects" className="transition-colors hover:text-text-primary">
              Projects
            </Link>
            <Link
              href="/rooms"
              className="flex items-center gap-1.5 transition-colors hover:text-text-primary"
            >
              Rooms
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-neon-cyan" />
            </Link>
            <Link href="/news" className="transition-colors hover:text-text-primary">
              News
            </Link>
            <Link href="/devs" className="transition-colors hover:text-text-primary">
              Developers
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Sign in
            </Link>
            <Link href="/register" className="btn btn-primary py-2 text-sm">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-4 pb-32 pt-24 text-center sm:px-6">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-brand-500/8 h-[600px] w-[600px] rounded-full blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute left-1/4 top-20 h-[300px] w-[300px] rounded-full bg-neon-cyan/5 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-20 right-1/4 h-[250px] w-[250px] rounded-full bg-neon-pink/5 blur-[80px]" />

          <div className="relative mx-auto max-w-4xl animate-fade-in-up">
            <span
              className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-neon-cyan"
              style={{ border: '1px solid rgba(0, 244, 254, 0.2)' }}
            >
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-neon-cyan" />
              Now live — developer rooms open 24/7
            </span>
            <h1 className="mb-6 text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              Build <span className="gradient-text">without</span>{' '}
              <span className="gradient-text-secondary">boundaries</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-balance text-lg leading-relaxed text-text-secondary sm:text-xl">
              A global community where developers collaborate in real time, find freelance projects,
              share live work sessions, and stay on top of the latest dev news — no walls, no
              limits.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="gradient-brand glow-brand inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-surface-base transition-all hover:opacity-90"
              >
                Join Duwitch <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="glass inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all hover:bg-surface-bright/50"
                style={{ border: '1px solid rgba(70, 71, 82, 0.2)' }}
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section
          className="stagger-children mx-auto grid max-w-7xl gap-5 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-3"
          id="features"
        >
          {features.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </section>

        {/* ── Stats ── */}
        <section
          className="relative overflow-hidden py-20"
          style={{
            borderTop: '1px solid rgba(70, 71, 82, 0.1)',
            borderBottom: '1px solid rgba(70, 71, 82, 0.1)',
          }}
        >
          <div className="absolute inset-0 bg-surface-elevated" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`font-display text-4xl font-extrabold ${
                    i % 3 === 0
                      ? 'gradient-text'
                      : i % 3 === 1
                        ? 'gradient-text-secondary'
                        : 'gradient-text-accent'
                  }`}
                >
                  {s.value}
                </div>
                <div className="mt-2 font-label text-sm text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Showcase ── */}
        <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Built for <span className="gradient-text">serious</span> developers
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-text-secondary">
            Every feature is designed for speed, productivity, and the kind of developer experience
            you&apos;d build yourself.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {techCards.map(card => (
              <div
                key={card.title}
                className="card-static p-6 text-left"
                style={{ border: `1px solid ${card.borderColor}` }}
              >
                <div
                  className={`h-10 w-10 rounded-lg ${card.bg} mb-4 flex items-center justify-center`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <h3 className="mb-2 font-display text-base font-bold">{card.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-10" style={{ borderTop: '1px solid rgba(70, 71, 82, 0.1)' }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-text-muted sm:px-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="gradient-brand flex h-6 w-6 items-center justify-center rounded-md">
              <Code2 className="h-3 w-3 text-white" />
            </div>
            <span className="gradient-text font-display font-bold">Duwitch</span>
          </div>
          <span>© {new Date().getFullYear()} Duwitch. Build without boundaries.</span>
          <div className="flex gap-6 font-label">
            <Link href="/privacy" className="transition-colors hover:text-text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-text-primary">
              Terms
            </Link>
            <Link
              href="https://github.com/duwitch"
              className="transition-colors hover:text-text-primary"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accentColor,
}: {
  icon: React.ElementType
  title: string
  description: string
  accentColor: string
}) {
  return (
    <div
      className="card-static group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-surface-bright/50"
      style={{ border: '1px solid rgba(70, 71, 82, 0.1)' }}
    >
      <div
        className={`h-11 w-11 rounded-xl ${accentColor} mb-4 flex items-center justify-center shadow-lg transition-all group-hover:shadow-glow-brand`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
  )
}

const features = [
  {
    icon: Radio,
    title: 'Live Rooms',
    description:
      'Join Discord-like rooms with video, audio, screen-share, and collaborative code editing in real time.',
    accentColor: 'gradient-secondary',
  },
  {
    icon: Layers,
    title: 'Projects Marketplace',
    description:
      'Browse open projects, apply for roles, submit proposals, and contribute to real-world software.',
    accentColor: 'gradient-brand',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description:
      'Connect with developers worldwide — no barriers, no boundaries. Collaborate across time zones.',
    accentColor: 'gradient-accent',
  },
  {
    icon: Rss,
    title: 'Dev News',
    description:
      'Stay up to date with curated RSS feeds and community-submitted articles filtered by your tech tags.',
    accentColor: 'gradient-brand-vivid',
  },
  {
    icon: Users,
    title: 'Developer Profiles',
    description:
      'Showcase your skills, GitHub portfolio, and availability. Build your reputation with XP.',
    accentColor: 'gradient-secondary',
  },
  {
    icon: Code2,
    title: 'Code Share',
    description:
      'Write and share code live in rooms using a VS Code-powered editor with real-time sync.',
    accentColor: 'gradient-accent',
  },
]

const stats = [
  { value: '10K+', label: 'Developers' },
  { value: '500+', label: 'Open Projects' },
  { value: '200+', label: 'Live Rooms' },
  { value: '50K+', label: 'Articles' },
]

const techCards = [
  {
    icon: Zap,
    title: 'Sub-10ms Latency',
    description: 'Real-time WebSocket connections powered by edge computing. No lag, no buffering.',
    bg: 'bg-neon-cyan/10',
    iconColor: 'text-neon-cyan',
    borderColor: 'rgba(0, 244, 254, 0.1)',
  },
  {
    icon: Shield,
    title: 'End-to-End Encrypted',
    description:
      'Every workspace, every message, every line of code — secured with military-grade encryption.',
    bg: 'bg-brand-500/10',
    iconColor: 'text-brand-300',
    borderColor: 'rgba(194, 155, 255, 0.1)',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Matching',
    description:
      'Our algorithm matches you with projects and developers based on your skills and interests.',
    bg: 'bg-neon-pink/10',
    iconColor: 'text-neon-pink',
    borderColor: 'rgba(255, 107, 155, 0.1)',
  },
]

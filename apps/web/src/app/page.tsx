import Link from 'next/link'
import { ArrowRight, Code2, Globe, Layers, Radio, Rss, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="gradient-text">Duwitch</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <Link href="/projects" className="hover:text-[var(--text-primary)] transition-colors">Projects</Link>
            <Link href="/rooms"    className="hover:text-[var(--text-primary)] transition-colors">Rooms</Link>
            <Link href="/news"     className="hover:text-[var(--text-primary)] transition-colors">News</Link>
            <Link href="/devs"     className="hover:text-[var(--text-primary)] transition-colors">Developers</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white gradient-brand hover:opacity-90 transition-opacity glow-brand"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-4 sm:px-6 pt-24 pb-32 text-center">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-semibold glass text-brand-400 border border-brand-500/30">
              <Radio className="w-3 h-3" />
              Now live — developer rooms open 24/7
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-balance mb-6 leading-[1.05]">
              Build <span className="gradient-text">without</span>{' '}
              boundaries
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 text-balance">
              A global community where developers collaborate in real time, find freelance projects, share
              live work sessions, and stay on top of the latest dev news — no walls, no limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white gradient-brand hover:opacity-90 transition-all glow-brand"
              >
                Join Duwitch <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold glass hover:border-brand-500/40 transition-all"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="features">
          {features.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </section>

        {/* ── Stats ── */}
        <section className="glass border-y border-[var(--border)] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <span className="font-bold text-base gradient-text">Duwitch</span>
          <span>© {new Date().getFullYear()} Duwitch. Build without boundaries.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-[var(--text-primary)] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: {
  icon: React.ElementType; title: string; description: string
}) {
  return (
    <div className="group p-6 rounded-2xl glass border border-[var(--border)] hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center mb-4 shadow-lg group-hover:glow-brand transition-all">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  )
}

const features = [
  {
    icon: Radio,
    title: 'Live Rooms',
    description: 'Join Discord-like rooms with video, audio, screen-share, and collaborative code editing in real time.',
  },
  {
    icon: Layers,
    title: 'Projects Marketplace',
    description: 'Browse open projects, apply for roles, submit proposals, and contribute to real-world software.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connect with developers worldwide — no barriers, no boundaries. Collaborate across time zones.',
  },
  {
    icon: Rss,
    title: 'Dev News',
    description: 'Stay up to date with curated RSS feeds and community-submitted articles filtered by your tech tags.',
  },
  {
    icon: Users,
    title: 'Developer Profiles',
    description: 'Showcase your skills, GitHub portfolio, and availability. Build your reputation with XP.',
  },
  {
    icon: Code2,
    title: 'Code Share',
    description: 'Write and share code live in rooms using a VS Code-powered editor with real-time sync.',
  },
]

const stats = [
  { value: '10K+', label: 'Developers' },
  { value: '500+', label: 'Open Projects' },
  { value: '200+', label: 'Live Rooms' },
  { value: '50K+', label: 'Articles' },
]

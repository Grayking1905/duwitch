import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Github,
  Mail,
  Globe,
  MapPin,
  Calendar,
  GitPullRequest,
  Bug,
  Folder,
  Twitter,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Developer Profile',
  description: 'Developer profile on Duwitch — portfolio, projects, and contributions',
}

const profile = {
  name: 'Alex Rivera',
  handle: '@rivera_ops',
  avatar: 'AR',
  title: 'Full-Stack Architect & Web3 Specialist',
  bio: 'Building high-performance decentralized applications and cloud-native architectures. Focused on the intersection of user experience and developer productivity. Currently leading core infrastructure at Duwitch Labs.',
  location: 'San Francisco, CA',
  joined: 'March 2024',
  stats: {
    projects: 24,
    contributions: 1420,
    streak: '342 days',
    reputation: 9847,
  },
  skills: ['TypeScript', 'Rust', 'Go', 'React', 'Next.js', 'Web3', 'Kubernetes', 'PostgreSQL'],
  socials: {
    github: 'github.com/rivera_ops',
    twitter: '@rivera_ops',
    website: 'rivera.dev',
  },
}

const activeProjects = [
  {
    id: '1',
    name: 'Nebula CI/CD',
    role: 'Lead Maintainer',
    description:
      'A serverless CI/CD pipeline engine built for massive scale, featuring instant cold starts and distributed caching across 42 edge regions.',
    tech: ['Rust', 'WASM', 'Edge'],
    stars: '4.2k',
  },
  {
    id: '2',
    name: 'Synthetix SDK',
    role: 'Core Contributor',
    description:
      'Next-generation SDK for synthetic asset management on Ethereum L2s, optimized for gas efficiency and developer experience.',
    tech: ['TypeScript', 'Solidity', 'Ethers.js'],
    stars: '2.1k',
  },
]

const contributions = [
  {
    id: '1',
    type: 'pr',
    icon: GitPullRequest,
    title: 'Merged PR #492 in duwitch/core-engine',
    description: 'Refactored the workspace socket layer to handle 10k concurrent streams.',
    time: '2 days ago',
    color: 'text-neon-cyan',
  },
  {
    id: '2',
    type: 'project',
    icon: Folder,
    title: 'Created new project rivera/quantum-mesh',
    description: 'Initial commit for the distributed state reconciliation library.',
    time: '5 days ago',
    color: 'text-brand-300',
  },
  {
    id: '3',
    type: 'bug',
    icon: Bug,
    title: 'Bug Squash in open-source/ui-kit',
    description: 'Fixed critical accessibility flaw in dropdown component for screen readers.',
    time: '1 week ago',
    color: 'text-neon-pink',
  },
]

export default function DevsPage() {
  return (
    <div className="mx-auto max-w-[1100px] animate-fade-in p-6">
      {/* Profile Header */}
      <div className="card-static relative mb-6 overflow-hidden p-6">
        {/* Ambient gradient */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="bg-neon-cyan/3 pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="gradient-brand-vivid flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-glow-brand">
            {profile.avatar}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold">{profile.name}</h1>
              <span className="font-mono text-sm text-text-muted">{profile.handle}</span>
            </div>
            <p className="mb-3 text-sm font-medium text-brand-300">{profile.title}</p>
            <p className="mb-4 max-w-xl text-sm leading-relaxed text-text-secondary">
              {profile.bio}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Joined {profile.joined}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button className="btn btn-primary text-sm">Follow</button>
            <button className="btn btn-ghost text-sm">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          className="relative mt-6 grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4"
          style={{ borderTop: '1px solid rgba(70, 71, 82, 0.15)' }}
        >
          <div>
            <div className="gradient-text font-display text-2xl font-bold">
              {profile.stats.projects}
            </div>
            <div className="mt-0.5 font-label text-xs text-text-muted">Projects</div>
          </div>
          <div>
            <div className="gradient-text-secondary font-display text-2xl font-bold">
              {profile.stats.contributions}
            </div>
            <div className="mt-0.5 font-label text-xs text-text-muted">Contributions</div>
          </div>
          <div>
            <div className="gradient-text-accent font-display text-2xl font-bold">
              {profile.stats.streak}
            </div>
            <div className="mt-0.5 font-label text-xs text-text-muted">Current Streak</div>
          </div>
          <div>
            <div className="gradient-text font-display text-2xl font-bold">
              {profile.stats.reputation.toLocaleString()}
            </div>
            <div className="mt-0.5 font-label text-xs text-text-muted">Reputation XP</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Active Projects */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Active Projects on Duwitch</h2>
              <Link
                href="/devs/me/projects"
                className="flex items-center gap-1 text-xs font-medium text-brand-300 transition-colors hover:text-brand-200"
              >
                View all project history <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="stagger-children space-y-4">
              {activeProjects.map(project => (
                <div key={project.id} className="card group cursor-pointer p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-semibold transition-colors group-hover:text-brand-300">
                        {project.name}
                      </h3>
                      <span className="tag tag-primary mt-1 text-[10px]">{project.role}</span>
                    </div>
                    <span className="flex items-center gap-1 font-label text-xs text-text-muted">
                      ⭐ {project.stars}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>
                  <div className="flex gap-1.5">
                    {project.tech.map(t => (
                      <span key={t} className="tag tag-neutral text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Contributions */}
          <section>
            <h2 className="mb-4 font-display text-lg font-bold">Latest Contributions</h2>
            <div className="stagger-children space-y-3">
              {contributions.map(contrib => (
                <div key={contrib.id} className="card-static flex items-start gap-3 p-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-bright ${contrib.color}`}
                  >
                    <contrib.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-0.5 text-sm font-semibold">{contrib.title}</h4>
                    <p className="text-xs leading-relaxed text-text-muted">{contrib.description}</p>
                  </div>
                  <span className="shrink-0 font-label text-xs text-text-muted">
                    {contrib.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden w-[260px] shrink-0 space-y-5 lg:block">
          {/* Skills */}
          <div className="card-static p-5">
            <span className="section-label">Tech Stack</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="tag tag-primary text-[11px]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="card-static p-5">
            <span className="section-label">Connect</span>
            <div className="mt-3 space-y-2.5">
              <a
                href="#"
                className="flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <Github className="h-4 w-4" /> {profile.socials.github}
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <Twitter className="h-4 w-4" /> {profile.socials.twitter}
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <Globe className="h-4 w-4" /> {profile.socials.website}
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="card-static p-5" style={{ border: '1px solid rgba(194, 155, 255, 0.1)' }}>
            <h3 className="mb-2 font-display text-sm font-semibold">Let&apos;s Build Together</h3>
            <p className="mb-3 text-xs leading-relaxed text-text-muted">
              I&apos;m currently open to freelance opportunities and collaborative open-source
              projects.
            </p>
            <button className="btn btn-primary w-full text-sm">
              <Mail className="h-4 w-4" /> Send Message
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

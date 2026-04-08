import type { Metadata } from 'next'
import {
  Filter,
  Lock,
  DollarSign,
  GitBranch,
  Zap,
  Crown,
  Star,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Projects Marketplace',
  description:
    'Discover high-impact engineering projects on Duwitch — join as a contributor, freelance architect, or maintainer',
}

const projects = [
  {
    id: '1',
    title: 'NeuralLink UI Framework',
    type: 'PAID FREELANCE',
    typeColor: 'accent',
    description:
      'Building a low-latency visualization engine for neural telemetry. Need React/Three.js expertise to render real-time node signals.',
    tags: ['React', 'Three.js', 'WebGL', 'Neural'],
    budget: '$8,000 - $15,000',
    applicants: 12,
    difficulty: 'Senior',
  },
  {
    id: '2',
    title: 'Synapse DB Core',
    type: 'OPEN SOURCE',
    typeColor: 'cyan',
    description:
      'A distributed graph database written in Go. Seeking contributors for the consensus layer optimization and Raft implementation.',
    tags: ['Go', 'Distributed Systems', 'Raft', 'gRPC'],
    stars: '2.4k',
    forks: 189,
    difficulty: 'Advanced',
  },
  {
    id: '3',
    title: 'Quantum-Safe Encryption API',
    type: 'CONTRACT',
    typeColor: 'brand',
    description:
      'We are scaling our post-quantum cryptography suite. Seeking Senior Security Engineers to audit our TLS 1.3 implementation and PQC algorithm integration.',
    tags: ['Cryptography', 'TLS', 'Rust', 'Security'],
    budget: '$20,000+',
    applicants: 6,
    difficulty: 'Expert',
    isEncrypted: true,
  },
  {
    id: '4',
    title: 'GreenOps Analytics',
    type: 'OPEN SOURCE',
    typeColor: 'cyan',
    description:
      'A dashboard for monitoring cloud carbon footprint. Integration needed for AWS Cost Explorer and Google Cloud carbon-footprint APIs.',
    tags: ['React', 'AWS', 'GCP', 'Analytics'],
    stars: '890',
    forks: 67,
    difficulty: 'Intermediate',
  },
]

const filterOptions = ['All', 'Open Source', 'Freelance', 'Contract', 'Bounties']

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-3 font-display text-3xl font-bold">Project Marketplace</h1>
        <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
          Discover high-impact engineering projects. Join as a technical contributor, freelance
          architect, or open-source maintainer. Level up your stack by collaborating with senior
          devs globally.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Filters */}
          <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 shrink-0 text-text-muted" />
            {filterOptions.map((filter, i) => (
              <button
                key={filter}
                className={`tag shrink-0 text-[12px] transition-all ${
                  i === 0 ? 'bg-brand-500/15 text-brand-300' : 'tag-neutral hover:bg-surface-bright'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Project Cards */}
          <div className="stagger-children space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="card group cursor-pointer p-6"
                style={
                  project.isEncrypted ? { border: '1px solid rgba(194, 155, 255, 0.1)' } : undefined
                }
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-lg font-bold transition-colors group-hover:text-brand-300">
                        {project.title}
                      </h3>
                      <span
                        className={`tag font-label text-[10px] ${
                          project.typeColor === 'accent'
                            ? 'tag-accent'
                            : project.typeColor === 'cyan'
                              ? 'tag-secondary'
                              : 'tag-primary'
                        }`}
                      >
                        {project.type}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {project.description}
                    </p>
                  </div>
                  {project.isEncrypted && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10">
                      <Lock className="h-4 w-4 text-brand-300" />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag tag-neutral py-0.5 text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 font-label text-xs text-text-muted">
                    {project.budget && (
                      <span className="flex items-center gap-1 font-semibold text-neon-cyan">
                        <DollarSign className="h-3 w-3" /> {project.budget}
                      </span>
                    )}
                    {project.stars && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400" /> {project.stars}
                      </span>
                    )}
                    {project.forks !== undefined && (
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" /> {project.forks} forks
                      </span>
                    )}
                    {project.applicants !== undefined && (
                      <span className="flex items-center gap-1">
                        {project.applicants} applicants
                      </span>
                    )}
                  </div>
                  <span
                    className={`tag text-[10px] ${
                      project.difficulty === 'Expert'
                        ? 'tag-accent'
                        : project.difficulty === 'Senior' || project.difficulty === 'Advanced'
                          ? 'tag-primary'
                          : 'tag-neutral'
                    }`}
                  >
                    {project.difficulty}
                  </span>
                </div>

                {project.isEncrypted && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                    <Lock className="h-3 w-3" />
                    <span className="font-label">Encrypted Workspace Access Only</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — Premium */}
        <aside className="hidden w-[300px] shrink-0 space-y-5 xl:block">
          <div
            className="card-static relative overflow-hidden p-5"
            style={{
              background:
                'linear-gradient(135deg, rgba(160, 96, 255, 0.08), rgba(255, 107, 155, 0.04))',
              border: '1px solid rgba(194, 155, 255, 0.12)',
            }}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                <h3 className="font-display text-sm font-bold">Premium Access</h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                Get early access to verified freelance contracts from Tier-1 startups.
              </p>
              <button className="btn btn-primary w-full text-sm">
                Upgrade <Zap className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-static p-5">
            <span className="section-label">Marketplace Stats</span>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Open Projects</span>
                <span className="gradient-text font-display text-lg font-bold">547</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active Freelancers</span>
                <span className="gradient-text-secondary font-display text-lg font-bold">1.2k</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total Bounties</span>
                <span className="gradient-text-accent font-display text-lg font-bold">$84k</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

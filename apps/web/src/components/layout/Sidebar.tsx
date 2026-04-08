'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Code2,
  Layers,
  Radio,
  Rss,
  Users,
  LayoutDashboard,
  Plus,
  Settings,
  Terminal,
  Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feed', label: 'Home', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: Layers },
  { href: '/rooms', label: 'Rooms', icon: Radio },
  { href: '/news', label: 'News', icon: Rss },
  { href: '/devs', label: 'Developers', icon: Users },
  { href: '/freelance', label: 'Freelance', icon: Briefcase },
]

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/terminal', label: 'Terminal', icon: Terminal },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden h-full w-[220px] shrink-0 flex-col bg-surface-elevated md:flex">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg">
          <Code2 className="h-4 w-4 text-white" />
        </div>
        <span className="gradient-text font-display text-lg font-bold tracking-tight">Duwitch</span>
      </div>

      {/* Online Count */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 font-label text-xs text-text-muted">
          <span className="h-2 w-2 animate-live-pulse rounded-full bg-neon-cyan shadow-glow-cyan" />
          <span className="font-semibold text-neon-cyan">42</span>
          <span>Active Devs Online</span>
        </div>
      </div>

      {/* Create Button */}
      <div className="px-4 pb-3">
        <button
          className="gradient-brand glow-brand flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-surface-base transition-all hover:opacity-90"
          aria-label="Create new room or project"
        >
          <Plus className="h-4 w-4" />
          Create
        </button>
      </div>

      {/* Nav */}
      <nav
        className="no-scrollbar flex-1 overflow-y-auto px-3 py-2"
        role="navigation"
        aria-label="Main navigation"
      >
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  id={`nav-${label.toLowerCase()}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-brand-500/15 text-brand-300'
                      : 'text-text-secondary hover:bg-surface-bright/50 hover:text-text-primary'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-brand-300')} />
                  {label}
                  {label === 'Rooms' && (
                    <span className="live-badge ml-auto">
                      <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-neon-cyan" />
                      LIVE
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Nav */}
      <div className="shrink-0 px-3 py-3" style={{ borderTop: '1px solid rgba(70, 71, 82, 0.15)' }}>
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-brand-500/15 text-brand-300'
                  : 'text-text-secondary hover:bg-surface-bright/50 hover:text-text-primary'
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

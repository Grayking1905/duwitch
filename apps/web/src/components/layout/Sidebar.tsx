'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Code2,
  Layers,
  MessageSquare,
  Radio,
  Rss,
  Users,
  LayoutDashboard,
  Plus,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feed',     label: 'Feed',       icon: LayoutDashboard },
  { href: '/rooms',    label: 'Rooms',      icon: Radio },
  { href: '/projects', label: 'Projects',   icon: Layers },
  { href: '/news',     label: 'News',       icon: Rss },
  { href: '/devs',     label: 'Developers', icon: Users },
  { href: '/messages', label: 'Messages',   icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-[var(--border)] shrink-0">
        <Code2 className="w-6 h-6 text-brand-400" />
        <span className="font-bold text-lg gradient-text">Duwitch</span>
      </div>

      {/* Quick Action */}
      <div className="px-3 pt-4 pb-2">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand hover:opacity-90 transition-opacity"
          aria-label="Create new room or project"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto no-scrollbar" role="navigation" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  id={`nav-${label.toLowerCase()}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-brand-500/15 text-brand-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', active && 'text-brand-400')} />
                  {label}
                  {label === 'Rooms' && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-md text-xs font-bold bg-green-500/15 text-green-400 live-dot">
                      24
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--border)] shrink-0">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-all"
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  )
}

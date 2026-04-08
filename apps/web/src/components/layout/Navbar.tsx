'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/feed', label: 'Feed' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/projects', label: 'Marketplace' },
  { href: '/news', label: 'Articles' },
]

export function Navbar() {
  const pathname = usePathname()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      className="z-30 flex h-14 shrink-0 items-center gap-4 bg-surface-base px-4 sm:px-6"
      style={{ borderBottom: '1px solid rgba(70, 71, 82, 0.1)' }}
    >
      {/* Mobile menu trigger */}
      <button
        id="mobile-menu-trigger"
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-bright/50 md:hidden"
        aria-label="Open mobile menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo for mobile */}
      <span className="gradient-text font-display text-lg font-bold md:hidden">Duwitch</span>

      {/* Tab Navigation */}
      <nav className="hidden items-center gap-1 md:flex">
        {tabs.map(tab => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-surface-bright text-text-primary'
                  : 'text-text-muted hover:bg-surface-card/50 hover:text-text-secondary'
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className={cn('w-64 transition-all duration-300', searchFocused && 'w-80')}>
        <label htmlFor="global-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="global-search"
            type="search"
            placeholder="Search devs, projects, rooms…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="input-field !bg-surface-deepest py-2 pl-9 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-bright/50"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-pink"
            aria-hidden="true"
          />
        </button>

        {/* Avatar */}
        <Link
          href="/devs/me"
          id="user-avatar-btn"
          className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-glow-brand transition-opacity hover:opacity-90"
          aria-label="Your profile"
        >
          AR
        </Link>
      </div>
    </header>
  )
}

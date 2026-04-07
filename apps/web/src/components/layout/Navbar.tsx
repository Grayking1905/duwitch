'use client'

import Link from 'next/link'
import { Bell, Menu, Search } from 'lucide-react'

export function Navbar() {
  return (
    <header className="h-16 shrink-0 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center px-4 sm:px-6 gap-4 z-30">
      {/* Mobile menu trigger */}
      <button
        id="mobile-menu-trigger"
        className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
        aria-label="Open mobile menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <label htmlFor="global-search" className="sr-only">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            id="global-search"
            type="search"
            placeholder="Search devs, projects, news…"
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" aria-hidden="true" />
        </button>

        {/* Avatar */}
        <Link
          href="/devs/me"
          id="user-avatar-btn"
          className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
          aria-label="Your profile"
        >
          U
        </Link>
      </div>
    </header>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rooms',
  description: 'Browse and join live developer rooms on Duwitch',
}

export default function RoomsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Rooms</h1>
      <p className="text-[var(--text-secondary)]">Active developer rooms will appear here.</p>
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Direct messages on Duwitch',
}

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <p className="text-[var(--text-secondary)]">Your conversations will appear here.</p>
    </div>
  )
}

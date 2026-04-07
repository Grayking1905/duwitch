import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feed',
  description: 'Your personalized developer activity feed on Duwitch',
}

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Feed</h1>
      <p className="text-[var(--text-secondary)]">Your personalized developer feed will appear here.</p>
    </div>
  )
}

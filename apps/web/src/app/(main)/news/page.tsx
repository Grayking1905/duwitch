import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest developer news, articles, and tutorials on Duwitch',
}

export default function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dev News</h1>
      <p className="text-[var(--text-secondary)]">Curated articles and community posts will appear here.</p>
    </div>
  )
}

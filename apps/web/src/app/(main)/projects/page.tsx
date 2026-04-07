import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse open source and freelance projects on Duwitch',
}

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Projects Marketplace</h1>
      <p className="text-[var(--text-secondary)]">Open projects and freelance opportunities will appear here.</p>
    </div>
  )
}

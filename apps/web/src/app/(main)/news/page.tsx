import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Bookmark,
  Clock,
  Eye,
  MessageSquare,
  TrendingUp,
  Zap,
  Rss,
  ArrowRight,
  Hash,
  Mail,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'News & Articles',
  description:
    'Latest developer news, articles, and tutorials on Duwitch — curated tech content from the community',
}

const navTabs = [
  { label: 'Articles', active: true, icon: '📝' },
  { label: 'News', active: false, icon: '📰' },
  { label: 'Tutorials', active: false, icon: '🎓' },
]

const sidebarNav = [
  { label: 'Feed', icon: Rss },
  { label: 'Trending', icon: TrendingUp },
  { label: 'Bookmarks', icon: Bookmark },
]

const featuredArticle = {
  id: '1',
  title: 'React 19: The Complete Deep Dive',
  description:
    "Deep diving into the most transformative update to the React ecosystem in years. From Server Actions to automatic ref-forwarding, here's everything you need to know.",
  author: 'Sarah Chen',
  avatar: 'SC',
  readTime: '12 min',
  views: '24k',
  tags: ['React', 'TypeScript', 'Next.js'],
  date: 'Dec 15',
}

const articles = [
  {
    id: '2',
    title: 'The Autonomous Pipeline: How AI is Redefining DevOps in 2024',
    description:
      'Moving beyond Copilot. How generative agents are starting to manage infrastructure as code and self-healing deployments.',
    readTime: '8 min',
    views: '18k',
    tag: 'AI/ML',
  },
  {
    id: '3',
    title: 'Rust vs Go: Memory Safety vs Developer Velocity',
    description:
      'Benchmarking the two modern titans of backend engineering. When to choose the borrow checker and when to rely on the garbage collector.',
    readTime: '10 min',
    views: '15k',
    tag: 'Systems',
  },
  {
    id: '4',
    title: 'Edge Computing: Bringing the Cloud to the Doorstep',
    description:
      "Latency-critical applications are moving to the edge. Exploring Vercel's new global middleware capabilities.",
    readTime: '6 min',
    views: '9.2k',
    tag: 'Cloud',
  },
]

const hotDiscussions = [
  {
    id: '1',
    title: 'Is Tailwind CSS making our designs too uniform?',
    comments: 245,
    views: '12k',
  },
  {
    id: '2',
    title: 'Why TypeScript 5.4 is a game changer for generics',
    comments: 180,
    views: '8.5k',
  },
  {
    id: '3',
    title: 'The death of the Junior Developer? AI reality check',
    comments: 412,
    views: '15k',
  },
]

const trendingTags = [
  '#typescript',
  '#web3',
  '#cloud',
  '#react',
  '#serverless',
  '#cybersecurity',
  '#career',
]

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in p-6">
      <div className="flex gap-6">
        {/* Left Sidebar Nav */}
        <aside className="hidden w-[200px] shrink-0 lg:block">
          <div className="sticky top-6">
            <span className="section-label px-2">Synth-Grid Editorial</span>
            <nav className="mt-3 space-y-0.5">
              {sidebarNav.map((item, i) => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    i === 0
                      ? 'bg-brand-500/15 text-brand-300'
                      : 'text-text-secondary hover:bg-surface-bright/50 hover:text-text-primary'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Tab Navigation */}
          <div className="mb-6 flex items-center gap-1">
            {navTabs.map(tab => (
              <button
                key={tab.label}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab.active
                    ? 'bg-surface-bright text-text-primary'
                    : 'text-text-muted hover:bg-surface-card/50 hover:text-text-secondary'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Featured Article */}
          <Link href={`/news/${featuredArticle.id}`} className="mb-6 block">
            <div
              className="group relative cursor-pointer overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-glow-brand"
              style={{
                background:
                  'linear-gradient(135deg, rgba(160, 96, 255, 0.08), rgba(0, 244, 254, 0.03))',
                border: '1px solid rgba(194, 155, 255, 0.12)',
              }}
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/5 blur-3xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <span className="tag tag-primary text-[10px]">FEATURED</span>
                  <span className="font-label text-xs text-text-muted">{featuredArticle.date}</span>
                </div>
                <h2 className="mb-3 font-display text-2xl font-bold transition-colors group-hover:text-brand-300">
                  {featuredArticle.title}
                </h2>
                <p className="mb-4 max-w-xl text-sm leading-relaxed text-text-secondary">
                  {featuredArticle.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="gradient-brand flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white">
                      {featuredArticle.avatar}
                    </div>
                    <span className="text-xs font-medium">{featuredArticle.author}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" /> {featuredArticle.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Eye className="h-3 w-3" /> {featuredArticle.views}
                  </span>
                </div>
                <div className="mt-4 flex gap-1.5">
                  {featuredArticle.tags.map(tag => (
                    <span key={tag} className="tag tag-neutral text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Latest Intel */}
          <section className="mb-8">
            <h3 className="mb-4 font-display text-base font-bold">Latest Intel</h3>
            <div className="stagger-children space-y-3">
              {articles.map(article => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="card group flex cursor-pointer items-start gap-4 p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="tag tag-neutral py-0.5 text-[10px]">{article.tag}</span>
                    </div>
                    <h4 className="mb-1.5 text-[15px] font-semibold text-text-primary transition-colors group-hover:text-brand-300">
                      {article.title}
                    </h4>
                    <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 font-label text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {article.views}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden w-[280px] shrink-0 space-y-5 xl:block">
          {/* Hot Discussions */}
          <div className="card-static p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold">
              <Zap className="h-4 w-4 text-amber-400" />
              Hot Discussions
            </h3>
            <div className="space-y-3">
              {hotDiscussions.map(disc => (
                <Link key={disc.id} href={`/news/discussions/${disc.id}`} className="group block">
                  <h4 className="mb-1 text-sm font-medium leading-tight transition-colors group-hover:text-brand-300">
                    {disc.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> {disc.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {disc.views}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="card-static p-5" style={{ border: '1px solid rgba(0, 244, 254, 0.1)' }}>
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-neon-cyan" />
              <h3 className="font-display text-sm font-semibold">Synth-Weekly</h3>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-text-muted">
              Get the best of Duwitch delivered to your terminal every Monday morning. Zero spam.
              Pure signal.
            </p>
            <div className="flex gap-2">
              <input type="email" placeholder="email@dev.io" className="input-field py-2 text-xs" />
              <button className="btn btn-primary shrink-0 px-3 py-2 text-xs">
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="card-static p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold">
              <Hash className="h-4 w-4 text-brand-300" />
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(tag => (
                <span
                  key={tag}
                  className="tag tag-primary cursor-pointer text-[11px] transition-colors hover:bg-brand-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

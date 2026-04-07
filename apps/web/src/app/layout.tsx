import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from '@/components/providers/QueryProvider'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Duwitch — Build without boundaries',
    template: '%s | Duwitch',
  },
  description:
    'A global developer community for real-time collaboration, freelance projects, live rooms, and the latest dev news. Connect with developers worldwide.',
  keywords: ['developer community', 'collaboration', 'freelance', 'coding', 'open source', 'rooms', 'projects'],
  authors: [{ name: 'Duwitch Team' }],
  creator: 'Duwitch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://duwitch.dev',
    siteName: 'Duwitch',
    title: 'Duwitch — Build without boundaries',
    description: 'A global developer community for real-time collaboration and freelance projects.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duwitch — Build without boundaries',
    description: 'A global developer community for real-time collaboration and freelance projects.',
    creator: '@duwitch',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fc' },
    { media: '(prefers-color-scheme: dark)',  color: '#0d1117' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

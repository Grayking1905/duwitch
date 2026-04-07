import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@duwitch/ui', '@duwitch/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'media.duwitch.dev' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['socket.io-client'],
  },
}

export default nextConfig

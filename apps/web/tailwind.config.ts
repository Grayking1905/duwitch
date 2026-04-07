import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50:  'hsl(220 100% 97%)',
          100: 'hsl(220 96% 93%)',
          200: 'hsl(220 94% 85%)',
          300: 'hsl(220 90% 74%)',
          400: 'hsl(220 82% 62%)',
          500: 'hsl(220 72% 50%)',
          600: 'hsl(220 76% 42%)',
          700: 'hsl(220 80% 34%)',
          800: 'hsl(220 82% 26%)',
          900: 'hsl(220 84% 18%)',
          950: 'hsl(220 88% 10%)',
        },
        purple: {
          500: 'hsl(262 72% 58%)',
        },
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'live-pulse': 'livePulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

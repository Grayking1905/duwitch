import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        label: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#d4c4ff',
          300: '#c29bff',
          400: '#b789ff',
          500: '#A060FF',
          600: '#904fee',
          700: '#7934d6',
          800: '#6B21A8',
          900: '#400084',
          950: '#310068',
        },
        neon: {
          cyan: '#00f4fe',
          'cyan-dim': '#00e5ee',
          pink: '#ff6b9b',
          'pink-dim': '#e30071',
        },
        surface: {
          base: '#0c0e17',
          elevated: '#11131d',
          card: '#171924',
          bright: '#282b3a',
          deepest: '#000000',
          highest: '#222532',
        },
        text: {
          primary: '#f0f0fd',
          secondary: '#aaaab7',
          muted: '#737580',
        },
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'live-pulse': 'livePulse 1.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        livePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        shimmer: {
          to: { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'glow-brand': '0 0 15px rgba(194, 155, 255, 0.2), 0 0 30px rgba(160, 96, 255, 0.1)',
        'glow-cyan': '0 0 15px rgba(0, 244, 254, 0.2), 0 0 30px rgba(0, 244, 254, 0.08)',
        'glow-pink': '0 0 15px rgba(255, 107, 155, 0.2), 0 0 30px rgba(255, 107, 155, 0.08)',
        float: '0px 20px 40px rgba(0, 0, 0, 0.4)',
        soft: '0px 8px 24px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config

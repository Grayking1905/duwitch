/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'hsl(220 100% 97%)',
          100: 'hsl(220 95% 92%)',
          200: 'hsl(220 90% 83%)',
          300: 'hsl(220 84% 72%)',
          400: 'hsl(220 78% 60%)',
          500: 'hsl(220 72% 50%)',
          600: 'hsl(220 76% 42%)',
          700: 'hsl(220 80% 34%)',
          800: 'hsl(220 82% 26%)',
          900: 'hsl(220 84% 18%)',
          950: 'hsl(220 88% 10%)',
        },
        surface: {
          50:  'hsl(222 24% 98%)',
          100: 'hsl(222 20% 94%)',
          200: 'hsl(222 18% 87%)',
          700: 'hsl(222 22% 20%)',
          800: 'hsl(222 24% 14%)',
          850: 'hsl(222 26% 11%)',
          900: 'hsl(222 28% 8%)',
          950: 'hsl(222 30% 5%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      boxShadow: {
        glow:     '0 0 20px hsl(220 72% 50% / 0.3)',
        'glow-sm':'0 0 10px hsl(220 72% 50% / 0.2)',
      },
    },
  },
  plugins: [],
}

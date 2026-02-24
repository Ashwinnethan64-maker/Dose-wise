/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f7',
          100: '#b3e8e8',
          200: '#80d9d9',
          300: '#4dcaca',
          400: '#26bfbf',
          500: '#0d9e9e',
          600: '#0b8686',
          700: '#086e6e',
          800: '#065656',
          900: '#043e3e',
        },
        medical: {
          bg: '#f0f9f9',
          card: '#ffffff',
          text: '#1a2e35',
          muted: '#5f7a84',
          accent: '#0d9e9e',
          danger: '#e74c3c',
          warn: '#f39c12',
          safe: '#27ae60',
        },
        glass: {
          white: 'rgba(255,255,255,0.65)',
          teal: 'rgba(13,158,158,0.08)',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'elder-sm': ['1.125rem', { lineHeight: '1.75rem' }],
        'elder-base': ['1.25rem', { lineHeight: '1.875rem' }],
        'elder-lg': ['1.5rem', { lineHeight: '2rem' }],
        'elder-xl': ['1.875rem', { lineHeight: '2.375rem' }],
        'elder-2xl': ['2.25rem', { lineHeight: '2.75rem' }],
        'elder-3xl': ['2.75rem', { lineHeight: '3.25rem' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(13, 158, 158, 0.08)',
        'card-hover': '0 12px 40px rgba(13, 158, 158, 0.16)',
        'btn': '0 4px 16px rgba(13, 158, 158, 0.25)',
        'btn-hover': '0 8px 24px rgba(13, 158, 158, 0.35)',
        'glow': '0 0 20px rgba(13, 158, 158, 0.2)',
        'glow-lg': '0 0 40px rgba(13, 158, 158, 0.25)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'scan-line': 'scanLine 2s linear infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'typing': 'typing 1.2s ease-in-out infinite',
        'ring-progress': 'ringProgress 1s ease-out forwards',
        'counter': 'counter 0.6s ease-out forwards',
        'toast-in': 'toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'toast-out': 'toastOut 0.3s ease-in forwards',
        'border-spin': 'borderSpin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(13,158,158,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(13,158,158,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        typing: {
          '0%': { opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
        ringProgress: {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: 'var(--ring-offset)' },
        },
        counter: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
        },
        borderSpin: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};

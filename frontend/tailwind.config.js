/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tactical: {
          black: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a2e',
          border: '#2a2a3e',
          accent: '#3b82f6',
          critical: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          info: '#6366f1',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      animation: {
        'pulse-critical': 'pulseCritical 2s ease-in-out infinite',
        'flash-red': 'flashRed 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        pulseCritical: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        flashRed: {
          '0%, 100%': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px 0 rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(99, 102, 241, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};

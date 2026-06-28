import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#141414',
        'surface-hover': '#1e1e1e',
        border: '#222',
        text: '#e8e8e8',
        'text-dim': '#888',
        'text-muted': '#555',
        critical: '#ff4444',
        high: '#ff8800',
        elevated: '#ffaa00',
        normal: '#44aa44',
        low: '#3388ff',
      },
      fontFamily: {
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
    },
  },
} satisfies Config

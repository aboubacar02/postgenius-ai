/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],

  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],

  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        tertiary: 'var(--tertiary)',
        'surface-variant': 'var(--surface-variant)',
        'surface-container': 'var(--surface-container)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'on-surface': 'var(--on-surface)',
        'outline-variant': 'var(--outline-variant)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: { DEFAULT: 'var(--sidebar-primary)', foreground: 'var(--sidebar-primary-foreground)' },
          accent: { DEFAULT: 'var(--sidebar-accent)', foreground: 'var(--sidebar-accent-foreground)' },
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        pg: {
          bg: '#0B0F17',
          surface: '#111827',
          surface2: '#161D2A',
          surface3: '#1E293B',
          primary: '#6366F1',
          primaryLight: '#818CF8',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          green: '#10B981',
          amber: '#F59E0B',
          rose: '#EC4899',
          red: '#EF4444',
          text: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      boxShadow: {
        'pg-sm': '0 1px 2px rgba(0,0,0,.2)',
        'pg-md': '0 8px 24px rgba(0,0,0,.22)',
        'pg-lg': '0 20px 50px rgba(0,0,0,.32)',
        'pg-indigo': '0 10px 30px rgba(99,102,241,.12)',
      },

      borderRadius: {
        pg: '10px',
        'pg-lg': '14px',
        'pg-xl': '18px',
      },

      transitionTimingFunction: {
        pg: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },

  plugins: [],
}

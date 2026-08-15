/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
        }
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Hanken Grotesk', 'Inter', 'sans-serif'],
        heading: ['Hanken Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
}
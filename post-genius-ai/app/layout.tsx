import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono as JetBrains_Mono_Fallback, Inter, Space_Grotesk } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

// JetBrains Mono isn't bundled with next/font/google in this environment; Geist Mono
// is used as a metrically-compatible monospace fallback for numeric data.
const jetbrainsMono = JetBrains_Mono_Fallback({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PostGenius AI — Scripts viraux générés par IA',
  description:
    'Générez des scripts viraux pour TikTok, Instagram Reels et YouTube Shorts en quelques secondes grâce à l’IA.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <script
          // Runs before paint to avoid a light/dark flash. Reads the user's saved
          // preference; PostGenius defaults to dark, matching the product's brand.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('pg-theme');if(t==='light'){document.documentElement.classList.remove('dark')}}catch(e){}`,
          }}
        />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

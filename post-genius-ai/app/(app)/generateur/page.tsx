import type { Metadata } from 'next'
import { GeneratorPageClient } from '@/components/generator/generator-page-client'

export const metadata: Metadata = {
  title: 'Générateur de scénarios — PostGenius AI',
  description:
    'Génère un scénario viral complet pour TikTok, Reels ou Shorts : hooks, script, timeline, sous-titres et hashtags.',
}

export default function GeneratorPage() {
  return <GeneratorPageClient />
}

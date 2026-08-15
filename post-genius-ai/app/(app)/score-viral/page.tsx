import type { Metadata } from 'next'
import { ScorePageClient } from '@/components/score/score-page-client'

export const metadata: Metadata = {
  title: 'Score viral — PostGenius AI',
  description: "Analyse la force virale d'un hook avant de tourner ta vidéo.",
}

export default function ScoreViralPage() {
  return <ScorePageClient />
}

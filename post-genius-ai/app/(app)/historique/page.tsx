import type { Metadata } from 'next'
import { HistoryPageClient } from '@/components/history/history-page-client'

export const metadata: Metadata = {
  title: 'Historique — PostGenius AI',
  description: 'Retrouve tous les scripts générés précédemment.',
}

export default function HistoryPage() {
  return <HistoryPageClient />
}

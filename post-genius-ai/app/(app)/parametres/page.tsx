import type { Metadata } from 'next'
import { SettingsPageClient } from '@/components/settings/settings-page-client'

export const metadata: Metadata = {
  title: 'Paramètres — PostGenius AI',
  description: 'Gère ton profil, tes préférences, ta facturation et ta sécurité.',
}

export default function SettingsPage() {
  return <SettingsPageClient />
}

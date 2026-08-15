// Central mock/demo data for PostGenius AI. No backend is wired up yet — every
// value here simulates what a real API + database would eventually return.

export type Network = 'tiktok' | 'reels' | 'shorts'
export type Tone =
  | 'humour'
  | 'inspirant'
  | 'educatif'
  | 'provocateur'
  | 'storytelling'
  | 'direct'
export type Format = 'hook-histoire' | 'tutoriel' | 'liste' | 'avant-apres' | 'question-reponse'
export type Duration = 15 | 30 | 60
export type Audience =
  | 'grand-public'
  | 'entrepreneurs'
  | 'gen-z'
  | 'parents'
  | 'fitness'
  | 'tech'
export type CtaGoal = 'abonne' | 'commente' | 'partage' | 'lien-bio' | 'sauvegarde'

export const NETWORKS: { value: Network; label: string; hint: string }[] = [
  { value: 'tiktok', label: 'TikTok', hint: 'Vertical, algo découverte' },
  { value: 'reels', label: 'Instagram Reels', hint: 'Vertical, esthétique' },
  { value: 'shorts', label: 'YouTube Shorts', hint: 'Vertical, rétention' },
]

export const TONES: { value: Tone; label: string }[] = [
  { value: 'humour', label: 'Humoristique' },
  { value: 'inspirant', label: 'Inspirant' },
  { value: 'educatif', label: 'Éducatif' },
  { value: 'provocateur', label: 'Provocateur' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'direct', label: 'Direct & franc' },
]

export const FORMATS: { value: Format; label: string }[] = [
  { value: 'hook-histoire', label: 'Hook + Histoire' },
  { value: 'tutoriel', label: 'Tutoriel pas-à-pas' },
  { value: 'liste', label: 'Liste / Top' },
  { value: 'avant-apres', label: 'Avant / Après' },
  { value: 'question-reponse', label: 'Question / Réponse' },
]

export const DURATIONS: { value: Duration; label: string }[] = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
]

export const AUDIENCES: { value: Audience; label: string }[] = [
  { value: 'grand-public', label: 'Grand public' },
  { value: 'entrepreneurs', label: 'Entrepreneurs' },
  { value: 'gen-z', label: 'Gen Z' },
  { value: 'parents', label: 'Parents' },
  { value: 'fitness', label: 'Fitness & santé' },
  { value: 'tech', label: 'Tech & IA' },
]

export const CTA_GOALS: { value: CtaGoal; label: string }[] = [
  { value: 'abonne', label: "Inciter à s'abonner" },
  { value: 'commente', label: 'Inciter à commenter' },
  { value: 'partage', label: 'Inciter à partager' },
  { value: 'lien-bio', label: 'Lien en bio' },
  { value: 'sauvegarde', label: 'Inciter à sauvegarder' },
]

export const CURRENT_USER = {
  name: 'Camille Aubert',
  email: 'camille.aubert@postgenius.ai',
  initials: 'CA',
  plan: 'Pro',
}

export const DAILY_CREDITS = {
  used: 7,
  total: 20,
  resetsInHours: 6,
}

export type HistoryItem = {
  id: string
  title: string
  network: Network
  format: Format
  createdAt: string
  duration: Duration
  score: number
  hashtags: string[]
}

export const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'h1',
    title: '3 erreurs qui tuent ton reach sur TikTok',
    network: 'tiktok',
    format: 'liste',
    createdAt: '2026-08-13T09:12:00Z',
    duration: 30,
    score: 87,
    hashtags: ['#tiktoktips', '#growth', '#contentcreator'],
  },
  {
    id: 'h2',
    title: "J'ai testé l'IA pour écrire mes scripts pendant 30 jours",
    network: 'reels',
    format: 'hook-histoire',
    createdAt: '2026-08-12T18:40:00Z',
    duration: 60,
    score: 74,
    hashtags: ['#iagenerative', '#contentcreation', '#reels'],
  },
  {
    id: 'h3',
    title: 'Le hook parfait en 3 secondes (méthode complète)',
    network: 'shorts',
    format: 'tutoriel',
    createdAt: '2026-08-11T14:02:00Z',
    duration: 30,
    score: 91,
    hashtags: ['#shorts', '#copywriting', '#viral'],
  },
  {
    id: 'h4',
    title: 'Avant / après : ma routine de post à 2h vs 20min',
    network: 'tiktok',
    format: 'avant-apres',
    createdAt: '2026-08-10T08:20:00Z',
    duration: 15,
    score: 68,
    hashtags: ['#productivite', '#creator'],
  },
  {
    id: 'h5',
    title: 'Pourquoi 90% de vos vidéos ne dépassent pas 500 vues',
    network: 'reels',
    format: 'question-reponse',
    createdAt: '2026-08-08T11:55:00Z',
    duration: 30,
    score: 79,
    hashtags: ['#algorithm', '#reelstips'],
  },
]

export type PricingPlan = {
  id: string
  name: string
  price: number
  period: string
  description: string
  featured?: boolean
  features: string[]
  cta: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'toujours',
    description: 'Pour tester le générateur sans engagement.',
    features: [
      '5 scripts / jour',
      '1 format de sortie',
      'Score viral basique',
      'Historique 7 jours',
    ],
    cta: 'Commencer gratuitement',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: 'mois',
    description: 'Pour les créateurs qui publient chaque semaine.',
    featured: true,
    features: [
      '20 scripts / jour',
      'Tous les formats & tons',
      'Score viral avancé + suggestions',
      'Timeline, sous-titres & hashtags',
      'Historique illimité',
      'Export audio & vignettes',
    ],
    cta: 'Passer en Pro',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 79,
    period: 'mois',
    description: 'Pour les agences et équipes multi-comptes.',
    features: [
      'Scripts illimités',
      '5 sièges équipe',
      'Banque de marque personnalisée',
      'Accès API',
      'Support prioritaire',
    ],
    cta: 'Passer en Studio',
  },
]

// Données centrales du produit (valeurs identiques à la maquette v0).

export const NETWORKS = [
  { value: 'tiktok', label: 'TikTok', hint: 'Vertical, algo découverte', emoji: '🎵' },
  { value: 'reels', label: 'Instagram Reels', hint: 'Vertical, esthétique', emoji: '📸' },
  { value: 'shorts', label: 'YouTube Shorts', hint: 'Vertical, rétention', emoji: '▶️' }
]

export const TONES = [
  { value: 'humour', label: 'Humoristique' },
  { value: 'inspirant', label: 'Inspirant' },
  { value: 'educatif', label: 'Éducatif' },
  { value: 'provocateur', label: 'Provocateur' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'direct', label: 'Direct & franc' }
]

export const FORMATS = [
  { value: 'hook-histoire', label: 'Hook + Histoire' },
  { value: 'tutoriel', label: 'Tutoriel pas-à-pas' },
  { value: 'liste', label: 'Liste / Top' },
  { value: 'avant-apres', label: 'Avant / Après' },
  { value: 'question-reponse', label: 'Question / Réponse' }
]

export const DURATIONS = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 90, label: '90s' }
]

export const AUDIENCES = [
  { value: 'grand-public', label: 'Grand public' },
  { value: 'entrepreneurs', label: 'Entrepreneurs' },
  { value: 'gen-z', label: 'Gen Z' },
  { value: 'parents', label: 'Parents' },
  { value: 'fitness', label: 'Fitness & santé' },
  { value: 'tech', label: 'Tech & IA' }
]

export const CTA_GOALS = [
  { value: 'abonne', label: "Inciter à s'abonner" },
  { value: 'commente', label: 'Inciter à commenter' },
  { value: 'partage', label: 'Inciter à partager' },
  { value: 'lien-bio', label: 'Lien en bio' },
  { value: 'sauvegarde', label: 'Inciter à sauvegarder' }
]

export const MARKETS = [
  {
    value: 'wa',
    flag: '🌍',
    label: "Afrique de l'Ouest",
    longLabel: "Afrique de l'Ouest (CI, Sénégal…)",
    lang: 'fr',
    desc: 'Français local et tendances régionales — nouchi à Abidjan, wolof à Dakar.'
  },
  {
    value: 'fr',
    flag: '🇫🇷',
    label: 'France / Europe',
    longLabel: 'France / Europe',
    lang: 'fr',
    desc: 'Français standard, accroches et références du marché européen.'
  },
  {
    value: 'ca',
    flag: '🇨🇦',
    label: 'Canada / Québec',
    longLabel: 'Canada / Québec',
    lang: 'fr',
    desc: 'Français québécois, humour et références culturelles locales.'
  },
  {
    value: 'us',
    flag: '🇺🇸',
    label: 'USA',
    longLabel: 'USA / International',
    lang: 'en',
    desc: 'Script généré directement en anglais, ton US punchy.'
  }
]

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'toujours',
    description: 'Tout le studio IA inclus, limité à 5 scripts par jour.',
    features: [
      '5 scripts / jour',
      'Tous les formats & tons',
      'Score viral + suggestions IA',
      'Studio Faceless : timeline, sous-titres & voix-off',
      'Export pack CapCut (MP3, MP4, SRT) & historique illimité'
    ],
    cta: 'Commencer gratuitement'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: 'mois',
    description: 'Pour les créateurs qui publient chaque semaine — 20 scripts par jour.',
    featured: true,
    features: [
      '20 scripts / jour',
      'Tous les formats & tons',
      'Score viral + suggestions IA',
      'Studio Faceless : timeline, sous-titres & voix-off',
      'Export pack CapCut (MP3, MP4, SRT) & historique illimité'
    ],
    cta: 'Passer en Pro'
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 79,
    period: 'mois',
    description: 'Pour les agences et équipes — 500 scripts par jour (quasi illimité).',
    features: [
      '500 scripts / jour',
      'Tous les formats & tons',
      'Score viral + suggestions IA',
      'Studio Faceless : timeline, sous-titres & voix-off',
      'Export pack CapCut (MP3, MP4, SRT) & historique illimité'
    ],
    cta: 'Passer en Studio'
  }
]

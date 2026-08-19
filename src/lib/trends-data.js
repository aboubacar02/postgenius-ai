// ── Trending Data ───────────────────────────────────────────
// Real curated data + auto-refresh for music trends

export const BEST_TIMES = [
  {
    platform: 'TikTok',
    emoji: '🎵',
    color: 'from-fuchsia-500 to-purple-600',
    window: '18h – 21h',
    secondary: 'Créneau secondaire : 7h – 9h (metro)',
    advice:
      'Le pic d\'engagement est entre 18h et 21h quand les gens rentrent du travail. Le matin en transport (7h-9h) est aussi très fort pour les contenus courts.',
    strength: 95
  },
  {
    platform: 'Reels',
    emoji: '📸',
    color: 'from-pink-400 to-rose-600',
    window: '12h – 14h',
    secondary: 'Créneau secondaire : 19h – 22h',
    advice:
      'La pause déjeuner (12h-14h) est le créneau principal pour Instagram. Le soir après 19h fonctionne aussi très bien, surtout le dimanche soir.',
    strength: 88
  },
  {
    platform: 'Shorts',
    emoji: '▶️',
    color: 'from-red-500 to-rose-600',
    window: '15h – 19h',
    secondary: 'Créneau secondaire : 9h – 11h (weekend)',
    advice:
      'YouTube Shorts performe surtout en fin de journée. Le weekend matin est un excellent créneau secondaire pour toucher un public détendu.',
    strength: 86
  }
]

export const VIRAL_FORMATS = [
  { emoji: '📅', name: 'Day in the Life', desc: 'Une journée de vie accélérée, rythmée par la voix off.' },
  { emoji: '🎬', name: 'POV Immersion', desc: 'Point de vue immersif : « POV : tu viens de doubler tes revenus en 30 jours ».' },
  { emoji: '🆚', name: 'Toi vs Moi', desc: 'Contraste entre la méthode facile et la méthode ultra-efficace.' },
  { emoji: '🔄', name: 'Avant / Après', desc: 'Transformation choc, le visuel et les chiffres parlent tout seuls.' },
  { emoji: '❌', name: 'Les 3 Erreurs', desc: 'Liste punchy d\'erreurs méconnues qui détruisent la rétention.' },
  { emoji: '⚡', name: 'Q&A Éclair', desc: '3 questions / réponses rapides, rythme très soutenu.' },
  { emoji: '📖', name: 'Storytime Cliffhanger', desc: 'Storytime à épisodes qui force le spectateur à s\'abonner.' },
  { emoji: '🏆', name: 'Le Défi Viral', desc: 'Lance un défi à la communauté : commentaires et partages garantis.' },
  { emoji: '⏱️', name: 'Récap en 60 s', desc: 'Tout ce qu\'il faut savoir sur un sujet, ultra dense et actionnable.' },
  { emoji: '🤫', name: 'Le Secret Révélé', desc: '« Ce que personne ne te dit » : curiosity gap maximal dès 0.5s.' }
]

// ── Resources (curated YouTube tutorials) ──────────────────
export const RESOURCES = [
  {
    title: 'Montage CapCut : le guide complet pour TikTok',
    channel: '@FormationMontage',
    duration: '12:45',
    gradient: 'from-fuchsia-500 via-purple-600 to-indigo-900',
    icon: '✂️',
    desc: 'Sous-titres automatiques, zoomin et transitions qui retiennent le spectateur.',
    youtubeId: 'Kk2nO_lGMbg'
  },
  {
    title: 'Rétention TikTok : garder le spectateur jusqu\'à la fin',
    channel: '@AlgorithmeAcademy',
    duration: '9:20',
    gradient: 'from-cyan-400 via-blue-600 to-indigo-900',
    icon: '📈',
    desc: 'Les 3 leviers de rétention et les erreurs qui tuent tes vidéos.',
    youtubeId: 'RDE4U0RYmcM'
  },
  {
    title: 'L\'algorithme YouTube Shorts décodé',
    channel: '@CreatorLab',
    duration: '15:02',
    gradient: 'from-rose-600 via-red-500 to-orange-800',
    icon: '🎯',
    desc: 'Comment le classement fonctionne et comment être proposé à plus de monde.',
    youtubeId: 'JkoxsFGbTQw'
  },
  {
    title: 'Storytelling viral : la structure en 3 actes',
    channel: '@StorytellerFR',
    duration: '11:38',
    gradient: 'from-amber-400 via-orange-500 to-rose-800',
    icon: '📖',
    desc: 'Construis des histoires qui captivent dès la première seconde.',
    youtubeId: 'GhlG1FVgRoY'
  },
  {
    title: 'Sous-titres style CapCut en 5 minutes',
    channel: '@QuickTutos',
    duration: '5:15',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-800',
    icon: '💬',
    desc: 'Le style de sous-titres qui booste ta rétention sur mobile.',
    youtubeId: 'J---aiyznGQ'
  },
  {
    title: 'Hook : la science des 3 premières secondes',
    channel: '@GrowthVideo',
    duration: '8:44',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-800',
    icon: '⚡',
    desc: 'Pourquoi tes hooks ne fonctionnent pas et comment les réécrire.',
    youtubeId: 'nSAnJOMn0Zc'
  }
]

// ── Viral Video Examples (no YouTube thumbnails — clean gradients) ────
export const VIRAL_VIDEOS = [
  {
    id: 'hook-story',
    youtubeId: 'Kk2nO_lGMbg',
    title: 'Hook + Storytime : Le format qui cartonne',
    channel: 'Tendance TikTok',
    views: '12M+ vues',
    gradient: 'from-amber-500 via-orange-600 to-rose-700',
    icon: '🔥',
    niche: 'Storytime',
    description: 'Structure en 3 actes : hook choc → narration → punchline finale'
  },
  {
    id: 'pov-immer',
    youtubeId: 'RDE4U0RYmcM',
    title: 'POV Immersion : le spectateur devient le héros',
    channel: 'Tendance Reels',
    views: '8.5M+ vues',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-700',
    icon: '🎬',
    niche: 'POV',
    description: 'Camera first-person, sous-titres narratifs, musique synchro'
  },
  {
    id: 'avant-apres',
    youtubeId: 'JkoxsFGbTQw',
    title: 'Avant / Après : la transformation qui vire',
    channel: 'Tendance Shorts',
    views: '6.2M+ vues',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-700',
    icon: '🔄',
    niche: 'Transformation',
    description: 'Split screen ou cut net, le contraste visuel parle de lui-même'
  },
  {
    id: 'erreur-top',
    youtubeId: 'GhlG1FVgRoY',
    title: 'Les 3 erreurs qui détruisent ta rétention',
    channel: 'Tendance TikTok',
    views: '4.8M+ vues',
    gradient: 'from-rose-500 via-pink-600 to-purple-700',
    icon: '❌',
    niche: 'Éducatif',
    description: 'Format liste inversée : on commence par la pire erreur'
  },
  {
    id: 'defi-viral',
    youtubeId: 'J---aiyznGQ',
    title: 'Le Défi 30 jours : engagement massif',
    channel: 'Tendance Reels',
    views: '3.5M+ vues',
    gradient: 'from-violet-500 via-purple-600 to-indigo-800',
    icon: '🏆',
    niche: 'Défi',
    description: 'Communauté + progression visible + CTA vers épisode suivant'
  },
  {
    id: 'secret-rev',
    youtubeId: 'nSAnJOMn0Zc',
    title: '« Ce que personne ne te dit sur… »',
    channel: 'Tendance Shorts',
    views: '5.1M+ vues',
    gradient: 'from-fuchsia-500 via-purple-500 to-violet-800',
    icon: '🤫',
    niche: 'Curiosity',
    description: 'Curiosity gap maximal : on révèle un « secret » en 15 secondes'
  }
]

// ── Seed helper ────────────────────────────────────────────
export function seedFromString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

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
    url: 'https://www.youtube.com/results?search_query=tutoriel+montage+capcut+tiktok+francais'
  },
  {
    title: 'Rétention TikTok : garder le spectateur jusqu\'à la fin',
    channel: '@AlgorithmeAcademy',
    duration: '9:20',
    gradient: 'from-cyan-400 via-blue-600 to-indigo-900',
    icon: '📈',
    desc: 'Les 3 leviers de rétention et les erreurs qui tuent tes vidéos.',
    url: 'https://www.youtube.com/results?search_query=retention+tiktok+garder+spectateur+tutoriel'
  },
  {
    title: 'L\'algorithme YouTube Shorts décodé',
    channel: '@CreatorLab',
    duration: '15:02',
    gradient: 'from-rose-600 via-red-500 to-orange-800',
    icon: '🎯',
    desc: 'Comment le classement fonctionne et comment être proposé à plus de monde.',
    url: 'https://www.youtube.com/results?search_query=algorithme+youtube+shorts+fonctionnement'
  },
  {
    title: 'Storytelling viral : la structure en 3 actes',
    channel: '@StorytellerFR',
    duration: '11:38',
    gradient: 'from-amber-400 via-orange-500 to-rose-800',
    icon: '📖',
    desc: 'Construis des histoires qui captivent dès la première seconde.',
    url: 'https://www.youtube.com/results?search_query=storytelling+viral+tiktok+structure'
  },
  {
    title: 'Sous-titres style CapCut en 5 minutes',
    channel: '@QuickTutos',
    duration: '5:15',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-800',
    icon: '💬',
    desc: 'Le style de sous-titres qui booste ta rétention sur mobile.',
    url: 'https://www.youtube.com/results?search_query=sous-titre+automatique+capcut+style+tiktok'
  },
  {
    title: 'Hook : la science des 3 premières secondes',
    channel: '@GrowthVideo',
    duration: '8:44',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-800',
    icon: '⚡',
    desc: 'Pourquoi tes hooks ne fonctionnent pas et comment les réécrire.',
    url: 'https://www.youtube.com/results?search_query=hook+3+premieres+secondes+tiktok'
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

// ── Real Trending Music (auto-refreshed) ───────────────────
// Simulates real Spotify/TikTok trending data with periodic updates
const MUSIC_CATALOG = [
  {
    id: 'trend-1',
    title: 'APT.',
    artist: 'ROSÉ & Bruno Mars',
    genre: 'Pop / K-Pop',
    bpm: 124,
    trending: 98,
    platform: 'TikTok + Spotify',
    tags: ['#dance', '#kpop', '#viral'],
    coverGradient: 'from-rose-500 to-pink-600',
    emoji: '🌹'
  },
  {
    id: 'trend-2',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    genre: 'Pop Ballad',
    bpm: 108,
    trending: 95,
    platform: 'Spotify + Reels',
    tags: ['#emotional', '#ballad', '#cinematic'],
    coverGradient: 'from-amber-400 to-orange-600',
    emoji: '✨'
  },
  {
    id: 'trend-3',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    genre: 'Indie Pop',
    bpm: 116,
    trending: 93,
    platform: 'TikTok + YouTube',
    tags: ['#aesthetic', '#soft', '#viral'],
    coverGradient: 'from-emerald-400 to-teal-600',
    emoji: '🪶'
  },
  {
    id: 'trend-4',
    title: 'L\'Amour Toujours',
    artist: 'Gigi D\'Agostino (Remix)',
    genre: 'Eurodance / Phonk',
    bpm: 132,
    trending: 91,
    platform: 'TikTok',
    tags: ['#phonk', '#edit', '#motivation'],
    coverGradient: 'from-violet-500 to-purple-700',
    emoji: '💜'
  },
  {
    id: 'trend-5',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    genre: 'Pop',
    bpm: 120,
    trending: 89,
    platform: 'TikTok + Reels',
    tags: ['#summer', '#catchy', '#dance'],
    coverGradient: 'from-orange-400 to-rose-500',
    emoji: '☕'
  },
  {
    id: 'trend-6',
    title: 'Taste',
    artist: 'Sabrina Carpenter',
    genre: 'Pop',
    bpm: 118,
    trending: 87,
    platform: 'Spotify + TikTok',
    tags: ['#viral', '#pop', '#dance'],
    coverGradient: 'from-pink-400 to-fuchsia-600',
    emoji: '🍬'
  },
  {
    id: 'trend-7',
    title: 'Beautiful Things',
    artist: 'Benson Boone',
    genre: 'Pop Rock',
    bpm: 110,
    trending: 86,
    platform: 'YouTube + TikTok',
    tags: ['#emotional', '#storytelling', '#growth'],
    coverGradient: 'from-sky-400 to-blue-600',
    emoji: '🌊'
  },
  {
    id: 'trend-8',
    title: 'Not Like Us',
    artist: 'Kendrick Lamar',
    genre: 'Hip-Hop',
    bpm: 126,
    trending: 85,
    platform: 'TikTok + Spotify',
    tags: ['#rap', '#diss', '#viral'],
    coverGradient: 'from-red-500 to-rose-700',
    emoji: '🔥'
  },
  {
    id: 'trend-9',
    title: 'Houdini',
    artist: 'Eminem',
    genre: 'Hip-Hop',
    bpm: 122,
    trending: 84,
    platform: 'YouTube + TikTok',
    tags: ['#rap', '#throwback', '#viral'],
    coverGradient: 'from-yellow-400 to-amber-600',
    emoji: '🎩'
  },
  {
    id: 'trend-10',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    genre: 'Pop',
    bpm: 116,
    trending: 82,
    platform: 'TikTok + Reels',
    tags: ['#summer', '#pop', '#dance'],
    coverGradient: 'from-cyan-400 to-blue-500',
    emoji: '☀️'
  },
  {
    id: 'trend-11',
    title: 'Fortnight',
    artist: 'Taylor Swift ft. Post Malone',
    genre: 'Pop / Alt',
    bpm: 112,
    trending: 80,
    platform: 'Spotify + YouTube',
    tags: ['#alternative', '#collab', '#moody'],
    coverGradient: 'from-gray-400 to-slate-700',
    emoji: '🌙'
  },
  {
    id: 'trend-12',
    title: 'Lovin On Me',
    artist: 'Jack Harlow',
    genre: 'Hip-Hop / Pop',
    bpm: 120,
    trending: 78,
    platform: 'TikTok',
    tags: ['#catchy', '#dance', '#viral'],
    coverGradient: 'from-indigo-400 to-violet-600',
    emoji: '💙'
  }
]

// Auto-refresh: shuffle trending scores slightly every 30 min
let lastRefresh = Date.now()
let cachedTracks = [...MUSIC_CATALOG]

function getRefreshedTracks() {
  const now = Date.now()
  const elapsed = now - lastRefresh
  // Re-shuffle every 30 minutes
  if (elapsed > 30 * 60 * 1000 || cachedTracks.length === 0) {
    lastRefresh = now
    cachedTracks = MUSIC_CATALOG.map((t) => ({
      ...t,
      trending: Math.max(60, Math.min(99, t.trending + Math.floor(Math.random() * 7) - 3))
    })).sort((a, b) => b.trending - a.trending)
  }
  return cachedTracks
}

export function getTrendingMusic() {
  return getRefreshedTracks()
}

export const VIRAL_AUDIO_TRACKS = getTrendingMusic()

// ── Seed helper ────────────────────────────────────────────
export function seedFromString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

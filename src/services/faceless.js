// Service du module "Faceless Video Generator".
// Script : généré par l'IA (proxy /api/gemini/script) ; si le serveur n'a pas de
// clé, un script modèle déterministe prend le relais pour que la démo fonctionne.
// B-roll : proxy /api/broll (Pexels si clé, sinon Picsum). Voix off : /api/tts (Edge).

const FACELESS_TOPICS = [
  'pourquoi ton cerveau adore les histoires',
  '3 leçons de vie apprises trop tard',
  'comment transformer une habitude en 21 jours',
  'la vérité sur l’argent que personne n’assume',
  'le pouvoir caché de la marche quotidienne',
  'pourquoi tu te couches trop tard (et comment arrêter)',
  'ce que les gens qui réussissent font à 6h du matin',
  'l’erreur fatale des débutants en freelance'
]

export const VOICE_GENDERS = [
  { id: 'male', label: 'Masculin', emoji: '🎙️' },
  { id: 'female', label: 'Féminin', emoji: '🎤' }
]

export const VOICE_STYLES = [
  { id: 'energetic', label: 'Énergique', desc: 'Rythme rapide, punchy' },
  { id: 'calm', label: 'Posé', desc: 'Calme et confiant' },
  { id: 'cinema', label: 'Cinéma', desc: 'Narration filmique' }
]

const VOICE_MAP = {
  'male:energetic': 'fr-FR-YvesNeural',
  'male:calm': 'fr-FR-HenriNeural',
  'male:cinema': 'fr-FR-RemyMultilingualNeural',
  'female:energetic': 'fr-FR-VivienneMultilingualNeural',
  'female:calm': 'fr-FR-DeniseNeural',
  'female:cinema': 'fr-FR-EliseNeural'
}

export function pickEdgeVoice(gender = 'male', style = 'energetic') {
  return VOICE_MAP[`${gender}:${style}`] || 'fr-FR-HenriNeural'
}

function slugify(keyword) {
  return keyword
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .join(' ')
}

function buildFallbackScript({ topic, duration }) {
  const sceneCount = Math.max(4, Math.min(10, Math.round(duration / 3)))
  const beats = [
    `Tu vas découvrir ${topic.toLowerCase()}... et ça va changer ta façon de voir les choses.`,
    'Oublie tout ce qu’on t’a raconté jusqu’ici.',
    'La plupart des gens se trompent depuis le début.',
    'Voici la vérité, sans filtre.',
    'Le détail que personne ne remarque, c’est celui-là.',
    'Quand j’ai enfin compris ça, tout a basculé.',
    'Ça semble petit, mais l’impact est énorme.',
    'Teste-le dès aujourd’hui, tu verras la différence.',
    'Ne fais pas la même erreur que tout le monde.',
    'Et si tu commençais maintenant ?'
  ].slice(0, sceneCount)
  const keyword = slugify(topic)
  const captions = [
    'CE QUE PERSONNE NE DIT',
    'OUBLIE CE QUE TU CROIS',
    'L’ERREUR FATALE',
    'LA VÉRITÉ SANS FILTRE',
    'LE DÉTAIL CACHÉ',
    'TOUT A BASCULÉ',
    'L’IMPACT ÉNORME',
    'TESTE-LE AUJOURD’HUI',
    'NE FAIS PAS CETTE ERREUR',
    'COMMENCE MAINTENANT'
  ].slice(0, sceneCount)
  return {
    title: `${topic} — le secret que personne ne t'a dit`,
    hook: beats[0],
    scenes: beats.map((narration, i) => ({
      narration,
      caption: captions[i],
      visual: `Plan B-roll illustrant : ${topic} (${i + 1})`,
      imageKeyword: `${keyword} ${i + 1}`
    })),
    hashtags: ['#shorts', '#viral', '#motivation', '#faceless', '#astuce']
  }
}

export async function generateFacelessScript({ topic, niche, duration }) {
  const sceneCount = Math.max(4, Math.min(10, Math.round(duration / 3)))
  const prompt = `
Tu es un expert en vidéos "faceless" (sans visage) pour YouTube Shorts / TikTok / Instagram Reels.
Sujet : "${topic}"
Niche : "${niche}"
Durée cible : environ ${duration} secondes.

Génère un script de voix off rythmé en ${sceneCount} scènes. Chaque scène correspond à
UNE phrase courte dite en voix off (6 à 15 mots) illustrée par une image B-roll.
Structure : hook choc (0-3s) → tension → pic émotionnel → leçon → CTA naturel final.

Réponds UNIQUEMENT en JSON valide, avec cette structure exacte (pas de texte avant/après) :
{
  "title": "titre accrocheur (moins de 15 mots, 1-2 emojis)",
  "hook": "phrase d'accroche des 3 premières secondes (moins de 15 mots)",
  "scenes": [
    {
      "narration": "phrase orale naturelle et rythmée (6-15 mots)",
      "visual": "description précise de l'image B-roll à montrer à l'écran",
      "imageKeyword": "mots-clés EN ANGLAIS pour chercher l'image (3 mots max)",
      "caption": "sous-titre court (3-6 mots), avec le mot le plus fort en MAJUSCULES"
    }
  ],
  "hashtags": ["#short1", "#short2", "#short3", "#short4", "#short5"]
}
Règles : style oral vivant façon créateur (phrases scandées, power words), chaque scène =
une idée, la dernière scène contient un appel à l'action naturel, les captions reprennent
les mots du spoken-word pour un sous-titrage dynamique style TikTok/Alex Hormozi.
`

  try {
    const res = await fetch('/api/gemini/script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail.error || `IA indisponible (${res.status})`)
    }
    const data = await res.json()
    if (!Array.isArray(data.scenes) || data.scenes.length === 0) {
      throw new Error('Script invalide')
    }
    return { ...data, scenes: data.scenes.slice(0, sceneCount), source: 'ai' }
  } catch {
    return { ...buildFallbackScript({ topic, duration }), source: 'template' }
  }
}

const BROLL_FALLBACK_COLLECTION = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&auto=format&fit=crop&q=80', // Skyline
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1080&auto=format&fit=crop&q=80', // Analytics
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&auto=format&fit=crop&q=80', // Office
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&auto=format&fit=crop&q=80', // Tech
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80', // AI 3D
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1080&auto=format&fit=crop&q=80', // Gaming
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop&q=80', // Fitness
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1080&auto=format&fit=crop&q=80', // Beauty
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080&auto=format&fit=crop&q=80', // Food
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1080&auto=format&fit=crop&q=80'  // Money
]

function getFallbackImage(keyword = '') {
  let hash = 0
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % BROLL_FALLBACK_COLLECTION.length
  return BROLL_FALLBACK_COLLECTION[index]
}

export async function fetchBroll(keyword) {
  try {
    const res = await fetch(`/api/broll?q=${encodeURIComponent(keyword)}`)
    if (res.ok) {
      const data = await res.json()
      if (data?.url) return data
    }
  } catch {
    /* Fallback reseau */
  }
  return { live: false, keyword, url: getFallbackImage(keyword) }
}

export async function fetchBrollVideo(keyword) {
  try {
    const res = await fetch(`/api/broll/video?q=${encodeURIComponent(keyword)}`)
    if (res.ok) {
      const data = await res.json()
      if (data?.videoUrl || data?.imageUrl) return data
    }
  } catch {
    /* Fallback reseau */
  }
  return { live: false, keyword, videoUrl: null, imageUrl: getFallbackImage(keyword) }
}

export async function fetchNarration(text, voiceId) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: voiceId, lang: 'fr-FR' })
  })
  if (!res.ok || !(res.headers.get('content-type') || '').includes('audio')) {
    throw new Error('TTS Edge indisponible')
  }
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

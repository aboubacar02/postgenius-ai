// Deterministic "fake AI" generator. Stands in for a real model call so the
// product can be demoed end-to-end; swap the body of these functions for real
// AI SDK calls later without touching the UI.

import type { Audience, CtaGoal, Duration, Format, Network, Tone } from '@/lib/mock-data'

export type GenerateInput = {
  network: Network
  tone: Tone
  format: Format
  duration: Duration
  audience: Audience
  cta: CtaGoal
  topic: string
}

export type TimelineRow = {
  time: string
  section: string
  note: string
}

export type GeneratedScript = {
  title: string
  hooks: string[]
  script: string[]
  timeline: TimelineRow[]
  hashtags: string[]
  subtitles: string[]
  thumbnailPrompts: string[]
  viralScore: number
}

function seedFromString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pick<T>(seed: number, arr: T[]) {
  return arr[seed % arr.length]
}

const HOOK_TEMPLATES = [
  (t: string) => `Personne ne te dira ça sur ${t}, alors je le fais.`,
  (t: string) => `J'ai fait l'erreur numéro 1 sur ${t} pendant 2 ans. Regarde.`,
  (t: string) => `Si tu galères avec ${t}, arrête tout et regarde ça.`,
  (t: string) => `Voici ce que personne n'explique sur ${t}.`,
  (t: string) => `3 secondes pour changer ta vision de ${t}.`,
]

const CTA_LINES: Record<CtaGoal, string> = {
  abonne: "Abonne-toi si tu veux la suite de cette série.",
  commente: "Dis-moi en commentaire si tu as déjà vécu ça.",
  partage: "Partage cette vidéo à quelqu'un qui en a besoin.",
  'lien-bio': 'Le guide complet est en lien dans ma bio.',
  sauvegarde: 'Sauvegarde cette vidéo, tu vas en avoir besoin plus tard.',
}

const TONE_ADVERB: Record<Tone, string> = {
  humour: 'avec une pointe d’humour',
  inspirant: 'sur un ton inspirant',
  educatif: 'de façon claire et pédagogique',
  provocateur: 'sans filtre, direct',
  storytelling: 'sous forme d’histoire vécue',
  direct: 'de façon franche et directe',
}

export function generateScript(input: GenerateInput): GeneratedScript {
  const topic = input.topic.trim() || 'ton sujet'
  const seed = seedFromString(topic + input.network + input.tone + input.format)

  const hooks = HOOK_TEMPLATES.map((fn) => fn(topic)).slice(0, 4)
  const primaryHook = pick(seed, hooks)

  const beats =
    input.format === 'liste'
      ? ['Annonce le nombre', 'Point 1', 'Point 2', 'Point 3', 'Récap + CTA']
      : input.format === 'tutoriel'
        ? ['Résultat final (preview)', 'Étape 1', 'Étape 2', 'Étape 3', 'CTA']
        : input.format === 'avant-apres'
          ? ['Situation avant', 'Le déclic', 'Situation après', 'CTA']
          : input.format === 'question-reponse'
            ? ['La question qui accroche', 'Réponse courte', 'Explication', 'CTA']
            : ['Hook', 'Mise en tension', 'Résolution / leçon', 'CTA']

  const totalSeconds = input.duration
  const step = Math.max(2, Math.floor(totalSeconds / beats.length))
  let cursor = 0
  const timeline: TimelineRow[] = beats.map((section, i) => {
    const start = cursor
    const end = i === beats.length - 1 ? totalSeconds : Math.min(totalSeconds, cursor + step)
    cursor = end
    return {
      time: `${start}s–${end}s`,
      section,
      note:
        i === 0
          ? 'Garde l’attention dès la 1ère frame, pas d’intro molle.'
          : i === beats.length - 1
            ? CTA_LINES[input.cta]
            : `Développe ${section.toLowerCase()} ${TONE_ADVERB[input.tone]}.`,
    }
  })

  const script = [
    primaryHook,
    `On va parler de ${topic}, et ${TONE_ADVERB[input.tone]}.`,
    ...beats.slice(1, -1).map((b) => `${b} : une idée concrète, actionnable, liée à ${topic}.`),
    CTA_LINES[input.cta],
  ]

  const subtitles = script.flatMap((line) =>
    line
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((s) => s.trim()),
  )

  const baseTags = ['#viral', '#pourtoi', '#fyp']
  const topicTag = `#${topic
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20) || 'contenu'}`
  const networkTag =
    input.network === 'tiktok' ? '#tiktokfrance' : input.network === 'reels' ? '#reels' : '#shorts'
  const hashtags = [topicTag, ...baseTags, networkTag]

  const thumbnailPrompts = [
    `Visage en gros plan, expression surprise, texte overlay "${topic}" en majuscules bold.`,
    `Split screen avant/après lié à "${topic}", fond contrasté, flèche centrale.`,
    `Main qui pointe la caméra, arrière-plan flou, sous-titre accrocheur sur "${topic}".`,
  ]

  const viralScore = scoreHook(primaryHook).score

  return {
    title: `${topic[0]?.toUpperCase()}${topic.slice(1)} — script ${input.duration}s`,
    hooks,
    script,
    timeline,
    hashtags,
    subtitles,
    thumbnailPrompts,
    viralScore,
  }
}

export type ScoreFactor = {
  label: string
  detail: string
  points: number
  max: number
}

export type ScoreResult = {
  score: number
  level: 'faible' | 'moyen' | 'fort'
  factors: ScoreFactor[]
  suggestions: string[]
}

export function scoreHook(hook: string): ScoreResult {
  const text = hook.trim()
  const words = text.split(/\s+/).filter(Boolean)
  const factors: ScoreFactor[] = []

  const lengthPoints = text.length === 0 ? 0 : text.length <= 90 ? 20 : text.length <= 130 ? 14 : 6
  factors.push({
    label: 'Longueur',
    detail: text.length <= 90 ? 'Concis, lisible en 3 secondes' : 'Un peu long pour un hook',
    points: lengthPoints,
    max: 20,
  })

  const hasNumber = /\d/.test(text)
  factors.push({
    label: 'Chiffre concret',
    detail: hasNumber ? 'Contient un chiffre, renforce la crédibilité' : 'Aucun chiffre détecté',
    points: hasNumber ? 18 : 4,
    max: 18,
  })

  const curiosityWords = /(personne|jamais|secret|erreur|vérité|arrête|ne .* pas|attention)/i
  const hasCuriosity = curiosityWords.test(text)
  factors.push({
    label: 'Curiosité / tension',
    detail: hasCuriosity ? 'Crée un écart de curiosité fort' : 'Manque de tension narrative',
    points: hasCuriosity ? 22 : 8,
    max: 22,
  })

  const hasQuestion = /\?/.test(text)
  const secondPerson = /(tu |toi|ton |ta |tes )/i.test(text)
  factors.push({
    label: 'Adresse directe',
    detail: secondPerson || hasQuestion ? 'Interpelle directement le spectateur' : 'Ton impersonnel',
    points: secondPerson || hasQuestion ? 20 : 8,
    max: 20,
  })

  const idealWordCount = words.length >= 5 && words.length <= 16
  factors.push({
    label: 'Rythme',
    detail: idealWordCount ? 'Débit adapté à un hook parlé' : 'Débit trop court ou trop dense',
    points: idealWordCount ? 20 : 10,
    max: 20,
  })

  const score = Math.min(100, factors.reduce((sum, f) => sum + f.points, 0))
  const level: ScoreResult['level'] = score >= 75 ? 'fort' : score >= 45 ? 'moyen' : 'faible'

  const suggestions: string[] = []
  if (!hasNumber) suggestions.push('Ajoute un chiffre précis (ex : "3 erreurs", "en 7 jours").')
  if (!hasCuriosity) suggestions.push('Introduis un écart de curiosité ("ce que personne ne dit").')
  if (!secondPerson && !hasQuestion) suggestions.push('Adresse-toi directement au spectateur avec "tu".')
  if (!idealWordCount) suggestions.push('Vise 5 à 16 mots pour un hook percutant à l’oral.')
  if (text.length > 130) suggestions.push('Raccourcis : un hook doit se lire en moins de 3 secondes.')

  return { score, level, factors, suggestions }
}

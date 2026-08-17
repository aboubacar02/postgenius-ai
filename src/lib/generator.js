// Générateur (plus score viral) — porté depuis la maquette v0.
// La fonction `scoreHook` alimente le Score viral et le score du panneau de
// résultats ; `generateScript` reste disponible en repli hors-ligne, tandis que
// `toV0Script` convertit la réponse réelle de Gémini vers ce même format.

function seedFromString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pick(seed, arr) {
  return arr[seed % arr.length]
}

const HOOK_TEMPLATES = [
  (t) => `Personne ne te dira ça sur ${t}, alors je le fais.`,
  (t) => `J'ai fait l'erreur numéro 1 sur ${t} pendant 2 ans. Regarde.`,
  (t) => `Si tu galères avec ${t}, arrête tout et regarde ça.`,
  (t) => `Voici ce que personne n'explique sur ${t}.`,
  (t) => `3 secondes pour changer ta vision de ${t}.`
]

const CTA_LINES = {
  abonne: 'Abonne-toi si tu veux la suite de cette série.',
  commente: 'Dis-moi en commentaire si tu as déjà vécu ça.',
  partage: 'Partage cette vidéo à quelqu’un qui en a besoin.',
  'lien-bio': 'Le guide complet est en lien dans ma bio.',
  sauvegarde: 'Sauvegarde cette vidéo, tu vas en avoir besoin plus tard.'
}

const TONE_ADVERB = {
  humour: 'avec une pointe d’humour',
  inspirant: 'sur un ton inspirant',
  educatif: 'de façon claire et pédagogique',
  provocateur: 'sans filtre, direct',
  storytelling: 'sous forme d’histoire vécue',
  direct: 'de façon franche et directe'
}

export function generateScript(input) {
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
  const timeline = beats.map((section, i) => {
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
            : `Développe ${section.toLowerCase()} ${TONE_ADVERB[input.tone]}.`
    }
  })

  const script = [
    primaryHook,
    `On va parler de ${topic}, et ${TONE_ADVERB[input.tone]}.`,
    ...beats.slice(1, -1).map((b) => `${b} : une idée concrète, actionnable, liée à ${topic}.`),
    CTA_LINES[input.cta]
  ]

  const subtitles = script.flatMap((line) =>
    line
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((s) => s.trim())
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
    `Main qui pointe la caméra, arrière-plan flou, sous-titre accrocheur sur "${topic}".`
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
    viralScore
  }
}

function splitScript(raw) {
  const paragraphs = String(raw || '').split(/\n+/).filter(Boolean)
  if (paragraphs.length <= 1) {
    return String(raw || '').split(/(?<=[.!?])\s+/).filter(Boolean)
  }
  return paragraphs
}

function buildVariant(real, v, { topic, duration }) {
  const t = topic.trim() || 'ton sujet'
  const hook =
    v.hook || (Array.isArray(v.hooks) && v.hooks[0]) || `Personne ne te dira ça sur ${t}, alors je le fais.`
  const paragraphs = splitScript(v.script)
  const ctaLine = paragraphs[paragraphs.length - 1] || ''
  const scriptText = paragraphs.join(' ')

  const viral = computeViralScore({
    aiMetrics: v.metrics,
    aiScore: v.viralScore,
    analysis: v.analysis,
    hook,
    cta: ctaLine,
    scriptText,
    keyword: t
  })

  return {
    angle: v.angle || '',
    title: v.title || `${t[0]?.toUpperCase()}${t.slice(1)} — script ${duration}s`,
    hook,
    hooks: [hook],
    script: paragraphs,
    subtitles: Array.isArray(v.captions) ? v.captions : [],
    hashtags: Array.isArray(v.hashtags) ? v.hashtags : [],
    viralScore: viral.score,
    aiScore: viral.aiScore,
    localScore: viral.localScore,
    analysis: viral.analysis,
    metrics: viral.metrics,
    factors: viral.metrics,
    suggestions:
      Array.isArray(real.rewriteTips) && real.rewriteTips.length ? real.rewriteTips : viral.suggestions
  }
}

// Convertit la réponse réelle de Gémini vers le format d'affichage v0.
export function toV0Script(real, { network, topic, duration = 30 }) {
  const t = topic.trim() || 'ton sujet'

  const timeline = Array.isArray(real.timeline)
    ? real.timeline.map((row, i) => ({
        time: row.timing || `${i * 3}s–${(i + 1) * 3}s`,
        section: String(row.visual || 'Séquence').slice(0, 42),
        note: row.audio || 'Voix off décrite dans la séquence.'
      }))
    : []

  const rewriteTips =
    Array.isArray(real.rewriteTips) && real.rewriteTips.length ? real.rewriteTips : []

  const global = {
    timeline,
    thumbnailPrompts: Array.isArray(real.thumbnailPrompts) ? real.thumbnailPrompts : [],
    lighting: Array.isArray(real.lighting) && real.lighting.length ? real.lighting : LIGHTING_DEFAULT,
    camera: Array.isArray(real.camera) && real.camera.length ? real.camera : CAMERA_DEFAULT,
    brolls: Array.isArray(real.brolls) && real.brolls.length ? real.brolls : BROLL_DEFAULT
  }

  const rawVariants =
    Array.isArray(real.variants) && real.variants.length
      ? real.variants
      : [{ ...real, angle: 'Angle principal', hook: real.hook || real.hooks?.[0] }]

  const variants = rawVariants.map((v) => buildVariant(real, v, { topic, duration }))
  const main = variants[0]

  return {
    ...main,
    ...global,
    hooks: variants.map((v) => v.hook).filter(Boolean),
    rewriteTips: rewriteTips.length ? rewriteTips : main.suggestions,
    variants
  }
}

export const VIRAL_PILLARS = [
  { id: 'hookRetention', label: 'Hook Retention (3s)' },
  { id: 'emotionalPeak', label: "Pic d'émotion" },
  { id: 'seo', label: 'SEO TikTok/Reels' },
  { id: 'ctaEfficiency', label: 'Force du CTA' },
  { id: 'pacing', label: 'Rythme & Lisibilité' }
]

const CAP = (v) => Math.min(100, Math.max(0, Math.round(v)))

// Analyse locale du hook sur les 5 piliers (repli hors-ligne et poids 30 %).
export function scoreHook(hook, { cta = '', keyword = '' } = {}) {
  const text = hook.trim()
  const ctaText = cta.trim()
  const words = text.split(/\s+/).filter(Boolean)
  const len = text.length

  const hasNumber = /\d/.test(text)
  const curiosity = /(personne|jamais|secret|erreur|vérité|arrête|attention|ne\s+\w+\s+pas)/i.test(
    text
  )
  const emotion =
    /(incroyable|choquant|horrible|fou|impossible|désastre|révèle|scandale|perdu|gagné|détruire|meilleur|pire|peur|honte|amour|haine)/i.test(
      text
    )
  const hasPunct = /[!?…]/.test(text)

  const kwWords = keyword.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  const kwHit = kwWords.some((w) => text.toLowerCase().includes(w))

  const pillars = {
    hookRetention: {
      label: 'Hook Retention (3s)',
      score: CAP(40 + (len <= 90 ? 25 : len <= 130 ? 15 : 5) + (curiosity ? 20 : 0) + (hasNumber ? 15 : 0)),
      insight:
        len <= 90
          ? 'Accroche lisible en moins de 3 secondes : idéale pour stopper le scroll.'
          : 'Accroche trop longue : elle doit se comprendre en 3 secondes.'
    },
    emotionalPeak: {
      label: "Pic d'émotion",
      score: CAP(35 + (emotion ? 30 : 0) + (hasPunct ? 20 : 0) + (curiosity ? 15 : 0)),
      insight: emotion
        ? 'Le script fait monter une émotion forte (surprise, peur, désir).'
        : "Manque d'émotion : ajoute un élément de surprise ou de tension au pic."
    },
    seo: {
      label: 'SEO TikTok/Reels',
      score: CAP(30 + (kwHit ? 40 : 0) + (hasNumber ? 15 : 0) + (text.includes('#') ? 15 : 0)),
      insight: kwHit
        ? "Le mot-clé principal est dans l'accroche : bon pour le référencement."
        : "Le mot-clé principal n'apparaît pas dans l'accroche : place-le dès les 3 premières secondes."
    },
    ctaEfficiency: {
      label: 'Force du CTA',
      score: CAP(
        15 +
          (ctaText ? 35 : 0) +
          (/abonne|follow/i.test(ctaText) ? 20 : 0) +
          (/comment|dis-moi|réponds|pense/i.test(ctaText) ? 20 : 0) +
          (/partage|sauvegarde|bio|enregistre/i.test(ctaText) ? 20 : 0)
      ),
      insight: ctaText
        ? 'CTA clair et actionnable.'
        : 'CTA absent : termine par une action précise (abonnement, commentaire, sauvegarde).'
    },
    pacing: {
      label: 'Rythme & Lisibilité',
      score: CAP(40 + (words.length >= 5 && words.length <= 16 ? 40 : 10) + (/…/.test(text) ? 10 : 0) + (hasPunct ? 10 : 0)),
      insight:
        words.length >= 5 && words.length <= 16
          ? 'Débit oral optimal (5 à 16 mots), rythme bien scandé.'
          : 'Débit trop court ou trop dense pour un hook parlé.'
    }
  }

  const suggestions = []
  if (len > 90) suggestions.push('Raccourcis l’accroche : un hook se lit en moins de 3 secondes.')
  if (!hasNumber) suggestions.push('Ajoute un chiffre concret (ex : « 3 erreurs », « en 7 jours »).')
  if (!curiosity) suggestions.push('Introduis un écart de curiosité (« ce que personne ne dit »).')
  if (!emotion) suggestions.push('Ajoute un mot à forte charge émotionnelle au pic du script.')
  if (!kwHit) suggestions.push(`Intègre le mot-clé « ${keyword || 'ton sujet'} » dès l’accroche.`)
  if (!ctaText) suggestions.push('Termine par un CTA unique et clair (abonne-toi, commente, sauvegarde).')
  if (words.length < 5 || words.length > 16) {
    suggestions.push('Vise 5 à 16 mots pour un hook percutant à l’oral.')
  }

  const score = CAP(Object.values(pillars).reduce((s, p) => s + p.score, 0) / VIRAL_PILLARS.length)
  return { score, pillars, suggestions }
}

// Algorithme de score viral 10x : fusionne la note de l'IA (70 %) avec
// l'analyse locale (30 %) pilier par pilier, pour un score stable et transparent.
export function computeViralScore({ aiMetrics, aiScore, analysis, reason, actionPlan, hook, cta = '', scriptText = '', keyword = '' }) {
  const local = scoreHook(hook, { cta, keyword })
  const byId = {}
  VIRAL_PILLARS.forEach(({ id }) => {
    const v = Number(aiMetrics?.[id])
    if (Number.isFinite(v) && v >= 0 && v <= 100) byId[id] = Math.round(v)
  })
  const ai = Number(aiScore)
  const hasAi = Number.isFinite(ai) && ai >= 0 && ai <= 100

  const metrics = VIRAL_PILLARS.map(({ id, label }) => {
    const localScore = local.pillars[id].score
    const aiScorePillar = byId[id] ?? (hasAi ? ai : null)
    const score =
      aiScorePillar != null ? Math.round(0.7 * aiScorePillar + 0.3 * localScore) : localScore
    return {
      id,
      label,
      score,
      max: 100,
      points: score,
      detail: local.pillars[id].insight,
      aiScore: aiScorePillar,
      localScore
    }
  })

  const score = Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length)
  const level = score >= 75 ? 'fort' : score >= 45 ? 'moyen' : 'faible'

  const aiPillars = metrics.filter((m) => m.aiScore != null)
  const finalAiScore =
    aiPillars.length > 0
      ? Math.round(aiPillars.reduce((s, m) => s + m.aiScore, 0) / aiPillars.length)
      : hasAi
        ? ai
        : null

  return {
    score,
    level,
    aiScore: finalAiScore,
    localScore: Math.round(metrics.reduce((s, m) => s + m.localScore, 0) / metrics.length),
    analysis: analysis || null,
    reason: reason || null,
    actionPlan: Array.isArray(actionPlan) && actionPlan.length ? actionPlan : null,
    metrics,
    factors: metrics,
    suggestions: local.suggestions,
    rewriteTips: local.suggestions
  }
}

export const LIGHTING_DEFAULT = [
  'Lumière principale (softbox) placée à 45° devant vous, au-dessus des yeux, pour un rendu doux.',
  'Ring Light derrière le téléphone, légèrement décalée : donne un cerceau lumineux dans les yeux.',
  'Contre-lumière LED à faible intensité (~2700K) en arrière-plan pour détacher la silhouette.',
  'Évite les ampoules de plafond en direct : elles créent des ombres dures sur le visage.'
]

export const CAMERA_DEFAULT = [
  'Gros plan face caméra, objectif au niveau des yeux (jamais en contre-plongée).',
  'Angle 0-90° : légèrement de face, haut de l’écran dégagé pour les sous-titres.',
  'Cadre poitrine-haute : assez proche pour capter les micro-expressions, 20 % d’espace au-dessus de la tête.',
  'Trépied obligatoire : tout mouvement doit être volontaire, jamais tremblant.'
]

export const BROLL_DEFAULT = [
  'Plan macro des mains en action pendant l’explication.',
  'Timelapse du processus ou du résultat final.',
  'Zoom punch-in au moment du pic émotionnel (effet zoomin).',
  'Captures d’écran de l’interface ou du produit évoqué.',
  'Cuts rapides (0,5 s max) entre les plans pour garder le rythme.'
]
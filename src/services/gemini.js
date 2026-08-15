// Appels côté client : TOUTES les requêtes passent par le proxy serveur /api/gemini/*.
// La clé API Gemini reste côté serveur et n'est jamais embarquée dans le bundle.

export const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest']
export const MAX_ATTEMPTS = 2

const NETWORK_LABELS = {
  tiktok: 'TikTok',
  reels: 'Instagram Reels',
  shorts: 'YouTube Shorts'
}

const TONE_LABELS = {
  energetic: 'Énergique / Hyper-Viral',
  educational: 'Éducatif / Posé',
  humor: 'Humour / Second degré',
  professional: 'Professionnel / Business'
}

export const SCRIPT_FORMATS = {
  hookDriven: {
    label: 'Hook + Proof',
    emoji: '🪝',
    desc: 'Accroche choc puis preuves et démonstration',
    instruction:
      "Structure : hook percutant (0-3s), promesse, preuve/raison, et CTA. Le tout scandé et direct, idéal pour le scroll-stop immédiat."
  },
  storyTime: {
    label: 'Storytime',
    emoji: '📖',
    desc: 'Narration personnelle avec cliffhanger',
    instruction:
      "Structure storytime : hook narratif, situation de départ, tension/complication, dénouement, leçon, cliffhanger. Raconte comme une histoire vraie captivante."
  },
  howTo: {
    label: 'Tutoriel / How-To',
    emoji: '🛠️',
    desc: 'Étapes concrètes et démonstration',
    instruction:
      "Structure : hook 'Comment X en Y étapes', énumère des étapes claires et actionnables, montre le résultat final, CTA. Chaque étape doit être visuelle."
  },
  listicle: {
    label: 'Liste / Listicle',
    emoji: '🔢',
    desc: 'X choses, astuces ou erreurs',
    instruction:
      "Structure : hook 'X [choses/astuces/erreurs] que [personne ne connaît / tu ignores]', liste numérotée rapide et punchy, recap final, CTA. Rythme très rapide."
  },
  mythVsFact: {
    label: 'Myth vs Fact',
    emoji: '⚖️',
    desc: 'Démystifier une croyance',
    instruction:
      "Structure : hook 'Ce que tout le monde croit à tort sur X', présente le mythe, explique pourquoi c'est faux, révèle le fait réel, apporte une preuve, CTA. Ton affirmé et expert."
  },
  beforeAfter: {
    label: 'Avant / Après',
    emoji: '🔁',
    desc: 'Transformation et contraste',
    instruction:
      "Structure : avant (situation négative), déclencheur, après (résultat positif), le 'pont' qui explique le changement, CTA. Fort contraste émotionnel."
  },
  hotTake: {
    label: 'Hot Take / Controverse',
    emoji: '🔥',
    desc: 'Opinion forte qui provoque',
    instruction:
      "Structure : hook choc 'L'avis impopulaire : [opinion forte]', arguments provocateurs mais défendables, répond aux objections, CTA. Ton confiant qui provoque le débat en commentaires."
  },
  challenge: {
    label: 'Défi / Challenge',
    emoji: '🏆',
    desc: 'Défi à relever + communauté',
    instruction:
      "Structure : hook 'Je te lance le défi de X', explique la règle, montre comment s'y prendre, invite à relever le défi et à commenter/tagger, CTA communautaire."
  }
}

export const VIDEO_DURATIONS = [15, 30, 60, 90]

export const CTA_OPTIONS = {
  follow: {
    label: 'Follow / Followers',
    emoji: '➕',
    desc: 'Gagner des abonnés'
  },
  comment: {
    label: 'Commentaire',
    emoji: '💬',
    desc: 'Lancer le débat / les questions'
  },
  save: {
    label: 'Sauvegarder',
    emoji: '🔖',
    desc: 'Inciter à enregistrer le post'
  },
  like: {
    label: 'Like / Partager',
    emoji: '❤️',
    desc: 'Fidéliser par l\'engagement'
  },
  link: {
    label: 'Lien / Lien en bio',
    emoji: '🔗',
    desc: 'Trafic vers un lien (boutique, site)'
  },
  question: {
    label: 'Question finale',
    emoji: '❓',
    desc: 'Poser une question engageante'
  }
}

const CTA_LABELS = {
  follow: 'Follow / Followers',
  comment: 'Commentaire / Débat',
  save: 'Sauvegarder le post',
  like: 'Like / Partager',
  link: 'Lien en bio',
  question: 'Question finale'
}

const AUDIENCE_EXAMPLES = {
  beginner: 'débutants qui découvrent le sujet',
  intermediate: 'personnes avec déjà une base solide',
  expert: 'experts du domaine',
  owner: 'entrepreneurs et business owners',
  student: 'étudiants',
  genz: 'Génération Z (18-25 ans)',
  parents: 'jeunes parents',
  creator: 'créateurs de contenu'
}

const MARKET_INSTRUCTIONS = {
  wa:
    "Afrique de l'Ouest (Côte d'Ivoire, Sénégal, Mali...). Adapte le vocabulaire, le ton, l'humour et les références culturelles au marché ouest-africain : expressions locales légères et crédibles (quelques touches nouchi à Abidjan, wolof à Dakar), exemples du quotidien régional (transport commun, maquis, tchoukoutou, paiement Wave / Orange Money, la sape). Le français reste compréhensible pour tous, avec juste la bonne dose de couleur locale.",
  fr:
    "France et Europe francophone. Adapte le vocabulaire, l'humour et les références culturelles au marché français/européen : expressions courantes en France, exemples ancrés dans le quotidien européen.",
  ca:
    'Canada francophone (Québec). Adapte le vocabulaire, le ton et l\'humour au marché québécois : expressions québécoises naturelles et légères, références culturelles locales, ton chaleureux et direct. Le français reste accessible.',
  us:
    "USA / International anglophone. TOUT le contenu (titre, hooks, script, captions, hashtags, analysis, rewriteTips, thumbnailPrompts) doit être rédigé EN ANGLAIS, adapté au marché américain : ton punchy, références culturelles US, expressions courantes aux USA, hashtags en anglais."
}

const MARKET_FLAGS = {
  wa: '🌍',
  fr: '🇫🇷',
  ca: '🇨🇦',
  us: '🇺🇸'
}

async function callModel(action, jsonPrompt) {
  const res = await fetch(`/api/gemini/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: jsonPrompt })
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error || `IA indisponible (${res.status})`)
  }
  return res.json()
}

export async function generateScript(network, topic, tone = 'energetic', options = {}) {
  const networkName = NETWORK_LABELS[network] || network
  const toneLabel = TONE_LABELS[tone] || TONE_LABELS.energetic
  const format = SCRIPT_FORMATS[options.format] || SCRIPT_FORMATS.hookDriven
  const duration = options.duration || 30
  const audience = options.audience || ''
  const cta = CTA_LABELS[options.cta] || CTA_LABELS.follow

  const market = options.market || 'fr'
  const marketInstruction = MARKET_INSTRUCTIONS[market] || MARKET_INSTRUCTIONS.fr
  const marketFlag = MARKET_FLAGS[market] || '🇫🇷'

  const formatSection = `
Format de script choisi : ${format.label} (${format.desc})
${format.instruction}`

  const audienceSection = audience
    ? `Public cible : ${audience}. Personnalise le vocabulaire, les références et les exemples pour CETTE audience précisément.`
    : 'Public cible : grand public, précis mais accessible.'

  const ctaSection = `Appel à l\'action (CTA) à intégrer naturellement à la fin : "${cta}". Un seul CTA clair.`

  const marketSection = `
Pays / marché cible (${marketFlag}) :
${marketInstruction}
Le vocabulaire, l'humour et les références du script doivent correspondre à CE pays précisément.`

  const prompt = `
Tu es un expert en marketing vidéo et copywriting viral pour ${networkName}.
Génère un contenu complet pour une vidéo courte sur ${networkName}.
Sujet : "${topic}"
Tonalité : "${toneLabel}"
${formatSection}
${audienceSection}
${ctaSection}
Durée cible : environ ${duration} secondes (adapte la longueur du script à cette durée).

Règles SEO vidéo numérique :
- Le mot-clé principal du sujet doit être prononcé DANS L'ACCROCHE (les 3 premières secondes) pour optimiser le référencement de recherche.
- Structure efficace : hook (0-3s) → développement → preuve/résultat → CTA fort.
- Le script dure environ ${duration} secondes, se termine par un appel à l'action unique.
- La timeline couvre tout le script, segment par segment (2 à 4 segments pour ${duration}s).

Règles de style crédible et naturel (fondamental) :
- Écris le script COMME ON PARLE à l'oral en français : phrases courtes et scandées, mots de liaison naturels ("donc", "en fait", "regarde"), silences marqués par des points de suspension.
- Inclus des power words ("jamais", "secret", "erreur", "prouvé", "immédiatement") et un pic émotionnel au moment clé.
- Ajoute UNE question rhétorique au spectateur dans la première moitié pour retenir l'attention.
- Pas de jargon marketing, pas de phrases trop longues ou "catalogue". Ça doit sonner authentique, comme une vraie prise de parole de créateur.
- Le titre : accrocheur, avec 1-2 emojis pertinents maximum, moins de 15 mots.
- Les captions sont des fragments parlés courts (3 à 6 mots) prêts pour le montage, avec le mot-clé en MAJUSCULES pour le souligner visuellement.
- Le CTA final doit être naturel et adapté au réseau (ex : sur TikTok "abonne-toi pour la partie 2", sur Reels "dis-moi en commentaire").

Réponds UNIQUEMENT en JSON valide avec cette structure exacte (pas de texte avant ou après) :
{
  "variants": [
    {
      "angle": "description courte et percutante de l'angle 1 (ex : expérience personnelle, liste d'erreurs, démythification, avant/après)",
      "title": "titre de la vidéo accrocheur avec 1-2 emojis, moins de 15 mots",
      "hook": "accroche principale percutante en moins de 15 mots incluant le mot-clé principal",
      "script": "script complet à l'oral, comme une vraie voix off naturelle, en paragraphes courts séparés par des retours à la ligne",
      "captions": ["sous-titre 1 court (3-6 mots)", "sous-titre 2", "sous-titre 3", "sous-titre 4", "sous-titre 5"],
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
      "viralScore": 87,
      "metrics": {"hookRetention": 82, "emotionalPeak": 74, "seo": 88, "ctaEfficiency": 70, "pacing": 79},
      "analysis": "analyse courte en français (2-3 phrases) du potentiel viral de CETTE variante"
    },
    { "angle": "...", "title": "...", "hook": "...", "script": "...", "captions": [...], "hashtags": [...], "viralScore": 86, "metrics": {...}, "analysis": "..." },
    { "angle": "...", "title": "...", "hook": "...", "script": "...", "captions": [...], "hashtags": [...], "viralScore": 90, "metrics": {...}, "analysis": "..." }
  ],
  "timeline": [
    {"timing": "00:00 - 00:03", "visual": "description du plan / B-roll à filmer", "audio": "texte dit en voix off à cet instant"},
    {"timing": "00:03 - 00:08", "visual": "...", "audio": "..."}
  ],
  "rewriteTips": ["réécriture ultra-précise 1 pour passer d'un 65 à un 95 (quoi changer mot à mot)", "conseil 2", "conseil 3"],
  "lighting": ["conseil d'éclairage concret 1 (placement de lumière, ring light, softbox, température)", "conseil 2"],
  "camera": ["conseil de cadrage/angle concret 1 (hauteur, angle, distance, mouvement)", "conseil 2"],
  "brolls": ["visuel / B-roll 1 à filmer ou créer au montage", "visuel 2", "visuel 3"],
  "thumbnailPrompts": ["prompt complet et très détaillé en anglais pour Midjourney DALL-E générant une miniature de couverture accrocheuse", "variante différente du premier prompt"]
}

Règles des 3 variantes (fondamental) :
- Génère EXACTEMENT 3 variantes COMPLÈTES et FILMABLES du même sujet, sur le même réseau, dans la même tonalité.
- Les 3 angles doivent être VRAIMENT différents : par exemple « expérience personnelle », « liste de 3 erreurs », « démythification / mythe vs fait », « avant/après », « hot take ».
- Chaque variante a son propre titre, sa propre accroche (différente des autres), son propre script complet d'environ ${duration} secondes, ses propres sous-titres et hashtags.
- Chaque script suit : hook percutant (0-3s) → tension → pic émotionnel → CTA unique et naturel, adapté à ${networkName}.
- Variante 1 = ton meilleur angle. Les scores et analyses sont honnêtes et DIFFÉRENCIÉS entre variantes.

Règles d'évaluation des 5 métriques (chacune sur 100, note honnête) :
- hookRetention : force de l'accroche des 3 premières secondes (curiosity gap, chiffre, promesse claire).
- emotionalPeak : intensité du pic émotionnel du script (émotion, tension, contraste avant/après, surprise).
- seo : présence du mot-clé principal dans l'accroche et cohérence du sujet (SEO TikTok/Reels/Shorts).
- ctaEfficiency : force et naturel de l'appel à l'action final (un seul CTA clair, adapté au réseau).
- pacing : rythme de lecture (phrases courtes, lisibilité à voix haute, densité par seconde adaptée à la durée).

Règles de style crédible et naturel (fondamental) :
- Écris les scripts COMME ON PARLE à l'oral en français : phrases courtes et scandées, mots de liaison naturels ("donc", "en fait", "regarde"), silences marqués par des points de suspension.
- Inclus des power words ("jamais", "secret", "erreur", "prouvé", "immédiatement") et un pic émotionnel au moment clé.
- Ajoute UNE question rhétorique au spectateur dans la première moitié pour retenir l'attention.
- Pas de jargon marketing ni de phrases "catalogue". Ça doit sonner authentique, comme une vraie prise de parole de créateur.
- Les captions sont des fragments parlés courts (3 à 6 mots) prêts pour le montage, avec le mot-clé en MAJUSCULES pour le souligner.
- Les hashtags mixent génériques et spécifiques à ${networkName}.
- rewriteTips : conseils de réécriture ultra-précis pour passer d'un score moyen (65/100) à excellent (95/100). Cite les passages à modifier et propose la reformulation exacte.
- lighting, camera, brolls : conseils de tournage concrets adaptés au format "${format.label}" et à la durée de ${duration}s.
- thumbnailPrompts : UNIQUEMENT des chaînes de caractères en anglais.
- analysis : courte et actionnable en français.
${marketSection}
`

  return callModel('script', prompt)
}

export async function analyzeHook(hook) {
  const prompt = `
Tu es un expert en marketing viral et copywriting.
Analyse cette accroche de vidéo courte : "${hook}"

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "score": 87,
  "analysis": "analyse courte en français de 2-3 phrases expliquant la note",
  "suggestions": ["amélioration 1 concrète", "amélioration 2", "amélioration 3"]
}

Règles : note sur 100, analyse honnête et utile, suggestions actionnables.
`

  return callModel('analyze', prompt)
}

export const GEMINI_VOICES = [
  { id: 'Puck', label: 'Puck', desc: 'Masculin · Énergique', emoji: '🎤' },
  { id: 'Kore', label: 'Kore', desc: 'Féminin · Ferme', emoji: '🎙️' },
  { id: 'Charon', label: 'Charon', desc: 'Masculin · Posé', emoji: '🎬' },
  { id: 'Zephyr', label: 'Zephyr', desc: 'Féminin · Clair', emoji: '🔊' },
  { id: 'Aoede', label: 'Aoede', desc: 'Féminin · Melodique', emoji: '🎵' },
  { id: 'Fenrir', label: 'Fenrir', desc: 'Masculin · Exalté', emoji: '⚡' },
  { id: 'Leda', label: 'Leda', desc: 'Féminin · Jeune', emoji: '✨' }
]

export async function synthesizeVoice(text, { voice = 'Kore', style = 'energetic' } = {}) {
  const res = await fetch('/api/gemini/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, style })
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error || `TTS failed: ${res.status}`)
  }
  return res.json()
}
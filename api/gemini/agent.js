export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = await req.json().catch(() => ({}))
  const { messages = [], trends = '' } = body

  if (!messages.length) {
    return Response.json({ error: 'Messages requis' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS?.split(',')[0]?.trim()

  if (!apiKey) {
    return Response.json({ reply: getFallbackReply(messages) }, { status: 200 })
  }

  const systemPrompt = `Tu es Post Genius, un assistant IA spécialisé dans la création de contenu viral pour les réseaux sociaux (TikTok, Instagram Reels, YouTube Shorts).
Tu parles en français, tu es concis, actionnable, et tu donnes des conseils concrets.
Tu connais les tendances actuelles, les algorithmes, les hooks viraux, et les techniques de rétention.

Tendances du moment:
${trends}

Format: réponds en 2-3 phrases max, avec des points actionnables quand c'est possible.`

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Compris, je suis Post Genius. Comment puis-je t\'aider à créer du contenu viral ?' }] },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ]

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 500 } }),
        signal: AbortSignal.timeout(15000),
      }
    )

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      console.error('Gemini error:', err)
      return Response.json({ reply: getFallbackReply(messages) }, { status: 200 })
    }

    const data = await r.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return Response.json({ reply: text || getFallbackReply(messages) })
  } catch (err) {
    console.error('Gemini fetch error:', err.message)
    return Response.json({ reply: getFallbackReply(messages) }, { status: 200 })
  }
}

function getFallbackReply(messages) {
  const last = messages[messages.length - 1]?.content?.toLowerCase() || ''
  if (last.includes('hook') || last.includes('accroche')) {
    return 'Voici 3 hooks viraux testés : 1) "Personne ne te dit ça mais..." (curiosity gap), 2) "J\'ai perdu 10K abonnés en 1 jour" (choc), 3) "Arrête de faire cette erreur" (direct). Teste-les dans les 2 premières secondes !'
  }
  if (last.includes('tiktok') || last.includes('reel')) {
    return 'Pour TikTok/Reels : rythme rapide (cut toutes les 2-3s), texte à l\'écran, musique tendance, et un hook dans la première seconde. Les meilleurs créateurs postent 2-3 fois par jour.'
  }
  if (last.includes('script') || last.includes('scénario')) {
    return 'Structure de script viral : 1) Hook (0-3s), 2) Problème (3-10s), 3) Solution (10-25s), 4) CTA (25-30s). Garde ça simple et dense.'
  }
  return 'Je suis Post Genius ! Pose-moi une question sur le contenu viral, les hooks, les stratégies TikTok/YouTube/Reels, ou le montage CapCut.'
}

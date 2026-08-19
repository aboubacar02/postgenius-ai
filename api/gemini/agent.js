import { fetchWithKeyRotation } from './_rotate.js'

export default async function handler(req) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = await req.json().catch(() => ({}))
  const { messages = [], trends = '' } = body

  if (!messages.length) {
    return Response.json({ error: 'Messages requis' }, { status: 400 })
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
    const data = await fetchWithKeyRotation({
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
    }, 'gemini-1.5-flash')

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) {
      return Response.json({ error: 'Gemini a renvoyé une réponse vide' }, { status: 502 })
    }
    return Response.json({ reply: text })
  } catch (err) {
    console.error('Gemini agent fetch error:', err.message)
    return Response.json({ error: err.message }, { status: 502 })
  }
}

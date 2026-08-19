export const config = { runtime: 'edge' }

import { fetchWithKeyRotation } from './_rotate.js'

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const body = await req.json().catch(() => ({}))
  const { hook } = body

  if (!hook || hook.trim().length < 3) {
    return Response.json({ error: 'Hook requis' }, { status: 400 })
  }

  const prompt = `Génère 5 hooks viraux de remplacement pour TikTok/Reels/Shorts à partir du hook original ci-dessous.

Hook original: « ${hook} »

Règles:
- Chaque hook doit être une phrase d'accroche différente (40 à 90 caractères)
- Couvrir ces angles : Contre-Intuitif, Secret d'Élite, Erreur Fatale, Défi 30 Jours, Urgence Psychologique
- Je veux un score viral estimé /100 et un boost en points par rapport à l'original

Réponds UNIQUEMENT en JSON valide, sans texte avant/après, au format exact:
{
  "clones": [
    { "tag": "Contre-Intuitif", "hook": "...", "score": 90, "boost": "+15 pts" },
    { "tag": "Secret d'Élite", "hook": "...", "score": 92, "boost": "+18 pts" },
    { "tag": "Erreur Fatale", "hook": "...", "score": 95, "boost": "+22 pts" },
    { "tag": "Défi 30 Jours", "hook": "...", "score": 91, "boost": "+16 pts" },
    { "tag": "Urgence Psychologique", "hook": "...", "score": 96, "boost": "+24 pts" }
  ]
}`

  try {
    const data = await fetchWithKeyRotation({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 1024, responseMimeType: 'application/json' }
    }, 'gemini-3.6-flash')

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed.clones) || parsed.clones.length === 0) {
      return Response.json({ error: 'Aucun clone généré' }, { status: 502 })
    }
    return Response.json(parsed)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 })
  }
}

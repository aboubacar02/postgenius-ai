export const config = { runtime: 'edge' }

import { fetchWithKeyRotation } from './_rotate.js'

export default async function handler(req) {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })

  const body = await req.json().catch(() => ({}))
  const { prompt } = body

  if (!prompt) return Response.json({ error: 'Prompt requis' }, { status: 400 })

  try {
    const data = await fetchWithKeyRotation({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 2048, responseMimeType: 'application/json' }
     }, 'gemini-1.5-flash')

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const parsed = JSON.parse(text)
    return Response.json(parsed)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 })
  }
}

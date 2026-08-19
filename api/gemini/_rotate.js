export async function fetchWithKeyRotation(payload, modelName = 'gemini-3.6-flash') {
  const rawKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEYS
  ].filter(Boolean)

  const keys = rawKeys.flatMap(k => String(k).split(',').map(s => s.trim())).filter(Boolean)
  const uniqueKeys = [...new Set(keys)]

  if (uniqueKeys.length === 0) {
    throw new Error('Clé Gemini manquante (aucune clé configurée dans les variables d’environnement)')
  }

  let lastError = null

  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i]
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`
      
      const headers = { 'Content-Type': 'application/json' }
      if (key.startsWith('AIza')) {
        headers['x-goog-api-key'] = key
      } else {
        headers['Authorization'] = `Bearer ${key}`
      }

      const r = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      })

      const text = await r.text().catch(() => '')
      let data = {}
      try {
        data = JSON.parse(text)
      } catch {
        data = { error: { message: text || `Erreur HTTP ${r.status}` } }
      }

      if (r.status === 429 || data.error?.code === 429 || (data.error?.message && /quota|rate limit|exhausted/i.test(data.error.message))) {
        console.warn(`Clé API Gemini n°${i + 1} épuisée (429), passage à la clé suivante...`)
        lastError = new Error(data.error?.message || 'Quota dépassé')
        continue
      }

      if (!r.ok) {
        throw new Error(data.error?.message || `Gemini error ${r.status}`)
      }

      return data
    } catch (err) {
      lastError = err
      console.error(`Échec avec la clé n°${i + 1}:`, err.message)
    }
  }

  throw new Error(lastError?.message || 'Toutes les clés API ont atteint leur limite. Veuillez patienter quelques secondes.')
}

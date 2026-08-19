// Moteur Gemini côté serveur avec ROTATION AUTOMATIQUE de clés API.
// Les clés sont fournies par la factory (jamais exposées au client). Si une clé
// atteint son quota (429 / quota exceeded / resource exhausted), le serveur
// bascule immédiatement sur la suivante, sans erreur visible pour l'utilisateur.
//
// NOTE: we use a direct REST `?key=` fetch (mirroring the Vercel Edge helpers in
// api/gemini/_rotate.js) instead of the @google/generative-ai SDK. The SDK version
// pinned in package.json (0.1.x) predates the gemini-2.x / 2.5 model families and
// throws "models/<name> is not found for API version v1beta" for those models.
// Using the raw REST endpoint sidesteps the SDK model registry entirely.
// gemini-3.6-flash is the only model available to this API key/version.
// Using gemini-1.5-flash / gemini-2.0-flash / gemini-2.5-flash returns 404 with
// "This model is no longer available... please update your code to use
// models/gemini-3.6-flash".
const MODELS = ['gemini-3.6-flash']
const MAX_ATTEMPTS = 1

// TTS_MODEL: with these API keys, gemini-3.6-flash does not return audio data
// (it ignores responseModalities:['AUDIO']). The agent widget already falls back
// to node-edge-tts when Gemini TTS yields no inlineData, so TTS is still usable.
const TTS_MODEL = 'gemini-3.6-flash'

export class QuotaExhaustedError extends Error {
  constructor(cause) {
    super('Toutes les clés IA ont atteint leur quota')
    this.name = 'QuotaExhaustedError'
    this.cause = cause
  }
}

function isQuotaError(err) {
  const msg = String(err?.message || err || '').toLowerCase()
  const status = Number(err?.status || err?.response?.status || 0)
  return (
    status === 429 ||
    status === 403 ||
    /429|quota|resource.?exhausted|rate.?limit|too many|quota exceeded/i.test(msg)
  )
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function parseKeys(raw) {
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean)
  return String(raw || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

async function callRest(key, body, modelName) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`
  const r = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(40000)
  })
  return { r, apiUrl }
}

export function createGeminiServer(rawKeys) {
  const keys = parseKeys(rawKeys)
  const available = keys.length > 0
  let cursor = 0

  const currentKey = () => keys[cursor % keys.length]
  const rotate = () => {
    cursor = (cursor + 1) % keys.length
  }

  async function callModel(jsonPrompt) {
    if (!available) throw new Error('Clé Gemini serveur manquante')

    let lastError = null

    for (let k = 0; k < keys.length; k++) {
      const key = currentKey()
      let quotaHit = false

      for (let attempt = 0; attempt < MAX_ATTEMPTS && !quotaHit; attempt++) {
        const modelName = MODELS[attempt % MODELS.length]
        try {
          const { r, apiUrl } = await callRest(key, {
            contents: [{ role: 'user', parts: [{ text: jsonPrompt }] }]
          }, modelName)

          if (!r.ok) {
            const data = await r.json().catch(() => ({}))
            const err = new Error(data?.error?.message || `Gemini error ${r.status}`)
            err.status = r.status
            throw err
          }

          const data = await r.json()
          const response = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          const cleaned = response
            .replace(/```json|```/g, '')
            .trim()
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '')
          return JSON.parse(cleaned)
        } catch (err) {
          lastError = err
          if (isQuotaError(err)) {
            quotaHit = true
            rotate()
            break
          }
          if (attempt < MAX_ATTEMPTS - 1) await sleep(400)
        }
      }

      if (!quotaHit && lastError) {
        throw lastError
      }
    }

    throw new QuotaExhaustedError(lastError)
  }

  async function generateText(prompt) {
    if (!available) throw new Error('Clé Gemini serveur manquante')

    let lastError = null

    for (let k = 0; k < keys.length; k++) {
      const key = currentKey()
      let quotaHit = false

      for (let attempt = 0; attempt < MAX_ATTEMPTS && !quotaHit; attempt++) {
        const modelName = MODELS[attempt % MODELS.length]
        try {
          const { r } = await callRest(key, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          }, modelName)

          if (!r.ok) {
            const data = await r.json().catch(() => ({}))
            const err = new Error(data?.error?.message || `Gemini error ${r.status}`)
            err.status = r.status
            throw err
          }

          const data = await r.json()
          return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        } catch (err) {
          lastError = err
          if (isQuotaError(err)) {
            quotaHit = true
            rotate()
            break
          }
          if (attempt < MAX_ATTEMPTS - 1) await sleep(400)
        }
      }

      if (!quotaHit && lastError) throw lastError
    }

    throw new QuotaExhaustedError(lastError)
  }

  async function synthesizeVoice({ text, voice = 'Kore', style = 'energetic' }) {
    if (!available) throw new Error('Clé Gemini serveur manquante')

    let lastError = null

    for (let k = 0; k < keys.length; k++) {
      const key = currentKey()
      try {
        const body = {
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice }
              }
            }
          }
        }
        const { r } = await callRest(key, body, TTS_MODEL)

        if (!r.ok) {
          const data = await r.json().catch(() => ({}))
          const err = new Error(`TTS failed: ${r.status} ${String(data?.error?.message || '')}`)
          err.status = r.status
          throw err
        }

        const json = await r.json()
        const part = json.candidates?.[0]?.content?.parts?.[0]
        if (!part?.inlineData?.data) throw new Error('TTS: aucune donnée audio')

        return { mimeType: part.inlineData.mimeType, base64: part.inlineData.data }
      } catch (err) {
        lastError = err
        if (isQuotaError(err)) {
          rotate()
          continue
        }
        throw err
      }
    }

    throw new QuotaExhaustedError(lastError)
  }

  return {
    keyCount: keys.length,
    generateContent: (prompt) => callModel(prompt),
    generateText,
    synthesizeVoice
  }
}

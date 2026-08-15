// Moteur Gemini côté serveur avec ROTATION AUTOMATIQUE de clés API.
// Les clés sont fournies par la factory (jamais exposées au client). Si une clé
// atteint son quota (429 / quota exceeded / resource exhausted), le serveur
// bascule immédiatement sur la suivante, sans erreur visible pour l'utilisateur.
import { GoogleGenerativeAI } from '@google/generative-ai'

const MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest']
const MAX_ATTEMPTS = 2

const VOICE_STYLES = {
  energetic:
    'Speak with high energy, enthusiasm and excitement, like a top YouTube creator making a hook. Use dynamic intonation, short pauses after key words and a smile in your voice.',
  educational:
    'Speak calmly, clearly and pedagogically, with a confident and reassuring tone, natural rhythm and moderate pace.',
  humor:
    'Speak in a playful, funny and light-hearted tone, with sarcasm and comedic timing, natural pauses for laughs.',
  professional:
    'Speak in a polished, professional and authoritative business tone, confident and measured, with natural pacing.'
}

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
    /429|quota|resource.?exhausted|rate.?limit|too many/i.test(msg)
  )
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function parseKeys(raw) {
  return String(raw || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
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
      const genAI = new GoogleGenerativeAI(key)
      let quotaHit = false

      for (let attempt = 0; attempt < MAX_ATTEMPTS && !quotaHit; attempt++) {
        const model = genAI.getGenerativeModel({ model: MODELS[attempt % MODELS.length] })
        try {
          const result = await model.generateContent(jsonPrompt)
          const response = result.response.text()
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
        // Erreur non liée au quota (modèle, JSON…) : pas la peine d'épuiser
        // toutes les clés, on remonte l'erreur directement.
        throw lastError
      }
    }

    throw new QuotaExhaustedError(lastError)
  }

  async function synthesizeVoice({ text, voice = 'Kore', style = 'energetic' }) {
    if (!available) throw new Error('Clé Gemini serveur manquante')

    const styleInstruction = VOICE_STYLES[style] || VOICE_STYLES.energetic
    const styledText = `${styleInstruction} TTS the following text naturally:\n\n${text}`
    let lastError = null

    for (let k = 0; k < keys.length; k++) {
      const key = currentKey()
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: styledText }] }],
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice }
                  }
                }
              }
            })
          }
        )

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          const err = new Error(
            `TTS failed: ${res.status} ${String(body?.error?.message || '')}`
          )
          err.status = res.status
          throw err
        }

        const json = await res.json()
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
    synthesizeVoice
  }
}

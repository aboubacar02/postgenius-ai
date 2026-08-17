// Proxy serveur vers Gemini : la clé API reste côté serveur, avec rate-limiting
// et limites de taille pour empêcher l'abus par un tiers.
import { createGeminiServer, QuotaExhaustedError } from '../server/gemini.mjs'
import { loadServerEnv } from '../server/env.mjs'

const WINDOW_MS = 60_000
const LIMITS = { script: 6, analyze: 12, tts: 5, agent: 10 }
const MAX_PROMPT = 30000
const MAX_TEXT = 6000
const MAX_BODY = 128 * 1024

const AGENT_SYSTEM_PROMPT = `Tu es le "Post AI Agent", l'assistant virtuel officiel de PostGenius AI, une application qui génère des scripts viraux pour vidéos courtes (TikTok, Instagram Reels, YouTube Shorts) grâce à l'IA.

Règles de conduite :
- Commence TOUJOURS ta première réponse par : "Bonjour, bienvenue sur Post AI, comment puis-je vous aider ?"
- Réponds en français par défaut, sauf si l'utilisateur écrit dans une autre langue (réponds alors dans cette langue).
- Réponds de façon concise, chaleureuse et utile (2 à 5 phrases, format court avec éventuellement une liste).
- Tu connais parfaitement l'application PostGenius AI :
  * Générateur de scripts : l'utilisateur décrit un sujet, choisit réseau (TikTok/Reels/Shorts), ton, format, marché et durée. L'IA produit 3 variantes avec hooks, script, sous-titres, hashtags, timeline, score viral et fiche de tournage.
  * Crédits : les comptes gratuits (Starter) ont quelques crédits par jour (généralement 5). Pro = 20 scripts/jour, Studio = scripts illimités. Ils se réinitialisent chaque jour.
  * Score viral : outil qui analyse un hook et donne une note sur 100 selon 5 piliers (rétention 3s, pic émotionnel, SEO, CTA, rythme).
  * Tendances : analyses des niches et des meilleurs horaires de publication.
  * Paiement : mobile money (Wave, Orange Money, MTN MoMo) en FCFA pour l'Afrique de l'Ouest, ou carte bancaire / PayPal en EUR/USD. La devise est détectée automatiquement selon le pays.
- Si l'utilisateur demande une aide sur une fonctionnalité précise, donne-lui des instructions claires et étape par étape.
- Ne prétends jamais avoir exécuté une action dans l'application (tu es un assistant conversationnel, pas un moteur d'exécution).
- Si tu ne sais pas, propose de consulter les paramètres ou de recontacter le support.

Historique de la conversation (dernier message en premier) :
`

function readJsonBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBytes) {
        reject(new Error('Corps trop volumineux'))
        req.destroy()
        return
      }
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('JSON invalide'))
      }
    })
    req.on('error', reject)
  })
}

export default function geminiProxy() {
  const env = loadServerEnv()
  // Collecte exhaustive de toutes les clés disponibles pour la rotation transparente
  const keyList = [
    env.GEMINI_API_KEYS,
    env.GEMINI_API_KEY,
    env.VITE_GEMINI_API_KEY,
    env.VITE_GEMINI_KEY_1,
    env.VITE_GEMINI_KEY_2,
    env.VITE_GEMINI_KEY_3,
    env.VITE_GEMINI_KEY_4,
    env.VITE_GEMINI_KEY_5,
    env.GEMINI_KEY_1,
    env.GEMINI_KEY_2,
    env.GEMINI_KEY_3,
    env.GEMINI_KEY_4,
    env.GEMINI_KEY_5
  ]
    .filter(Boolean)
    .flatMap((k) => String(k).split(','))
    .map((k) => k.trim())
    .filter(Boolean)

  const server = createGeminiServer(keyList)
  const hits = new Map()

  function limited(ip, action) {
    const now = Date.now()
    const entry = hits.get(ip) || {}
    const fresh = (entry[action] || []).filter((t) => now - t < WINDOW_MS)
    if (fresh.length >= LIMITS[action]) {
      entry[action] = fresh
      hits.set(ip, entry)
      return true
    }
    fresh.push(now)
    entry[action] = fresh
    hits.set(ip, entry)
    return false
  }

  function send(res, status, data) {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }

  return {
    name: 'gemini-proxy',
    configureServer(devServer) {
      devServer.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/gemini/')) return next()
        if (req.method !== 'POST') return send(res, 405, { error: 'POST requis' })

        const action = req.url.split('/')[3]
        if (!LIMITS[action]) return send(res, 404, { error: 'Action inconnue' })

        const ip = req.socket.remoteAddress || 'unknown'
        if (limited(ip, action)) {
          return send(res, 429, { error: 'Trop de requêtes — réessaie dans une minute' })
        }

        let body
        try {
          body = await readJsonBody(req, MAX_BODY)
        } catch {
          return send(res, 400, { error: 'Requête invalide' })
        }

        try {
          if (action === 'script' || action === 'analyze') {
            const prompt = String(body.prompt || '')
            if (!prompt || prompt.length > MAX_PROMPT) {
              return send(res, 400, { error: 'Prompt trop long' })
            }
            const data = await server.generateContent(prompt)
            return send(res, 200, data)
          }
          if (action === 'tts') {
            const text = String(body.text || '')
            if (!text || text.length > MAX_TEXT) {
              return send(res, 400, { error: 'Texte trop long' })
            }
            const data = await server.synthesizeVoice({ text, voice: body.voice, style: body.style })
            return send(res, 200, data)
          }
          if (action === 'agent') {
            const messages = Array.isArray(body.messages) ? body.messages : []
            const trends = String(body.trends || '').trim()
            const transcript = messages
              .slice(-20)
              .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Agent'} : ${String(m.content || '')}`)
              .join('\n')
            if (transcript.length > MAX_PROMPT) {
              return send(res, 400, { error: 'Conversation trop longue' })
            }
            const context = `${AGENT_SYSTEM_PROMPT}${
              trends ? `\nTendances du moment (à mobiliser pour tes conseils) :\n${trends}\n` : ''
            }`
            const data = await server.generateText(
              `${context}\n${transcript}\n\nAgent :`
            )
            return send(res, 200, { reply: data })
          }
          return send(res, 404, { error: 'Action inconnue' })
        } catch (err) {
          console.error('Gemini proxy error:', err.message || err)
          if (err instanceof QuotaExhaustedError) {
            return send(res, 429, {
              error: 'Quota IA atteint sur toutes les clés — réessaie dans quelques instants'
            })
          }
          return send(res, 502, { error: 'IA indisponible, réessaie dans quelques secondes' })
        }
      })
    }
  }
}

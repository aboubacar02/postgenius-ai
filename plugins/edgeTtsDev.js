import { synthesize } from '../server/edgeTts.mjs'

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        resolve({})
      }
    })
  })
}

export default function edgeTtsDevPlugin() {
  return {
    name: 'edge-tts-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/tts')) return next()

        const body = await readJsonBody(req)
        const url = new URL(req.url, 'http://localhost')
        const text = body.text || url.searchParams.get('text') || ''
        const voice = body.voice || url.searchParams.get('voice')
        const lang = body.lang || url.searchParams.get('lang') || 'fr-FR'

        if (!text) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Le texte est requis' }))
          return
        }

        if (text.length > 5000) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Texte trop long (5000 caractères max)' }))
          return
        }

        try {
          const audio = await synthesize(text, voice, lang)
          res.statusCode = 200
          res.setHeader('Content-Type', 'audio/mpeg')
          res.setHeader('Content-Length', audio.length)
          res.setHeader('Cache-Control', 'public, max-age=3600')
          res.end(audio)
        } catch (err) {
          console.error('Edge TTS dev error:', err.message || err)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Synthèse vocale indisponible', detail: String(err.message || err) }))
        }
      })
    }
  }
}
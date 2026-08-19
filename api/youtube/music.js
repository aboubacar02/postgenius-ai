export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || 'trending music 2025 viral'
  const max = Math.min(parseInt(url.searchParams.get('max') || '12', 10), 24)
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey || !apiKey.startsWith('AIza')) {
    return Response.json({ error: 'YouTube Music non disponible (clé API manquante).', items: [] }, { status: 200 })
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&videoCategoryId=10&maxResults=${max}&relevanceLanguage=fr&key=${apiKey}`

    const r = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      return Response.json({ error: err?.error?.message || `YouTube error ${r.status}`, items: [] }, { status: 200 })
    }

    const data = await r.json()

    const ids = (data.items || []).map((v) => v.id.videoId).filter(Boolean)

    let viewMap = {}
    if (ids.length > 0) {
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids.join(',')}&key=${apiKey}`
      const sr = await fetch(statsUrl, { signal: AbortSignal.timeout(8000) })
      if (sr.ok) {
        const stats = await sr.json()
        for (const s of stats.items || []) {
          viewMap[s.id] = {
            views: parseInt(s.statistics?.viewCount || '0', 10),
            duration: parseDuration(s.contentDetails?.duration)
          }
        }
      }
    }

    const items = (data.items || []).map((v) => {
      const id = v.id.videoId
      const info = viewMap[id] || {}
      return {
        id,
        youtubeId: id,
        title: v.snippet?.title || 'Sans titre',
        channel: v.snippet?.channelTitle || 'Inconnu',
        thumbnail: v.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
        views: formatViews(info.views),
        duration: info.duration || null,
        publishedAt: v.snippet?.publishedAt ? timeAgo(new Date(v.snippet.publishedAt)) : null,
      }
    })

    return Response.json({ live: true, items }, { status: 200 })
  } catch (err) {
    return Response.json({ error: err.message, items: [] }, { status: 200 })
  }
}

function parseDuration(iso) {
  if (!iso) return null
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return null
  const h = parseInt(m[1] || '0', 10)
  const min = parseInt(m[2] || '0', 10)
  const s = parseInt(m[3] || '0', 10)
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${min}:${String(s).padStart(2, '0')}`
}

function formatViews(n) {
  if (!n) return ''
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}Md`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return "à l'instant"
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `il y a ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `il y a ${days}j`
  return `il y a ${Math.floor(days / 30)} mois`
}

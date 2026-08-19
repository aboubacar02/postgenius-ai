export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')
  const max = Math.min(parseInt(url.searchParams.get('max') || '12', 10), 24)
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey || !apiKey.startsWith('AIza')) {
    return Response.json({ live: false, items: [], error: 'YouTube Search non disponible (clé API manquante). Utilise Pexels en alternative.' }, { status: 200 })
  }

  if (!q || q.trim().length < 2) {
    return Response.json({ live: true, items: [] }, { status: 200 })
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=${max}&relevanceLanguage=fr&key=${apiKey}`

    const r = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      return Response.json(
        { live: false, items: [], error: err?.error?.message || `YouTube API error ${r.status}` },
        { status: 200 }
      )
    }

    const data = await r.json()

    const ids = (data.items || []).map((v) => v.id.videoId).filter(Boolean)

    let viewMap = {}
    if (ids.length > 0) {
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids.join(',')}&key=${apiKey}`
      const sr = await fetch(statsUrl, { signal: AbortSignal.timeout(8000) })
      if (sr.ok) {
        const stats = await sr.json()
        for (const s of stats.items || []) {
          viewMap[s.id] = parseInt(s.statistics?.viewCount || '0', 10)
        }
      }
    }

    const items = (data.items || []).map((v) => {
      const id = v.id.videoId
      const views = viewMap[id] || 0
      return {
        id,
        youtubeId: id,
        title: v.snippet?.title || 'Sans titre',
        channel: v.snippet?.channelTitle || 'Inconnu',
        thumbnail: v.snippet?.thumbnails?.medium?.url || v.snippet?.thumbnails?.default?.url || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
        views: formatViews(views),
        duration: null,
        publishedAt: v.snippet?.publishedAt
          ? timeAgo(new Date(v.snippet.publishedAt))
          : null,
      }
    })

    return Response.json({ live: true, items }, { status: 200 })
  } catch (err) {
    return Response.json(
      { live: false, items: [], error: `Erreur réseau: ${err.message}` },
      { status: 200 }
    )
  }
}

function formatViews(n) {
  if (!n) return ''
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}Md vues`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M vues`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K vues`
  return `${n} vues`
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
  const months = Math.floor(days / 30)
  return `il y a ${months} mois`
}

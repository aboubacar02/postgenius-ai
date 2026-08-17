// Recherche de vidéos via l'API YouTube Data v3.
// La clé YOUTUBE_API_KEY reste côté serveur : elle n'est jamais embarquée dans le
// bundle front. Sans clé, le serveur retourne { live: false, items: [] } et
// l'interface bascule sur les vidéos de démonstration locales.
export function createYoutubeServer(env) {
  const apiKey = String(env.YOUTUBE_API_KEY || env.VITE_YOUTUBE_API_KEY || '').trim()
  const live = apiKey.length > 0

  async function search({ q, maxResults = 12 }) {
    if (!live) return { live: false, items: [] }

    // Forcer le filtre création de contenu si non présent
    const query = String(q || '').trim()
    const enrichedQuery = /tutoriel|créat|tiktok|shorts|reels/i.test(query)
      ? query
      : `${query} tutoriel création de contenu TikTok reels`

    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'video')
    url.searchParams.set('q', enrichedQuery)
    url.searchParams.set('maxResults', String(Math.min(Number(maxResults) || 12, 20)))
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString())
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `YouTube API: ${res.status}`)
    }

    const json = await res.json()
    const items = (json.items || [])
      .filter((it) => it?.id?.videoId && it?.snippet)
      .map((it) => ({
        id: it.id.videoId,
        youtubeId: it.id.videoId,
        title: it.snippet.title,
        channel: it.snippet.channelTitle,
        poster: it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.default?.url || '',
        publishedAt: it.snippet.publishedAt || null
      }))

    return { live: true, items }
  }

  return { live, search }
}

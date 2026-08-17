// Selection d'images et videos B-roll pour les videos sans visage.
// Avec PEXELS_API_KEY : recherche reelle d'images/videos libres de droits en portrait.
// Sans clé : repli Picsum (images reelles libres) pour que la demo fonctionne.
// La clé reste toujours côté serveur.
export function createBrollServer(env) {
  const pexelsKey = String(env.PEXELS_API_KEY || '').trim()
  const live = pexelsKey.length > 0

  const slug = (s) =>
    String(s || 'b-roll')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'b-roll'

  async function broll({ q }) {
    const keyword = String(q || 'b-roll').slice(0, 80)
    if (!live) {
      return { live: false, keyword, url: `https://picsum.photos/seed/${slug(keyword)}/720/1280` }
    }

    const url = new URL('https://api.pexels.com/v1/search')
    url.searchParams.set('query', keyword)
    url.searchParams.set('per_page', '5')
    url.searchParams.set('orientation', 'portrait')
    url.searchParams.set('size', 'large')

    const res = await fetch(url.toString(), { headers: { Authorization: pexelsKey } })
    if (!res.ok) throw new Error(`Pexels API: ${res.status}`)
    const json = await res.json()
    const photo = json.photos?.[0]
    if (!photo) return { live: true, keyword, url: null }

    return {
      live: true,
      keyword,
      url: photo.src?.large || photo.src?.original || null,
      credit: photo.photographer || null
    }
  }

  async function brollVideo({ q }) {
    const keyword = String(q || 'b-roll').slice(0, 80)
    if (!live) {
      return { live: false, keyword, videoUrl: null, imageUrl: `https://picsum.photos/seed/${slug(keyword)}/720/1280` }
    }

    const url = new URL('https://api.pexels.com/videos/search')
    url.searchParams.set('query', keyword)
    url.searchParams.set('per_page', '3')
    url.searchParams.set('orientation', 'portrait')
    url.searchParams.set('size', 'medium')

    const res = await fetch(url.toString(), { headers: { Authorization: pexelsKey } })
    if (!res.ok) throw new Error(`Pexels Videos API: ${res.status}`)
    const json = await res.json()
    const video = json.videos?.[0]
    if (!video) {
      // Fallback to image search
      const imgResult = await broll({ q: keyword })
      return { live: true, keyword, videoUrl: null, imageUrl: imgResult.url, credit: imgResult.credit }
    }

    // Pick best MP4 file (HD if available, otherwise the largest)
    const files = video.video_files || []
    const mp4s = files.filter((f) => f.file_type === 'video/mp4')
    const sorted = mp4s.sort((a, b) => (b.height || 0) - (a.height || 0))
    const best = sorted[0] || mp4s[0] || files[0]

    return {
      live: true,
      keyword,
      videoUrl: best?.link || null,
      imageUrl: video.image || null,
      duration: video.duration || null,
      credit: video.user?.name || null
    }
  }

  return { live, broll, brollVideo }
}

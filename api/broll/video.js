export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || 'nature'
  const pexelsKey = process.env.PEXELS_API_KEY

  if (!pexelsKey || pexelsKey === 'ta_cle_pexels_api_key') {
    return Response.json({ live: false, keyword: q, videoUrl: null, imageUrl: null })
  }

  try {
    const r = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=1&orientation=portrait`,
      { headers: { Authorization: pexelsKey }, signal: AbortSignal.timeout(8000) }
    )
    if (!r.ok) throw new Error(`Pexels ${r.status}`)
    const data = await r.json()
    const video = data.videos?.[0]
    if (video) {
      const bestFile = (video.video_files || [])
        .sort((a, b) => (b.width || 0) - (a.width || 0))[0]
      return Response.json({
        live: true,
        keyword: q,
        videoUrl: bestFile?.link || null,
        imageUrl: video.image || video.video_pictures?.[0]?.picture || null
      })
    }
    return Response.json({ live: false, keyword: q, videoUrl: null, imageUrl: null })
  } catch {
    return Response.json({ live: false, keyword: q, videoUrl: null, imageUrl: null })
  }
}

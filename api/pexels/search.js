export const config = { runtime: 'edge' }

export default async function handler(req) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')
  const perPage = Math.min(parseInt(url.searchParams.get('per_page') || '8', 10), 20)
  const apiKey = process.env.PEXELS_API_KEY

  if (!apiKey || apiKey === 'ta_cle_pexels_api_key') {
    return Response.json({ error: 'Clé Pexels non configurée', items: [] }, { status: 500 })
  }

  if (!q || q.trim().length < 2) {
    return Response.json({ items: [] }, { status: 200 })
  }

  try {
    const r = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=${perPage}&orientation=portrait`,
      {
        headers: { Authorization: apiKey },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!r.ok) {
      return Response.json({ error: `Pexels API error ${r.status}`, items: [] }, { status: r.status })
    }

    const data = await r.json()
    const items = (data.videos || []).map((v) => ({
      id: v.id,
      url: v.url,
      thumbnail: v.image || v.video_pictures?.[0]?.picture || null,
      duration: v.duration || 0,
      width: v.width,
      height: v.height,
      src: v.video_files?.sort((a, b) => (b.width || 0) - (a.width || 0))?.[0]?.link || v.video_pictures?.[0]?.picture || null,
    }))

    return Response.json({ items }, { status: 200 })
  } catch (err) {
    return Response.json({ error: err.message, items: [] }, { status: 502 })
  }
}

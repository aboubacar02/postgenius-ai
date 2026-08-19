export const config = { runtime: 'edge' }

const FALLBACK = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1080&auto=format&fit=crop&q=80',
]

function getFallback(keyword = '') {
  let hash = 0
  for (let i = 0; i < keyword.length; i++) hash = keyword.charCodeAt(i) + ((hash << 5) - hash)
  return FALLBACK[Math.abs(hash) % FALLBACK.length]
}

const slug = (s) =>
  String(s || 'b-roll')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'b-roll'

export default async function handler(req) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || 'nature'
  const pexelsKey = process.env.PEXELS_API_KEY

  if (!pexelsKey || pexelsKey === 'ta_cle_pexels_api_key') {
    return Response.json({ live: false, keyword: q, url: `https://picsum.photos/seed/${slug(q)}/720/1280` })
  }

  try {
    const r = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: pexelsKey }, signal: AbortSignal.timeout(8000) }
    )
    if (!r.ok) throw new Error(`Pexels ${r.status}`)
    const data = await r.json()
    const photo = data.photos?.[0]
    if (photo) {
      return Response.json({ live: true, keyword: q, url: photo.src?.large2x || photo.src?.large || photo.src?.original })
    }
    return Response.json({ live: false, keyword: q, url: getFallback(q) })
  } catch {
    return Response.json({ live: false, keyword: q, url: getFallback(q) })
  }
}

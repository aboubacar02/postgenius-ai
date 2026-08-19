// Recherche YouTube côté client via le proxy serveur /api/youtube/search.
// La clé YOUTUBE_API_KEY reste côté serveur et n'est jamais embarquée dans le bundle.
export async function searchYoutube(q, max = 12, lang = 'fr') {
  const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&max=${max}&lang=${lang}`)
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error || `YouTube indisponible (${res.status})`)
  }
  return res.json().catch(() => null)
}

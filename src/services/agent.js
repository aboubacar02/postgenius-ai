// Appels côté client vers le Post AI Agent via le proxy serveur /api/gemini/agent.
import { NICHES } from '../lib/niches'

function buildTrendContext() {
  const hourKey = Math.floor(Date.now() / 3_600_000)
  const list = []
  for (let i = 0; i < NICHES.length; i++) {
    const niche = NICHES[(hourKey + i) % NICHES.length]
    const idea = niche.ideas[Math.abs(hourKey * 7 + i * 3) % niche.ideas.length]
    list.push(`${niche.emoji} ${niche.name} : ${idea}`)
  }
  return list.join('\n')
}

export async function chatWithAgent(messages) {
  try {
    const res = await fetch('/api/gemini/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, trends: buildTrendContext() })
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail.error || `Agent indisponible (${res.status})`)
    }
    const data = await res.json().catch(() => ({}))
    return String(data.reply || '').trim()
  } catch (err) {
    console.error('Agent error:', err.message)
    throw new Error('L\'assistant est temporairement indisponible. Réessaie plus tard.')
  }
}

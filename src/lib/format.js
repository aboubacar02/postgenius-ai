export function networkLabel(network) {
  if (network === 'tiktok') return 'TikTok'
  if (network === 'reels') return 'Instagram Reels'
  if (network === 'shorts') return 'YouTube Shorts'
  return network
}

export function networkBadgeClass(network) {
  if (network === 'tiktok')
    return 'bg-primary-10 text-primary border-primary-30'
  if (network === 'reels')
    return 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/25'
  if (network === 'shorts')
    return 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/25'
  return 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/25'
}

export function viralBadgeClass(score) {
  return score >= 90
    ? 'text-tertiary border-tertiary/25 bg-primary-10'
    : 'text-primary border-primary-30 bg-background-70'
}

export function formatLabel(format) {
  const labels = {
    'hook-histoire': 'Hook + Histoire',
    tutoriel: 'Tutoriel pas-à-pas',
    liste: 'Liste / Top',
    'avant-apres': 'Avant / Après',
    'question-reponse': 'Question / Réponse'
  }
  return labels[format] ?? format
}

export function scoreLevel(score) {
  return score >= 75 ? 'fort' : score >= 45 ? 'moyen' : 'faible'
}

export function scoreColorClass(score) {
  const level = scoreLevel(score)
  return level === 'fort' ? 'text-success' : level === 'moyen' ? 'text-warning' : 'text-destructive'
}

export function scoreBgClass(score) {
  const level = scoreLevel(score)
  return level === 'fort'
    ? 'bg-success-10 text-success border-success-20'
    : level === 'moyen'
      ? 'bg-warning-10 text-warning border-warning-20'
      : 'bg-destructive-10 text-destructive border-destructive-20'
}

export function formatRelativeDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "à l'instant"
  if (diffHours < 24) return `il y a ${diffHours}h`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function initialsOf(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
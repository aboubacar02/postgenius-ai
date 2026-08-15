import { FORMATS, NETWORKS, type Format, type Network } from '@/lib/mock-data'

export function networkLabel(network: Network) {
  return NETWORKS.find((n) => n.value === network)?.label ?? network
}

export function formatLabel(format: Format) {
  return FORMATS.find((f) => f.value === format)?.label ?? format
}

export function scoreLevel(score: number): 'faible' | 'moyen' | 'fort' {
  return score >= 75 ? 'fort' : score >= 45 ? 'moyen' : 'faible'
}

export function scoreColorClass(score: number) {
  const level = scoreLevel(score)
  return level === 'fort' ? 'text-success' : level === 'moyen' ? 'text-warning' : 'text-destructive'
}

export function scoreBgClass(score: number) {
  const level = scoreLevel(score)
  return level === 'fort'
    ? 'bg-success/10 text-success border-success/20'
    : level === 'moyen'
      ? 'bg-warning/10 text-warning border-warning/20'
      : 'bg-destructive/10 text-destructive border-destructive/20'
}

export function formatRelativeDate(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "à l'instant"
  if (diffHours < 24) return `il y a ${diffHours}h`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

'use client'

import { toast } from 'sonner'
import {
  Copy,
  Download,
  Gauge,
  Hash,
  ImageIcon,
  ListVideo,
  RefreshCw,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import type { GeneratedScript } from '@/lib/generator'
import { scoreBgClass } from '@/lib/format'
import { cn } from '@/lib/utils'

function copy(text: string, label: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${label} copié`))
    .catch(() => toast.error('Impossible de copier'))
}

export function ResultsPanel({
  result,
  loading,
  onRegenerate,
}: {
  result: GeneratedScript | null
  loading: boolean
  onRegenerate: () => void
}) {
  if (loading) {
    return (
      <Card className="border-border bg-card/60">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-foreground">Génération en cours…</p>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            L’IA rédige votre hook, votre script et votre timeline.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Empty className="rounded-xl border border-dashed border-border bg-card/40">
        <EmptyMedia variant="icon">
          <Sparkles />
        </EmptyMedia>
        <EmptyTitle>Aucun script pour l&apos;instant</EmptyTitle>
        <EmptyDescription>
          Remplissez le formulaire et cliquez sur &quot;Générer le scénario&quot; pour voir le
          résultat ici.
        </EmptyDescription>
      </Empty>
    )
  }

  const fullScript = result.script.join('\n\n')

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border bg-card/60">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Titre suggéré
            </span>
            <CardTitle className="text-balance font-heading text-lg leading-snug">
              {result.title}
            </CardTitle>
          </div>
          <div
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
              scoreBgClass(result.viralScore),
            )}
          >
            <Gauge className="size-3" />
            <span className="font-mono">{result.viralScore}</span>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border bg-card/60">
        <CardHeader>
          <CardTitle className="text-sm">Hooks alternatifs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {result.hooks.map((hook, i) => (
            <div
              key={hook}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
            >
              <span className="mt-0.5 font-mono text-xs font-medium text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="flex-1 text-sm leading-relaxed text-foreground">{hook}</p>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Copier ce hook"
                onClick={() => copy(hook, 'Hook')}
              >
                <Copy />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Script complet</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => copy(fullScript, 'Script')}>
            <Copy data-icon="inline-start" />
            Copier
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {result.script.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">
              {line}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ListVideo className="size-4 text-primary" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 font-mono text-[11px] uppercase text-muted-foreground">
                  Temps
                </TableHead>
                <TableHead className="text-[11px] uppercase text-muted-foreground">
                  Séquence
                </TableHead>
                <TableHead className="text-[11px] uppercase text-muted-foreground">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.timeline.map((row) => (
                <TableRow key={row.time}>
                  <TableCell className="font-mono text-xs text-primary">{row.time}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {row.section}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-border bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Hash className="size-4 text-primary" />
              Hashtags
            </CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copier les hashtags"
              onClick={() => copy(result.hashtags.join(' '), 'Hashtags')}
            >
              <Copy />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {result.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Sous-titres</CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copier les sous-titres"
              onClick={() => copy(result.subtitles.join('\n'), 'Sous-titres')}
            >
              <Copy />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {result.subtitles.slice(0, 5).map((line, i) => (
              <p key={i} className="truncate text-xs text-muted-foreground">
                <span className="font-mono text-primary">{String(i + 1).padStart(2, '0')}</span>{' '}
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ImageIcon className="size-4 text-primary" />
            Vignettes d&apos;invite
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {result.thumbnailPrompts.map((prompt, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-3"
            >
              <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/30 text-muted-foreground">
                <ImageIcon className="size-5" />
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {prompt}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="self-start"
                onClick={() => copy(prompt, 'Invite')}
              >
                <Copy data-icon="inline-start" />
                Copier l&apos;invite
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-wrap items-center gap-2.5">
        <Button onClick={() => copy(fullScript, 'Script')}>
          <Copy data-icon="inline-start" />
          Copier le script
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob([fullScript], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'script-postgenius.txt'
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download data-icon="inline-start" />
          Télécharger
        </Button>
        <Button
          variant="outline"
          onClick={() => toast('Génération audio simulée — bientôt disponible.')}
        >
          <Volume2 data-icon="inline-start" />
          Audio
        </Button>
        <Button variant="outline" onClick={onRegenerate}>
          <RefreshCw data-icon="inline-start" />
          Régénérer
        </Button>
      </div>
    </div>
  )
}

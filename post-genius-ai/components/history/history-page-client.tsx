'use client'

import { useMemo, useState } from 'react'
import { Search, Download, Copy, RotateCcw, Trash2, FolderOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { HISTORY_ITEMS, NETWORKS, type Network } from '@/lib/mock-data'
import { formatLabel, formatRelativeDate, networkLabel, scoreBgClass } from '@/lib/format'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ALL: Network | 'all' = 'all'

export function HistoryPageClient() {
  const [query, setQuery] = useState('')
  const [network, setNetwork] = useState<Network | 'all'>(ALL)

  const filtered = useMemo(() => {
    return HISTORY_ITEMS.filter((item) => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase())
      const matchesNetwork = network === 'all' || item.network === network
      return matchesQuery && matchesNetwork
    })
  }, [query, network])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Bibliothèque
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance font-heading md:text-4xl">
          Historique des créations
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Retrouve, régénère ou exporte tous les scripts que tu as générés.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:max-w-sm">
          <InputGroupInput
            placeholder="Rechercher un script…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setNetwork('all')}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              network === 'all'
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground',
            )}
          >
            Tous
          </button>
          {NETWORKS.map((n) => (
            <button
              key={n.value}
              onClick={() => setNetwork(n.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                network === n.value
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground',
              )}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty className="border border-dashed border-border/60 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>Aucun résultat</EmptyTitle>
            <EmptyDescription>Essaie un autre terme de recherche ou un autre réseau.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="border-border/60 bg-card/60 transition-colors hover:border-border">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {networkLabel(item.network)}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {formatLabel(item.format)}
                    </Badge>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 font-mono text-xs font-medium',
                        scoreBgClass(item.score),
                      )}
                    >
                      {item.score}/100
                    </span>
                  </div>
                  <h3 className="text-sm font-medium leading-snug text-balance">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{item.duration}s</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatRelativeDate(item.createdAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.hashtags.slice(0, 2).join(' ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(item.title)
                            toast.success('Titre copié')
                          }}
                        >
                          <Copy />
                          <span className="sr-only">Copier</span>
                        </Button>
                      }
                    />
                    <TooltipContent>Copier le titre</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast.success('Export lancé (démo)')}
                        >
                          <Download />
                          <span className="sr-only">Télécharger</span>
                        </Button>
                      }
                    />
                    <TooltipContent>Télécharger</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast.success('Régénération lancée (démo)')}
                        >
                          <RotateCcw />
                          <span className="sr-only">Régénérer</span>
                        </Button>
                      }
                    />
                    <TooltipContent>Régénérer</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => toast('Suppression (démo, non persistée)')}
                        >
                          <Trash2 />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      }
                    />
                    <TooltipContent>Supprimer</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

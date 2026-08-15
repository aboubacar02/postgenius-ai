import { useMemo, useState } from 'react'
import { Search, Download, Copy, RotateCcw, Trash2, FolderOpen } from 'lucide-react'
import { Input } from '../components/ui/input'
import { InputGroup, InputGroupAddon } from '../components/ui/input-group'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '../components/ui/empty'
import { Tooltip } from '../components/ui/tooltip'
import { VideoThumb } from '../components/media/video-thumb'
import { NETWORKS, MARKETS } from '../lib/mock-data'
import {
  formatLabel,
  formatRelativeDate,
  networkLabel,
  networkBadgeClass,
  viralBadgeClass
} from '../lib/format'
import { toast } from '../components/ui/sonner'
import { cn } from '../lib/utils'
import { useApp } from '../lib/app-context'
import { copyText, downloadText } from '../lib/copy'

const ALL = 'all'
const PAGE_SIZE = 6

export default function HistoryPage() {
  const { history, historyLoading, generate, removeHistoryItem } = useApp()
  const [query, setQuery] = useState('')
  const [network, setNetwork] = useState(ALL)
  const [limit, setLimit] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase())
      const matchesNetwork = network === ALL || item.network === network
      return matchesQuery && matchesNetwork
    })
  }, [query, network, history])

  const visible = filtered.slice(0, limit)

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-16 pt-6 sm:px-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Bibliothèque
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Historique des créations
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Retrouve, régénère ou exporte tous les scripts que tu as générés.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:max-w-sm">
          <Input
            placeholder="Rechercher un script…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon className="pointer-events-none absolute right-2.5">
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setNetwork(ALL)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              network === ALL
                ? 'border-primary-40 bg-primary-10 text-primary'
                : 'border-border text-muted-foreground hover:border-foreground-20 hover:text-foreground'
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
                  ? 'border-primary-40 bg-primary-10 text-primary'
                  : 'border-border text-muted-foreground hover:border-foreground-20 hover:text-foreground'
              )}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {historyLoading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="glass">
              <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="h-20 w-12 rounded-lg" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Empty className="border border-dashed border-border-60 py-16">
          <EmptyHeader>
            <EmptyMedia>
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>{history.length === 0 ? 'Aucune création pour l’instant' : 'Aucun résultat'}</EmptyTitle>
            <EmptyDescription>
              {history.length === 0
                ? 'Génère ton premier script depuis le générateur pour le retrouver ici.'
                : 'Essaie un autre terme de recherche ou un autre réseau.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Card
              key={item.id}
              className="glass premium-edge group flex flex-col gap-4 overflow-hidden p-4 transition-all duration-300 hover:border-primary-40"
            >
              <div className="relative w-full overflow-hidden rounded-lg border border-border-60">
                <VideoThumb
                  title={item.title}
                  network={item.network}
                  duration={item.duration}
                  className="aspect-video w-full rounded-none opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                />
                <span
                  className={cn(
                    'absolute top-2 right-2 flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] font-semibold backdrop-blur-md',
                    viralBadgeClass(item.score)
                  )}
                >
                  {item.score}% viral
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded border px-2 py-0.5 text-[10px] font-semibold',
                      networkBadgeClass(item.network)
                    )}
                  >
                    {networkLabel(item.network)}
                  </span>
                  {MARKETS.find((m) => m.value === item.market) && (
                    <span className="text-xs text-muted-foreground">
                      {MARKETS.find((m) => m.value === item.market).flag}{' '}
                      {MARKETS.find((m) => m.value === item.market).label}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(item.createdAt)}
                  </span>
                </div>
                <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border bg-muted-30 px-2 py-0.5 text-[10px]">
                    {formatLabel(item.format)}
                  </span>
                  <span className="font-mono">{item.duration}s</span>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2.5 border-t border-border-60 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const text = item.result?.script?.join('\n\n') || item.title
                    downloadText(text, 'script-postgenius.txt')
                    toast.success('Script téléchargé')
                  }}
                >
                  <Download data-icon="inline-start" />
                  Télécharger
                </Button>
                <Tooltip content="Régénérer">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={async () => {
                      const meta = item.result?._meta || {}
                      try {
                        await generate(
                          {
                            network: meta.network || item.network,
                            topic: item.topic || item.title,
                            format: meta.format || item.format,
                            duration: meta.duration || item.duration
                          },
                          { recharge: true }
                        )
                        toast.success('Script régénéré')
                      } catch {
                        toast.error('Régénération impossible')
                      }
                    }}
                  >
                    <RotateCcw />
                    <span className="sr-only">Régénérer</span>
                  </Button>
                </Tooltip>
                <Tooltip content="Copier le titre">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      copyText(item.title).then((ok) => toast.success(ok ? 'Titre copié' : 'Impossible de copier'))
                    }}
                  >
                    <Copy />
                    <span className="sr-only">Copier</span>
                  </Button>
                </Tooltip>
                <Tooltip content="Supprimer">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                      await removeHistoryItem(item.id)
                      toast.success('Script supprimé')
                    }}
                  >
                    <Trash2 />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
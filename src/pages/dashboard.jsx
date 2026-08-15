import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { StatCard } from '../components/dashboard/stat-card'
import { VideoThumb } from '../components/media/video-thumb'
import { useApp } from '../lib/app-context'
import { formatRelativeDate, networkLabel, scoreColorClass } from '../lib/format'

export default function DashboardPage() {
  const { creditsLeft, creditsTotal, history, historyLoading } = useApp()
  const items = history.length ? history : []
  const avgScore = items.length
    ? Math.round(items.reduce((sum, h) => sum + h.score, 0) / items.length)
    : 0
  const bestScore = items.length ? Math.max(...items.map((h) => h.score)) : 0
  const recent = items.slice(0, 4)

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 pb-16 pt-6 sm:px-8">
      <section className="flex flex-col justify-between gap-8 md:flex-row md:items-end md:gap-6">
        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-[48px] sm:leading-[1.1]">
            Prêt à devenir viral&nbsp;?
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Générez des vidéos courtes percutantes en quelques secondes avec notre IA de dernière
            génération.
          </p>
        </div>
        <Button
          size="lg"
          className="h-12 shrink-0 px-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          render={<Link to="/generateur" />}
        >
          <Sparkles data-icon="inline-start" />
          Nouveau Projet
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {historyLoading ? (
          <>
            <Skeleton className="h-[124px] rounded-xl" />
            <Skeleton className="h-[124px] rounded-xl" />
            <Skeleton className="h-[124px] rounded-xl" />
            <Skeleton className="h-[124px] rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Crédits restants"
              count={creditsLeft}
              suffix={`/ ${creditsTotal}`}
              icon={Sparkles}
            />
            <StatCard
              label="Score viral moyen"
              count={avgScore}
              suffix="/ 100"
              icon={ArrowRight}
              trend={items.length ? { direction: 'up', label: 'sur vos scripts' } : undefined}
            />
            <StatCard label="Meilleur score" count={bestScore} suffix="/ 100" icon={ArrowRight} />
            <StatCard
              label="Scripts générés"
              count={items.length}
              suffix={items.length ? 'au total' : 'à venir'}
              icon={ArrowRight}
            />
          </>
        )}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Créations Récentes</h2>
          <Link
            to="/historique"
            className="flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:text-primary-80"
          >
            Voir tout
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {historyLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border-60 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Aucune création pour le moment — lancez votre première génération.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {recent.map((item) => (
              <Link
                key={item.id}
                to="/historique"
                className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-border-60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-40"
              >
                <VideoThumb
                  title={item.title}
                  network={item.network}
                  duration={item.duration}
                  className="absolute inset-0 h-full w-full rounded-none"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020205]/95 via-[#020205]/60 to-transparent p-3 pt-8">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {networkLabel(item.network)}
                    </span>
                    <span className={`font-mono text-xs font-semibold ${scoreColorClass(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-snug font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatRelativeDate(item.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

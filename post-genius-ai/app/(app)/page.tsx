import Link from 'next/link'
import { ArrowRight, Clock3, Gauge, History, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroGlow } from '@/components/app-shell/background-fx'
import { StatCard } from '@/components/dashboard/stat-card'
import { QuickActionCard } from '@/components/dashboard/quick-action-card'
import { CURRENT_USER, DAILY_CREDITS, HISTORY_ITEMS } from '@/lib/mock-data'
import { formatRelativeDate, networkLabel, scoreColorClass } from '@/lib/format'

export default function DashboardPage() {
  const avgScore = Math.round(
    HISTORY_ITEMS.reduce((sum, h) => sum + h.score, 0) / HISTORY_ITEMS.length,
  )
  const bestScore = Math.max(...HISTORY_ITEMS.map((h) => h.score))
  const recent = HISTORY_ITEMS.slice(0, 4)

  return (
    <div className="flex flex-col gap-10 pb-16">
      <section className="relative overflow-hidden border-b border-border px-4 pt-14 pb-10 sm:px-8">
        <HeroGlow />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-5">
          <Badge
            variant="outline"
            className="gap-1.5 border-primary/30 bg-primary/10 text-primary"
          >
            <Sparkles className="size-3" />
            Propulsé par l&apos;IA
          </Badge>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Bonjour {CURRENT_USER.name.split(' ')[0]}, prêt·e pour votre prochain hit&nbsp;?
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            Générez un script viral optimisé pour TikTok, Reels ou Shorts en quelques secondes, et
            mesurez son potentiel avant même de filmer.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-10 px-5"
              nativeButton={false}
              render={<Link href="/generateur" />}
            >
              <Sparkles data-icon="inline-start" />
              Générer un script
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-10 px-5"
              nativeButton={false}
              render={<Link href="/score-viral" />}
            >
              <Gauge data-icon="inline-start" />
              Analyser un hook
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Crédits restants"
            value={`${DAILY_CREDITS.total - DAILY_CREDITS.used}`}
            suffix={`/ ${DAILY_CREDITS.total}`}
            icon={Zap}
          />
          <StatCard
            label="Score viral moyen"
            value={`${avgScore}`}
            suffix="/ 100"
            icon={TrendingUp}
            trend={{ direction: 'up', label: '+6 pts ce mois' }}
          />
          <StatCard label="Meilleur score" value={`${bestScore}`} suffix="/ 100" icon={Gauge} />
          <StatCard
            label="Scripts générés"
            value={`${HISTORY_ITEMS.length}`}
            suffix="7 derniers jours"
            icon={History}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Actions rapides
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <QuickActionCard
              href="/generateur"
              title="Générateur de scénario"
              description="Réseau, ton, format et durée : sortez un script complet en un clic."
              icon={Sparkles}
            />
            <QuickActionCard
              href="/score-viral"
              title="Score viral"
              description="Testez vos hooks et obtenez un score 0-100 avec des pistes d’amélioration."
              icon={Gauge}
            />
            <QuickActionCard
              href="/tarifs"
              title="Passer en Pro"
              description="Débloquez les scripts illimités, l’export audio et les vignettes."
              icon={Zap}
            />
          </div>
        </div>

        <Card className="border-border bg-card/60">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Créations récentes
              </span>
              <Link
                href="/historique"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Voir tout
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              {recent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Clock3 className="size-3.5" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {networkLabel(item.network)} · {formatRelativeDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span className={`shrink-0 font-mono text-sm font-medium ${scoreColorClass(item.score)}`}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

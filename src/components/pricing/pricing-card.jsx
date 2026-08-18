import { Check, Crown, Sparkles, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { formatPrice } from '../../lib/currencies'
import { useI18n } from '../../lib/i18n'

export function PricingCard({ plan, currency, onSubscribe }) {
  const { t } = useI18n()
  const price = plan.price === 0 ? t('pricing.free') : formatPrice(plan.price, currency)
  const period = plan.price === 0 ? t('pricing.period.forever') : t('pricing.period.month')
  const description = t(`pricing.plan.${plan.id}.desc`)
  const features = plan.features.map((_, i) => t(`pricing.plan.${plan.id}.f${i}`))
  const cta = t(`pricing.plan.${plan.id}.cta`)

  return (
    <div
      className={cn(
        'reveal group relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-md transition-all duration-500',
        plan.featured
          ? 'border-primary/40 bg-gradient-to-b from-primary/10 via-card/80 to-card/60 shadow-[0_0_60px_-12px_rgba(139,92,246,0.45)] md:scale-[1.05] z-10 animate-[float_4s_ease-in-out_infinite]'
          : 'border-white/5 bg-card/40 hover:border-white/15 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-3 animate-[float_5s_ease-in-out_infinite]'
      )}
    >
      {/* Neon glow ring */}
      {plan.featured && (
        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-primary via-fuchsia-500 to-cyan-400 opacity-20 blur-sm" />
      )}

      {/* Floating orb */}
      <div className={cn(
        'pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500',
        plan.featured ? 'bg-primary/25 opacity-100' : 'bg-white/5 opacity-0 group-hover:opacity-100'
      )} />
      {/* Featured glow overlay */}
      {plan.featured && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-24 left-1/2 size-48 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      {/* POPULAR badge */}
      {plan.featured && (
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-0">
          <span className="flex items-center gap-1.5 rounded-b-xl border border-t-0 border-primary/40 bg-gradient-to-r from-primary via-primary to-fuchsia-600 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)]">
            <Crown className="size-5" />
            POPULAIRE
          </span>
        </div>
      )}

      {/* Header */}
      <CardHeader className={cn('relative z-10 gap-3', plan.featured ? 'pt-12' : 'pt-8')}>
        <div className="flex items-center gap-2">
          {plan.featured ? (
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Sparkles className="size-5" />
            </span>
          ) : (
            <span className="flex size-8 items-center justify-center rounded-xl bg-white/5 text-muted-foreground">
              {plan.price === 0 ? <Zap className="size-5" /> : <Check className="size-5" />}
            </span>
          )}
          <span
            className={cn(
              'text-sm font-bold uppercase tracking-wider',
              plan.featured ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {plan.name}
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <span className={cn(
            'font-mono text-4xl font-black tracking-tight sm:text-5xl',
            plan.featured ? 'bg-gradient-to-r from-primary to-fuchsia-400 bg-clip-text text-transparent' : 'text-foreground'
          )}>
            {price}
          </span>
          {plan.price > 0 && (
            <span className="pb-1.5 text-sm font-medium text-muted-foreground">/{period}</span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardHeader>

      {/* Features */}
      <CardContent className="relative z-10 flex flex-1 flex-col gap-6 px-6 pb-6">
        <ul className="flex flex-1 flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <span
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-lg',
                  plan.featured ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
                )}
              >
                <Check className="size-3" />
              </span>
              <span className="leading-relaxed text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.featured ? 'default' : 'outline'}
          className={cn(
            'w-full rounded-2xl py-6 text-sm font-bold transition-all',
            plan.featured
              ? 'bg-gradient-to-r from-primary to-fuchsia-600 text-white shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] hover:scale-[1.02]'
              : 'border-white/10 bg-white/5 hover:border-primary/30 hover:bg-primary/5'
          )}
          onClick={() => onSubscribe?.(plan)}
        >
          {cta}
        </Button>
      </CardContent>
    </div>
  )
}

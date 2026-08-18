import { useState } from 'react'
import { BadgeCheck, Check, Copy, Gift, Sparkles, Users } from 'lucide-react'
import { toast } from '../ui/sonner'
import { Field, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { useI18n } from '../../lib/i18n'
import { getReferral, REWARD_TIERS } from '../../services/referral'
import { cn } from '../../lib/utils'

export function ReferralCard({ className }) {
  const { t } = useI18n()
  const referral = getReferral()
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referral.link)
    } catch {
      /* presse-papiers indisponible */
    }
    setCopied(true)
    toast.success(t('referral.copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'glow-card premium-edge relative overflow-hidden rounded-pg-lg border-primary/20 bg-gradient-to-br from-primary/10 via-pg-surface/80 to-cyan-500/5',
        className
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between gap-2 px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Gift className="size-4" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-pg-text">
              {t('referral.title')}
            </h3>
            <p className="text-xs text-pg-muted">
              {t('referral.subtitle')}
            </p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          <Sparkles className="size-3" />
          PRO gratuit
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-5 px-6 pb-6 pt-2">
        <Field>
          <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-pg-muted">
            {t('referral.linkLabel')}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={referral.link}
              className="h-10 rounded-pg border-white/[0.08] bg-white/[0.03] font-mono text-xs text-pg-text focus-visible:border-primary"
            />
            <Button
              type="button"
              onClick={copyLink}
              variant="outline"
              className={cn(
                'h-10 shrink-0 gap-1.5 rounded-pg px-4 font-semibold transition-all duration-200',
                copied
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : ''
              )}
            >
              {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              {copied ? 'Copié !' : t('referral.copy')}
            </Button>
          </div>
        </Field>

        <Separator className="bg-white/[0.06]" />

        <div className="flex items-center gap-3 rounded-pg-lg border border-white/[0.06] bg-white/[0.03] p-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Users className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-pg-text">
                {t('referral.count', { count: referral.count })}
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {referral.count} / 3
              </span>
            </div>
            <span className="text-xs text-pg-muted">
              {referral.pro ? t('referral.proEarnedDesc') : t('referral.proPendingDesc')}
            </span>
          </div>
        </div>

        {referral.pro && (
          <div className="flex items-center gap-2.5 rounded-pg-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-medium text-emerald-400">
            <BadgeCheck className="size-5 shrink-0" />
            {t('referral.proEarned')}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-pg-muted">
            {t('referral.tiers')}
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REWARD_TIERS.map((tier) => {
              const earned = referral.earnedTiers.includes(tier.min)
              return (
                <div
                  key={tier.min}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-pg-lg border p-3 text-xs transition-colors',
                    earned
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : 'border-white/[0.06] bg-white/[0.03] hover:border-primary/20'
                  )}
                >
                  <span
                    className={cn(
                      'flex min-w-0 items-center gap-2 font-medium',
                      earned ? 'text-emerald-400' : 'text-pg-text'
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                        earned ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-pg-muted'
                      )}
                    >
                      {earned ? <Check className="size-3" /> : tier.min}
                    </span>
                    <span className="truncate">{t(tier.labelKey)}</span>
                  </span>
                  <span className="shrink-0 font-medium text-pg-muted">
                    {earned
                      ? t('referral.earned')
                      : t('referral.pending', { n: Math.max(0, tier.min - referral.count) })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

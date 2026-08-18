import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { toast } from '../components/ui/sonner'
import { PRICING_PLANS } from '../lib/mock-data'
import { PricingCard } from '../components/pricing/pricing-card'
import { PaymentModal } from '../components/pricing/payment-modal'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { MOBILE_PAYMENTS, CARD_PAYMENTS, defaultCurrency } from '../lib/currencies'
import { detectCurrency } from '../services/geo'
import { cn } from '../lib/utils'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'
import { creditReferrerForPayment } from '../services/referral'

export default function PricingPage() {
  const { upgradeToPlan } = useApp()
  const { t } = useI18n()
  const [currency, setCurrency] = useState(defaultCurrency())
  const [payingPlan, setPayingPlan] = useState(null)

  useEffect(() => {
    detectCurrency().then(setCurrency).catch(() => {})
  }, [])

  const mobile = currency.id === 'xof'
  const methods = mobile ? MOBILE_PAYMENTS : CARD_PAYMENTS

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-4 pb-16 pt-4 sm:px-8">
      {/* Header */}
      <div className="reveal flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <span className="eyebrow text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {t('pricing.badge')}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
          {t('pricing.title')}{' '}
          <span className="text-primary">
            {t('pricing.unlimited')}
          </span>
        </h1>
        <p className="max-w-lg text-[15px] text-pg-muted">
          {t('pricing.subtitle')}
        </p>
      </div>

      {/* Plans grid */}
      <div className="reveal-2 grid gap-6 md:grid-cols-3 md:items-start">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} currency={currency} onSubscribe={setPayingPlan} />
        ))}
      </div>

      {/* Payment methods */}
      <Card className="reveal-3 border border-white/[0.06] bg-pg-surface rounded-xl p-6">
        <CardHeader className="p-0 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-sm font-bold">{t('pricing.methodsTitle')}</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full border font-semibold',
                mobile ? 'border-success/30 text-success' : 'border-primary/30 text-primary'
              )}
            >
              {currency.flag} {currency.label}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {mobile
              ? t('pricing.methodsMobileDesc', { currency: 'FCFA' })
              : t('pricing.methodsCardDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] p-3.5 transition-colors hover:border-primary/20"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
                {m.emoji || '💳'}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-pg-text">{m.name}</span>
                <span className="text-[11px] text-pg-muted">{m.desc}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <PaymentModal
        open={!!payingPlan}
        plan={payingPlan}
        currency={currency}
        methods={mobile ? MOBILE_PAYMENTS : CARD_PAYMENTS}
        onClose={() => setPayingPlan(null)}
        onSuccess={async () => {
          const next = await upgradeToPlan(payingPlan?.name)
          const credited = creditReferrerForPayment()
          if (next === 'Pro') toast.success(t('pricing.proActivated'))
          else toast.success(t('pricing.planActivated', { plan: next }))
          if (credited) toast.success(t('referral.creditToast'))
        }}
      />
    </div>
  )
}

import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { toast } from '../components/ui/sonner'
import { PRICING_PLANS } from '../lib/mock-data'
import { PricingCard } from '../components/pricing/pricing-card'
import { PaymentModal } from '../components/pricing/payment-modal'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group'
import { CURRENCIES, MOBILE_PAYMENTS, CARD_PAYMENTS, defaultCurrency } from '../lib/currencies'
import { cn } from '../lib/utils'
import { useApp } from '../lib/app-context'

export default function PricingPage() {
  const { upgradeToPlan } = useApp()
  const [currency, setCurrency] = useState(defaultCurrency)
  const [payingPlan, setPayingPlan] = useState(null)

  function changeCurrency(id) {
    const found = CURRENCIES.find((c) => c.id === id)
    if (!found) return
    setCurrency(found)
    try {
      localStorage.setItem('pg-currency', id)
    } catch {
      /* stockage indisponible */
    }
  }

  const mobile = currency.id === 'xof'
  const methods = mobile ? MOBILE_PAYMENTS : CARD_PAYMENTS

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Abonnement
        </span>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance md:text-[44px] md:leading-tight">
          Débloquez la création{' '}
          <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            illimitée
          </span>
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Change ou annule à tout moment. Les crédits se réinitialisent chaque jour.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Devise d&apos;affichage
        </span>
        <ToggleGroup
          value={[currency.id]}
          onValueChange={(next) => {
            if (next[0]) changeCurrency(next[0])
          }}
          className="w-full gap-1 rounded-full border border-primary-30 bg-card-60 p-1 backdrop-blur-xl sm:w-auto"
        >
          {CURRENCIES.map((c) => (
            <ToggleGroupItem
              key={c.id}
              value={c.id}
              className="rounded-full px-4 py-1.5 data-[state=on]:shadow-[0_0_10px_rgba(139,92,246,0.2)]"
            >
              {c.flag} {c.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wallet className="size-3 text-primary" />
          {mobile
            ? 'Paiement mobile disponible (Wave, Orange Money, MTN MoMo…)'
            : 'Paiement par carte bancaire ou PayPal'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} currency={currency} onSubscribe={setPayingPlan} />
        ))}
      </div>

      <Card className="glass premium-edge">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-sm">Moyens de paiement</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full',
                mobile ? 'border-success-20 text-success' : 'border-primary-30 text-primary'
              )}
            >
              {currency.flag} {currency.label}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {mobile
              ? 'Paiement 100% mobile en FCFA, sans carte bancaire, depuis ton téléphone.'
              : 'Paiement international sécurisé, ta carte est débitée en fin de mois.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-lg border border-primary-20 bg-card-60 p-3.5 backdrop-blur-md"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-10 text-primary text-base">
                {m.emoji || '💳'}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{m.name}</span>
                <span className="text-xs text-muted-foreground">{m.desc}</span>
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
          if (next === 'Pro') toast.success('Abonnement Pro activé — 25 scripts/jour débloqués !')
          else toast.success(`Abonnement ${next} activé !`)
        }}
      />
    </div>
  )
}

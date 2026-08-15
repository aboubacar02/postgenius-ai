import type { Metadata } from 'next'
import { PRICING_PLANS } from '@/lib/mock-data'
import { PricingCard } from '@/components/pricing/pricing-card'

export const metadata: Metadata = {
  title: 'Tarifs — PostGenius AI',
  description: 'Choisis le plan adapté à ton rythme de publication.',
}

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Abonnement
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance font-heading md:text-4xl">
          Un plan pour chaque cadence de publication
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Change ou annule à tout moment. Les crédits se réinitialisent chaque jour.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}

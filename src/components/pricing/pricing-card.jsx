import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { formatPrice } from '../../lib/currencies'

export function PricingCard({ plan, currency, onSubscribe }) {
  const price = plan.price === 0 ? 'Gratuit' : formatPrice(plan.price, currency)
  return (
    <Card
      className={cn(
        'lift glass premium-edge relative flex flex-col overflow-hidden',
        plan.featured
          ? 'border-primary-40 bg-card shadow-[0_0_40px_rgba(139,92,246,0.15)] md:scale-[1.03]'
          : 'hover:border-foreground-20'
      )}
    >
      {plan.featured && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-20 to-transparent" />
          <Badge className="absolute top-0 right-0 rounded-bl-lg rounded-br-none rounded-tl-none rounded-tr-none bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            Recommandé
          </Badge>
        </>
      )}
      <CardHeader className="relative z-10 gap-3 pt-8">
        <span
          className={cn(
            'text-[11px] font-medium uppercase tracking-wider',
            plan.featured ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {plan.name}
        </span>
        <div className="flex items-end gap-1.5">
          <span className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            {price}
          </span>
          {plan.price > 0 && <span className="pb-1 text-sm text-muted-foreground">/{plan.period}</span>}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-1 flex-col gap-6">
        <ul className="flex flex-1 flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check
                className={cn(
                  'mt-0.5 size-4 shrink-0',
                  plan.featured ? 'text-primary drop-shadow-[0_0_5px_rgba(139,92,246,0.3)]' : 'text-primary'
                )}
              />
              <span className="leading-relaxed text-foreground-90">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          variant={plan.featured ? 'default' : 'outline'}
          className="w-full"
          onClick={() => onSubscribe?.(plan)}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  )
}
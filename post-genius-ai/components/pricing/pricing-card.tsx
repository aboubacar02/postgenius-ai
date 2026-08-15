import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PricingPlan } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card
      className={cn(
        'relative flex flex-col border-border/60 bg-card/60',
        plan.featured && 'border-primary/40 bg-card shadow-[0_0_0_1px_var(--primary)]',
      )}
    >
      {plan.featured && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-primary-foreground">
          Le plus populaire
        </Badge>
      )}
      <CardHeader className="gap-3 pt-8">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {plan.name}
        </span>
        <div className="flex items-end gap-1.5">
          <span className="font-mono text-4xl font-semibold tracking-tight">
            {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
          </span>
          {plan.price > 0 && <span className="pb-1 text-sm text-muted-foreground">/{plan.period}</span>}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <ul className="flex flex-1 flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="leading-relaxed text-foreground/90">{feature}</span>
            </li>
          ))}
        </ul>
        <Button variant={plan.featured ? 'default' : 'outline'} className="w-full">
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  )
}

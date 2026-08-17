import { useEffect, useState } from 'react'
import { toast } from '../ui/sonner'
import { BadgeCheck, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { formatPrice } from '../../lib/currencies'
import { createPaymentSession } from '../../services/payment'
import { useI18n } from '../../lib/i18n'

export function PaymentModal({ open, plan, currency, methods, onClose, onSuccess }) {
  const { t } = useI18n()
  const [method, setMethod] = useState(null)
  const [step, setStep] = useState('choose')
  const [reference, setReference] = useState('')

  useEffect(() => {
    if (open) {
      setMethod(null)
      setStep('choose')
      setReference('')
    }
  }, [open])

  useEffect(() => {
    if (open && methods?.length && !method) setMethod(methods[0].id)
  }, [open, methods, method])

  if (!open || !plan) return null

  async function pay() {
    setStep('processing')
    try {
      const session = await createPaymentSession({
        provider: 'auto',
        method,
        plan: plan.name,
        currency: currency.code,
        amount: plan.price
      })

      if (session.status === 'pending' && (session.authorization_url || session.payment_url || session.approval_url)) {
        const url = session.authorization_url || session.payment_url || session.approval_url
        toast.info(t('pricing.paymentRedirect'))
        window.open(url, '_blank', 'noopener,noreferrer')
      }

      setReference(session.reference)
      setStep('success')
    } catch {
      toast.error(t('pricing.paymentFail'))
      setStep('choose')
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === 'choose' ? onClose : undefined}
      />
      <div className="glass relative flex w-full max-w-md flex-col gap-5 rounded-2xl border-border bg-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge className="gap-1 rounded-full bg-amber-400 text-amber-950">
                <ShieldCheck className="size-3" />
                {t('pricing.paymentTest')}
              </Badge>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {plan.name}
              </span>
            </div>
            <h2 className="font-heading text-lg font-semibold text-balance">
              {t('pricing.subscribeTo', { plan: plan.name })}
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-xl font-semibold text-foreground">
                {formatPrice(plan.price, currency)}
              </span>
              <span className="text-xs"> /{plan.period}</span>
            </p>
          </div>
          {step === 'choose' && (
            <button
              type="button"
              aria-label={t('pricing.close')}
              onClick={onClose}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {step === 'choose' && (
          <>
            <div className="flex flex-col gap-2.5">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                    method === m.id
                      ? 'border-primary-40 bg-primary-10 ring-1 ring-ring-50'
                      : 'border-border-60 bg-background-40 hover:border-foreground-20'
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-lg">
                    {m.emoji || '💳'}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.desc}</span>
                  </span>
                  <span
                    className={cn(
                      'size-4 rounded-full border-2',
                      method === m.id ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-border bg-background-40 p-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{t('pricing.simulation')}</span>
              <span dangerouslySetInnerHTML={{ __html: t('pricing.simulationDesc', { plan: `<span class="font-medium text-foreground">${plan.name}</span>` }) }} />
            </div>

            <Button size="lg" className="w-full" onClick={pay}>
              {t('pricing.validateTest')}
            </Button>
          </>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="size-9 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">{t('pricing.processing')}</p>
            <p className="text-xs text-muted-foreground">{t('pricing.processingDesc', { method })}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-success-20 text-success">
              <CheckCircle2 className="size-7" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-foreground">
                {t('pricing.success')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('pricing.reference')} : <span className="font-mono text-primary">{reference}</span>
              </p>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <BadgeCheck className="size-3.5 text-primary" />
                {t('pricing.accountUpgraded', { plan: plan.name })}
              </p>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                onSuccess?.(reference)
                onClose()
              }}
            >
              {t('pricing.activate', { plan: plan.name })}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

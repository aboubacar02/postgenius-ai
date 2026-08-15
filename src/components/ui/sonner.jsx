import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

let listeners = []
let toasts = []
let counter = 0

function emit() {
  listeners.forEach((l) => l([...toasts]))
}

function push(type, message, opts = {}) {
  counter += 1
  const id = counter
  toasts = [...toasts, { id, type, message }]
  emit()
  if (opts.duration !== Infinity) {
    setTimeout(() => dismiss(id), opts.duration ?? 3500)
  }
  return id
}

export function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export const toast = (message, opts) => push('default', message, opts)
toast.success = (message, opts) => push('success', message, opts)
toast.error = (message, opts) => push('error', message, opts)
toast.info = (message, opts) => push('info', message, opts)

export function Toaster({ className, position = 'bottom-left' }) {
  const [items, setItems] = useState([])
  const ref = useRef(items)
  ref.current = items

  useEffect(() => {
    const listener = (next) => setItems(next)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return (
    <div
      className={cn(
        'group fixed z-[9999] flex w-full flex-col gap-2 p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:w-[var(--width)] sm:max-w-[420px]',
        position === 'bottom-right' && 'sm:right-4 sm:left-auto',
        position === 'bottom-left' && 'sm:right-auto sm:left-4',
        position === 'bottom-center' && 'sm:right-auto sm:left-1/2 sm:-translate-x-1/2',
        className
      )}
      style={{ '--width': '420px' }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            'animate-sonner-in pointer-events-auto flex w-full items-center gap-3 rounded-xl border bg-secondary p-3 text-sm text-secondary-foreground shadow-lg',
            t.type === 'error' && 'border-destructive-20 bg-destructive-10 text-destructive',
            t.type === 'success' && 'border-success-20 bg-success-10 text-success'
          )}
        >
          {t.type === 'success' && (
            <svg className="size-4 shrink-0 text-success" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" fill="currentColor" opacity="0.15" />
              <path d="m5 8.2 2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {t.type === 'error' && (
            <svg className="size-4 shrink-0 text-destructive" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" fill="currentColor" opacity="0.15" />
              <path d="m6 6 4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {t.type === 'info' && <span className="size-2 shrink-0 rounded-full bg-primary" />}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-md hover:bg-muted-60"
            aria-label="Fermer"
          >
            <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
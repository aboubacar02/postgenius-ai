import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

function Select({ className, value, defaultValue, onValueChange, placeholder = 'Sélectionner…', disabled = false, children, ...props }) {
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState(defaultValue)
  const ref = useRef(null)
  const current = value ?? internal

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const options = []
  let placeholderNode = null
  ;[].concat(children).filter(Boolean).forEach((child) => {
    if (child?.type?.name === 'SelectValue') placeholderNode = child
    if (child?.type?.name === 'SelectContent') {
      ;[].concat(child.props.children).filter(Boolean).forEach((item) => {
        if (item?.type?.name === 'SelectItem') options.push(item)
      })
    }
  })

  const selectedLabel =
    placeholderNode?.props?.placeholder ??
    options.find((o) => o.props.value === current)?.props.children ??
    'Sélectionner…'

  return (
    <div ref={ref} className={cn('relative', disabled && 'pointer-events-none', className)} data-slot="select" {...props}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-card px-2.5 py-1 text-sm transition-colors outline-none',
          'hover:border-input-60 hover:bg-card focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring-50',
          disabled && 'opacity-40 cursor-not-allowed'
        )}
      >
        <span className={cn('truncate', !current && 'text-muted-foreground')}>{selectedLabel}</span>
        <svg className="size-3.5 shrink-0 opacity-50" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {options.map((item, i) => {
            const v = item.props.value
            const on = v === current
            return (
              <button
                key={i}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  onValueChange?.(v)
                  setInternal(v)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted-60',
                  on && 'text-foreground'
                )}
              >
                <span>{item.props.children}</span>
                {on && (
                  <svg className="size-3.5 text-primary" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SelectValue({ placeholder, ...props }) {
  return <span data-slot="select-value" placeholder={placeholder} {...props} />
}

function SelectContent({ children, ...props }) {
  return <>{children}</>
}

function SelectItem({ children, ...props }) {
  return <div data-slot="select-item" {...props}>{children}</div>
}

export { Select, SelectValue, SelectContent, SelectItem }

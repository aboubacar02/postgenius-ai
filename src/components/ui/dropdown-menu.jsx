import { cloneElement, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const items = []
  let trigger = null
  ;[].concat(children).filter(Boolean).forEach((child) => {
    if (child?.type?.name === 'DropdownMenuTrigger') trigger = child
    if (child?.type?.name === 'DropdownMenuContent') {
      ;[].concat(child.props.children).filter(Boolean).forEach((it) => items.push(it))
    }
  })

  return (
    <div ref={ref} className="relative" data-slot="dropdown-menu">
      {trigger && cloneElement(trigger, { onClick: () => setOpen((v) => !v), 'data-open': open || undefined })}
      {open && (
        <div
          className="absolute right-0 z-50 mt-1 min-w-[10rem] origin-top-right overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
          onClick={() => setOpen(false)}
        >
          {items}
        </div>
      )}
    </div>
  )
}

function DropdownMenuTrigger({ children, onClick, ...props }) {
  return (
    <div onClick={onClick} {...props}>
      {children}
    </div>
  )
}

function DropdownMenuContent({ children }) {
  return <>{children}</>
}

function DropdownMenuItem({ className, children, ...props }) {
  return (
    <div
      role="menuitem"
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted-60 focus-visible:bg-muted-60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuLabel({ className, ...props }) {
  return <div className={cn('px-2 py-1.5 text-sm font-medium text-muted-foreground', className)} {...props} />
}

function DropdownMenuSeparator({ className }) {
  return <div className={cn('my-1 h-px bg-border', className)} />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator }
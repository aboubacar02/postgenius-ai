import { useEffect } from 'react'
import { cn } from '../../lib/utils'

function Sheet({ open = false, onOpenChange, children }) {
  return (
    <div data-slot="sheet-root" className={cn(!open && 'hidden')}>
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-y-0 left-0 z-50 flex w-3/4 max-w-xs flex-col border-r bg-background shadow-xl">
        {children}
      </div>
    </div>
  )
}

function SheetHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-2 p-4', className)} {...props} />
}

function SheetTitle({ className, ...props }) {
  return <h2 className={cn('text-base font-medium', className)} {...props} />
}

function SheetClose({ className, onClick, ...props }) {
  return (
    <button type="button" onClick={onClick} className={cn('ml-auto size-7 inline-flex items-center justify-center rounded-md hover:bg-muted', className)} {...props}>
      <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export { Sheet, SheetHeader, SheetTitle, SheetClose }
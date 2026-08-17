import { createContext, useContext, useState } from 'react'
import { cn } from '../../lib/utils'

const TabsContext = createContext(null)

function Tabs({ className, defaultValue, ...props }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div data-slot="tabs" className={cn('group/tabs flex flex-col gap-2', className)} data-orientation="horizontal" {...props} />
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      className={cn('inline-flex w-fit items-center justify-center rounded-lg border border-white/[0.08] bg-pg-surface p-[3px] text-pg-muted', className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, value, children, ...props }) {
  const ctx = useContext(TabsContext)
  const active = ctx?.value === value
  return (
    <button
      role="tab"
      type="button"
      data-slot="tabs-trigger"
      data-active={active || undefined}
      aria-selected={active}
      onClick={() => ctx?.setValue(value)}
      className={cn(
        'relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-0.5 text-sm font-medium whitespace-nowrap transition-all',
        'text-pg-muted hover:text-pg-text focus-visible:ring-2 focus-visible:ring-primary/50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        active && 'bg-background text-pg-text shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ className, value, children, ...props }) {
  const ctx = useContext(TabsContext)
  if (ctx?.value !== value) return null
  return (
    <div role="tabpanel" data-slot="tabs-content" className={cn('flex-1 text-sm outline-none', className)} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

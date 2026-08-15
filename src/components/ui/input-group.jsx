import { cn } from '../../lib/utils'

function InputGroup({ className, children, ...props }) {
  return (
    <div data-slot="input-group" className={cn('relative flex w-full items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}

function InputGroupAddon({ className, ...props }) {
  return <div data-slot="input-group-addon" className={cn('flex items-center text-muted-foreground', className)} {...props} />
}

export { InputGroup, InputGroupAddon }
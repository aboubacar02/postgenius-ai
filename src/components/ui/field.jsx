import { cn } from '../../lib/utils'
import { Label } from './label'
import { Separator } from './separator'

function FieldGroup({ className, ...props }) {
  return (
    <div data-slot="field-group" className={cn('flex w-full flex-col gap-5', className)} {...props} />
  )
}

function Field({ className, orientation = 'vertical', ...props }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        'group/field flex w-full gap-2',
        orientation === 'vertical' && 'flex-col *:w-full [&>.sr-only]:w-auto',
        orientation === 'horizontal' && 'flex-row items-center *:[data-slot=field-label]:flex-auto',
        orientation === 'responsive' &&
          'flex-col *:w-full [&>.sr-only]:w-auto sm:flex-row sm:items-center sm:*:w-auto sm:*:[data-slot=field-label]:flex-auto',
        className
      )}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }) {
  return (
    <div data-slot="field-content" className={cn('group/field-content flex flex-1 flex-col gap-0.5 leading-snug', className)} {...props} />
  )
}

function FieldLabel({ className, ...props }) {
  return (
    <Label
      data-slot="field-label"
      className={cn('group/field-label w-fit gap-2 leading-snug', className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-left text-sm leading-normal font-normal text-muted-foreground', className)}
      {...props}
    />
  )
}

function FieldSeparator({ children, className, ...props }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn('relative -my-2 h-5 text-sm', className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground">
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({ className, children, ...props }) {
  return (
    <div role="alert" data-slot="field-error" className={cn('text-sm font-normal text-destructive', className)} {...props}>
      {children}
    </div>
  )
}

export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldContent, FieldSeparator }
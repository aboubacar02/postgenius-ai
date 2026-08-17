import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-white/[0.05]', className)} />
}

export function SkeletonText({ className }) {
  return <Skeleton className={cn('h-3.5 w-full', className)} />
}

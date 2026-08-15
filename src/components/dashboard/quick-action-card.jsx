import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function QuickActionCard({ href, title, description, icon: Icon }) {
  return (
    <Link
      to={href}
      className="lift glass premium-edge group relative flex flex-col gap-3 rounded-lg p-5 transition-colors hover:border-primary-40 hover:bg-card-80 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary-10 text-primary">
          <Icon className="size-4" />
        </div>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
import { Lock } from 'lucide-react'
import { AuthCard } from './auth-card'
import { useApp } from '../../lib/app-context'

export function RequireAuth({ children }) {
  const { isSignedIn } = useApp()

  if (isSignedIn) return children

  return (
    <div className="relative mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center gap-8 px-4 pb-16 pt-12 sm:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-purple-500/15 blur-[120px]" />
      </div>

      <div className="reveal flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
          <Lock className="size-6" />
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-pg-text">
          Connecte-toi pour continuer
        </h2>
        <p className="max-w-md text-sm text-pg-muted leading-relaxed">
          Crée un compte ou connecte-toi pour accéder à la recherche, la génération de scripts et au studio faceless.
        </p>
      </div>

      <div className="w-full max-w-md reveal-1">
        <AuthCard />
      </div>
    </div>
  )
}

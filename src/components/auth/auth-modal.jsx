import { X } from 'lucide-react'
import { AuthCard } from './auth-card'
import { Button } from '../ui/button'
import { useEffect } from 'react'

export function AuthModal({ open, onClose }) {
  // Gérer la fermeture avec la touche Echap
  useEffect(() => {
    function onKeyDown(e) {
      if (open && e.code === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md reveal">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white"
        >
          <X className="size-5" />
        </Button>
        <AuthCard />
      </div>
    </div>
  )
}

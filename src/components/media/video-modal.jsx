import { useEffect } from 'react'
import { ExternalLink } from 'lucide-react'

export function VideoModal({ video, onClose }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    if (!video) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [video, onClose])

  if (!video) return null

  const ytId = video.youtubeId || '9bZkp7q19f0'
  const ytUrl = `https://www.youtube.com/watch?v=${ytId}`
  const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&origin=${encodeURIComponent(origin)}`

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      {/* Fond cliquable pour fermer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteneur de la Vidéo (Grand Format Fixé) */}
      <div 
        className="relative z-10 w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-[0_0_50px_rgba(56,189,248,0.25)] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barre supérieure avec bouton Fermer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10 shrink-0">
          <span className="text-sm font-medium text-slate-200 truncate pr-4">
            {video.title}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <span>YouTube</span>
              <ExternalLink className="size-3" />
            </a>
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Zone Vidéo : flex-1 + w-full h-full pour afficher l'image correctement */}
        <div className="relative flex-1 w-full h-full bg-black">
          <iframe 
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

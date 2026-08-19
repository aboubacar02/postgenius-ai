import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function VideoModal({ video, onClose }) {
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

  if (!video || typeof window === 'undefined') return null

  const ytId = video.youtubeId || '9bZkp7q19f0'
  const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`

  const rawTitle = video.title || 'Vidéo'
  const cleanTitle = typeof rawTitle === 'string' 
    ? rawTitle.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>') 
    : 'Vidéo'

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
      {/* Overlay de fermeture */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteneur vidéo FORCÉ visible plus grand et plus haut */}
      <div 
        className="relative z-[100000] w-full max-w-5xl h-[75vh] min-h-[560px] bg-slate-950 rounded-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(56,189,248,0.3)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10 shrink-0">
          <span className="text-sm font-medium text-white truncate pr-4">
            {cleanTitle}
          </span>
          <button 
            type="button"
            onClick={onClose} 
            className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Fermer ✕
          </button>
        </div>

        {/* Player iframe flex-1 pour occuper toute la hauteur */}
        <div className="relative flex-1 w-full bg-black">
          <iframe 
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0 block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

import { useEffect } from 'react'
import YouTube from 'react-youtube'
import { ExternalLink, X } from 'lucide-react'

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

  if (!video) return null

  const ytId = video.youtubeId || '9bZkp7q19f0'
  const ytUrl = `https://www.youtube.com/watch?v=${ytId}`

  // Configuration du lecteur officiel YouTube JavaScript
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin,
    },
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Conteneur principal avec hauteur/largeur explicitement forcées */}
      <div className="relative z-10 w-full max-w-5xl h-[550px] bg-slate-950 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10 shrink-0">
          <span className="text-sm font-medium text-white truncate pr-4">{video.title}</span>
          <div className="flex items-center gap-2">
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-500"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zone lecteur YouTube API */}
        <div className="relative flex-1 w-full h-full bg-black">
          <YouTube
            videoId={ytId}
            opts={opts}
            className="w-full h-full"
            iframeClassName="w-full h-full border-0"
          />
        </div>

      </div>
    </div>
  )
}

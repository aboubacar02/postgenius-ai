import { Download, FileText, Headphones, Loader2, Video } from 'lucide-react'
import { Button } from '../ui/button'

export function FacelessExportBar({ downloading, downloadVoiceOff, downloadAllVideos, downloadFullPack, exportScript }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
          <Download className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-pg-text">Telecharger le Pack CapCut</h3>
          <p className="text-[11px] text-pg-subtle">Voix-off MP3 + videos MP4 B-roll synchronisees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={downloadVoiceOff}
          disabled={downloading === 'audio' || downloading === 'all'}
          variant="outline"
          className="h-12 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
        >
          {downloading === 'audio' ? <Loader2 className="size-4 animate-spin" /> : <Headphones className="size-4" />}
          <span>Voix-Off MP3</span>
        </Button>

        <Button
          onClick={downloadAllVideos}
          disabled={downloading === 'all-vids' || downloading === 'all'}
          variant="outline"
          className="h-12 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
        >
          {downloading === 'all-vids' ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
          <span>Videos MP4</span>
        </Button>

        <Button
          onClick={downloadFullPack}
          disabled={downloading !== null}
          className="h-12 gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white text-xs shadow-lg shadow-violet-500/20 hover:opacity-90"
        >
          {downloading === 'all' ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          <span>Pack CapCut Complet</span>
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={exportScript} variant="ghost" size="sm" className="gap-1.5 text-pg-subtle hover:text-pg-text text-xs">
          <FileText className="size-3.5" /> Script TXT
        </Button>
      </div>
    </div>
  )
}

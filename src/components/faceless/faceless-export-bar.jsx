import { useState } from 'react'
import { Download, FileText, Headphones, Loader2, Music, Search, Subtitles, Video } from 'lucide-react'
import { Button } from '../ui/button'

export function FacelessExportBar({ downloading, downloadVoiceOff, downloadAllVideos, downloadFullPack, exportScript, downloadSrt, musicTrack, musicSearching, searchMusic, downloadMusic, duration }) {
  const [musicQuery, setMusicQuery] = useState('')

  return (
    <div className="flex flex-col gap-4">
      {/* Music Search */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Music className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-pg-text">Musique de fond</h3>
            <p className="text-[11px] text-pg-subtle">Cherche une musique libre de droits pour ta video</p>
          </div>
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); searchMusic(musicQuery) }}>
          <input
            value={musicQuery}
            onChange={(e) => setMusicQuery(e.target.value)}
            placeholder="ex: motivation epic cinematic"
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-pg-text placeholder:text-pg-subtle outline-none focus:border-emerald-500/40"
          />
          <Button type="submit" size="sm" disabled={!musicQuery.trim() || musicSearching} className="h-11 gap-1.5 rounded-xl bg-emerald-600/80 px-4 text-xs font-semibold text-white hover:bg-emerald-500">
            {musicSearching ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
            Chercher
          </Button>
        </form>
        {musicTrack && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            {musicTrack.thumbnail && <img src={musicTrack.thumbnail} alt="" className="size-10 shrink-0 rounded-lg object-cover" loading="lazy" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-pg-text truncate">{musicTrack.title}</p>
              <p className="text-xs text-pg-subtle truncate">{musicTrack.channel} {musicTrack.duration ? `· ${musicTrack.duration}` : ''}</p>
            </div>
            <Button size="sm" variant="outline" onClick={downloadMusic} className="h-9 gap-1 rounded-lg border-emerald-500/30 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/10">
              <Download className="size-3" /> YouTube
            </Button>
          </div>
        )}
      </div>

      {/* Downloads */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Download className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-pg-text">Telecharger le Pack CapCut</h3>
            <p className="text-[11px] text-pg-subtle">Voix-off MP3 + videos MP4 + sous-titres SRT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Button
            onClick={downloadVoiceOff}
            disabled={downloading === 'audio' || downloading === 'all'}
            variant="outline"
            className="h-11 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
          >
            {downloading === 'audio' ? <Loader2 className="size-4 animate-spin" /> : <Headphones className="size-4" />}
            <span>Voix-Off MP3</span>
          </Button>

          <Button
            onClick={downloadAllVideos}
            disabled={downloading === 'all-vids' || downloading === 'all'}
            variant="outline"
            className="h-11 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
          >
            {downloading === 'all-vids' ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
            <span>Videos MP4</span>
          </Button>

          <Button
            onClick={downloadSrt}
            variant="outline"
            className="h-11 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
          >
            <Subtitles className="size-4" />
            <span>Sous-titres SRT</span>
          </Button>

          <Button
            onClick={exportScript}
            variant="outline"
            className="h-11 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
          >
            <FileText className="size-4" />
            <span>Script TXT</span>
          </Button>
        </div>

        <div className="mt-3">
          <Button
            onClick={downloadFullPack}
            disabled={downloading !== null}
            className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white text-xs shadow-lg shadow-violet-500/20 hover:opacity-90"
          >
            {downloading === 'all' ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            <span>Pack CapCut Complet</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

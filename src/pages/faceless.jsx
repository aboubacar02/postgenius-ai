import { Clapperboard } from 'lucide-react'
import { useFacelessState } from '../hooks/useFacelessState'
import { FacelessConfig } from '../components/faceless/faceless-config'
import { FacelessPlayer } from '../components/faceless/faceless-player'
import { FacelessSceneList } from '../components/faceless/faceless-scene-list'
import { FacelessExportBar } from '../components/faceless/faceless-export-bar'
import { CapCutGuide } from '../components/faceless/cap-cut-guide'

export default function FacelessPage() {
  const s = useFacelessState()

  return (
    <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-16 pt-4 sm:px-8">

      {/* Neon Halo Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
            <Clapperboard className="size-4" />
          </span>
          <span className="eyebrow text-violet-400">Faceless Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-pg-text md:text-4xl">
          Video <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Faceless</span> Pack CapCut
        </h1>
        <p className="max-w-xl text-sm text-pg-muted leading-relaxed">
          Generez un script IA, telechargez les videos MP4 B-roll + la voix-off MP3, puis montez en 30 secondes dans CapCut.
        </p>
      </div>

      {/* Config */}
      <FacelessConfig
        topic={s.topic} setTopic={s.setTopic}
        niche={s.niche} setNiche={s.setNiche}
        duration={s.duration} setDuration={s.setDuration}
        gender={s.gender} setGender={s.setGender}
        voiceStyle={s.voiceStyle} setVoiceStyle={s.setVoiceStyle}
        onGenerate={s.handleGenerate} busy={s.busy}
      />

      {/* Video Preview + Scene List */}
      {s.isGenerated && s.sceneCount > 0 && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <FacelessPlayer
              activeIdx={s.activeIdx} sceneCount={s.sceneCount} sceneDur={s.sceneDur}
              activeMedia={s.activeMedia} hasVideo={s.hasVideo} scene={s.scene}
              elapsed={s.elapsed} audioDuration={s.audioDuration} playing={s.playing}
              togglePlay={s.togglePlay} jumpTo={s.jumpTo} formatTime={s.formatTime}
            />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-7">
            <FacelessSceneList
              script={s.script} activeIdx={s.activeIdx} playing={s.playing}
              sceneCount={s.sceneCount} sceneDur={s.sceneDur} medias={s.medias}
              downloading={s.downloading} jumpTo={s.jumpTo} togglePlay={s.togglePlay}
              regenerateScene={s.regenerateScene} downloadSceneVideo={s.downloadSceneVideo}
            />
            <FacelessExportBar
              downloading={s.downloading} downloadVoiceOff={s.downloadVoiceOff}
              downloadAllVideos={s.downloadAllVideos} downloadFullPack={s.downloadFullPack}
              exportScript={s.exportScript}
            />
          </div>
        </div>
      )}

      {/* CapCut Guide */}
      <CapCutGuide />
    </div>
  )
}

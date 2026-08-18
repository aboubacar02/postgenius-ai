import { Info } from 'lucide-react'

export function CapCutGuide() {
  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-950/30 p-6 backdrop-blur-md">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <Info className="size-4.5" />
        </span>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-violet-400">Comment monter sur CapCut en 30 secondes</h3>
          <div className="grid gap-2.5 text-xs text-pg-muted leading-relaxed">
            {[
              'Telechargez la voix-off MP3 et les videos MP4 ci-dessus.',
              'Ouvrez CapCut (Mobile ou PC) et creez un Nouveau Projet.',
              "Importez les videos dans l'ordre des scenes et ajoutez le fichier audio en dessous.",
              "Dans CapCut, cliquez sur Textes > Sous-titres automatiques pour afficher les sous-titres animes.",
              'Exportez votre video en 1080p !'
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-500/10 font-mono text-[10px] font-bold text-violet-400">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

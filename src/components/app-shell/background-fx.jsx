export function BackgroundFx() {
  return (
    <div aria-hidden className="aurora">
      <div className="absolute top-[-15%] left-1/2 h-[45vmax] w-[55vmax] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="aurora-grid pointer-events-none" />
    </div>
  )
}

export function HeroGlow({ className = '' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[120px] ${className}`}
      style={{
        background:
          'radial-gradient(ellipse, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 80%)'
      }}
    />
  )
}
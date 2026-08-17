export function BackgroundFx() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99, 102, 241, 0.08), transparent 60%)'
        }}
      />
    </div>
  )
}

export function HeroGlow({ className = '' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[120px] ${className}`}
      style={{
        background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 50%, transparent 80%)'
      }}
    />
  )
}

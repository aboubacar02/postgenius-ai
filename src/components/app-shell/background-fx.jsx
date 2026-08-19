export function BackgroundFx() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden bg-[#090A0F]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 15% -10%, rgba(56, 189, 248, 0.09), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(99, 102, 241, 0.09), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 110%, rgba(168, 85, 247, 0.06), transparent 60%)'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none bg-grid opacity-[0.35]"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 75%)'
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
        background:
          'radial-gradient(ellipse, rgba(56, 189, 248, 0.09) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 80%)'
      }}
    />
  )
}
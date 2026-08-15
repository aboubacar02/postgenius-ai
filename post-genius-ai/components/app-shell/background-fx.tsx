// Ambient, whole-app background: a faint 1px grid masked into a radial
// vignette plus a fine noise film. Kept fixed and behind everything so it
// never interferes with content or scroll performance.
export function BackgroundFx() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="bg-grid absolute inset-0 opacity-60"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 75%)',
        }}
      />
      <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
    </div>
  )
}

// Soft violet glow, meant to sit inside a `relative` hero section only — never
// rendered globally, per the "surgical accent" direction.
export function HeroGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] ${className ?? ''}`}
    />
  )
}

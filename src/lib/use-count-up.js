import { useEffect, useState } from 'react'

export function useCountUp(target, { duration = 800 } = {}) {
  const [value, setValue] = useState(0)
  const numeric = Number(target)

  useEffect(() => {
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setValue(numeric > 0 ? Math.round(numeric) : 0)
      return
    }
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(numeric * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [numeric, duration])

  return value
}

import Lenis from 'lenis'

let lenis: Lenis | null = null

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Lenis smooth scroll (own rAF). It scrolls the real window, so native scroll listeners keep working. */
export function initScroll() {
  if (lenis || typeof window === 'undefined') return lenis
  if (prefersReducedMotion()) return null

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2, autoRaf: true })
  lenis.on('scroll', (e: Lenis) => {
    // velocity feeds marquee skew via a CSS variable (no React re-render)
    document.documentElement.style.setProperty('--velocity', (Math.max(-1, Math.min(1, e.velocity / 40))).toFixed(3))
  })
  if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis
  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToEl(target: HTMLElement) {
  if (lenis) lenis.scrollTo(target, { duration: 1.4, offset: -40 })
  else target.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Progress (0 → 1) of a tall section scrolling past a sticky viewport.
 * 0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom.
 * rAF-throttled, passive — replaces a whole ScrollTrigger dependency.
 */
export function trackProgress(el: HTMLElement, cb: (p: number) => void) {
  let frame = 0
  let last = -1
  const measure = () => {
    frame = 0
    const r = el.getBoundingClientRect()
    const span = r.height - window.innerHeight
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
    if (Math.abs(p - last) > 0.0001) {
      last = p
      cb(p)
    }
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  measure()
  return {
    get progress() {
      return Math.max(0, last)
    },
    refresh: measure,
    kill() {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    },
  }
}

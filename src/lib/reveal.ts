let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null
let queued = 0

/**
 * Elements with [data-reveal] get a `data-in` attribute (not a class: React owns className and would flag it during hydration) once they enter the viewport.
 * All the actual motion lives in CSS (transform/opacity only → GPU, no layout).
 * A MutationObserver picks up nodes added later (route changes commit inside view transitions,
 * filtered lists, etc.), so pages never get stuck invisible.
 */
export function observeReveals(root: ParentNode = document) {
  if (typeof window === 'undefined') return
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '')
            io?.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    )
  }
  if (!mo) {
    mo = new MutationObserver(() => {
      if (queued) return
      queued = requestAnimationFrame(() => {
        queued = 0
        observeReveals()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })
  }
  root.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io!.observe(el))
}

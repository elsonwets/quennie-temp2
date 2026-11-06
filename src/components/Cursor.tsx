import { useEffect, useRef } from 'react'

/**
 * A soft brass ring that trails the native cursor (native cursor stays — accessibility first).
 * Elements with [data-cursor="Ver"] expand it into a labelled disc.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current!
    const pos = { x: -100, y: -100 }
    const cur = { x: -100, y: -100 }
    let raf = 0
    const update = (target: Element | null) => {
      const t = target?.closest<HTMLElement>('[data-cursor], a, button')
      const text = t?.dataset.cursor
      el.classList.toggle('is-label', !!text)
      el.classList.toggle('is-link', !!t && !text)
      if (text && label.current) label.current.textContent = text
    }
    const move = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      update(e.target as Element | null)
    }
    // content moves under a still pointer on scroll / route change → re-hit-test
    let hit = 0
    const rehit = () => {
      if (hit) return
      hit = requestAnimationFrame(() => {
        hit = 0
        update(document.elementFromPoint(pos.x, pos.y))
      })
    }
    window.addEventListener('scroll', rehit, { passive: true })
    const mo = new MutationObserver(rehit)
    mo.observe(document.body, { childList: true, subtree: true })
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2
      cur.y += (pos.y - cur.y) * 0.2
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const leave = () => el.classList.add('is-gone')
    const enter = () => el.classList.remove('is-gone')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    raf = requestAnimationFrame(loop)
    el.classList.add('is-on')
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('scroll', rehit)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label" />
    </div>
  )
}

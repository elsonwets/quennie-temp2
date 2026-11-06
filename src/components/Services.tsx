import { useEffect, useRef, useState } from 'react'
import { img, services } from '../content'
import { Split } from './Split'

/** Editorial service list — on desktop a photo floats after the cursor while hovering a row. */
export function Services() {
  const [active, setActive] = useState<number | null>(null)
  const float = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = float.current!
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    let raf = 0
    const move = (e: PointerEvent) => {
      const r = list.current!.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
    }
    const loop = () => {
      const dx = target.x - cur.x
      cur.x += dx * 0.12
      cur.y += (target.y - cur.y) * 0.12
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) rotate(${Math.max(-8, Math.min(8, dx * 0.04))}deg)`
      raf = requestAnimationFrame(loop)
    }
    list.current!.addEventListener('pointermove', move)
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="servicos" className="services section" aria-labelledby="servicos-title">
      <header className="section__head">
        <p className="eyebrow" data-reveal>
          O que fazemos
        </p>
        <Split id="servicos-title" as="h2" text="Um só atelier, da planta à última almofada." italic={[5, 6, 7]} className="h2" />
        <p className="section__lede" data-reveal>
          Desenhamos, remodelamos e produzimos. Mobiliário e cortinados saem do nosso fabrico — por isso cada peça encaixa exatamente no seu espaço.
        </p>
      </header>

      <div ref={list} className="services__wrap" onPointerLeave={() => setActive(null)}>
      <ol className="services__list">
        {services.map((s, i) => (
          <li key={s.n} className={`services__row${active === i ? ' is-active' : ''}`} onPointerEnter={() => setActive(i)} data-reveal style={{ '--d': i } as React.CSSProperties}>
            <span className="services__n">{s.n}</span>
            <h3 className="services__title">{s.title}</h3>
            <p className="services__text">{s.text}</p>
            <img className="services__thumb" src={img(s.image, 600)} alt="" loading="lazy" />
          </li>
        ))}
      </ol>
        <div ref={float} className="services__float" aria-hidden="true">
          {services.map((s, i) => (
            <img key={s.n} src={img(s.image, 700)} alt="" loading="lazy" className={active === i ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

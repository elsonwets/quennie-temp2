import { useEffect, useRef, useState } from 'react'
import { img, srcSet, whatsappLink } from '../content'
import { trackProgress } from '../lib/scroll'
import type { CurtainScene } from '../three/curtain'
import { ArrowIcon, WhatsAppIcon } from './Icons'
import { Link } from '@tanstack/react-router'

const ROOM = '1618221195710-dd6b41faaea6'

export function CurtainHero() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [gl, setGl] = useState(false)

  useEffect(() => {
    const el = section.current!
    let scene: CurtainScene | null = null
    let disposed = false
    let visible = true

    // drive progress as a CSS variable (DOM layers) + shader uniform (WebGL layer)
    const st = trackProgress(el, (p) => {
      el.style.setProperty('--p', p.toFixed(4))
      el.classList.toggle('is-open', p > 0.28)
      scene?.setOpen(Math.min(1, p * 1.25))
    })

    // load three.js after first paint — the CSS drape is already on screen (fast LCP)
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 600 }) : setTimeout(cb, 120))
    idle(async () => {
      const { createCurtain } = await import('../three/curtain')
      if (disposed || !canvas.current) return
      scene = createCurtain(canvas.current)
      if (!scene) return
      scene.setOpen(Math.min(1, st.progress * 1.25))
      if (visible) scene.start()
      setGl(true)
    })

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!scene) return
      if (visible) scene.start()
      else scene.stop()
    })
    io.observe(el)

    const onMove = (e: PointerEvent) => {
      if (!scene || !visible) return
      const r = canvas.current!.getBoundingClientRect()
      scene.setPointer((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
    }
    const onResize = () => scene?.resize()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      st.kill()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      scene?.dispose()
    }
  }, [])

  return (
    <section ref={section} className={`hero${gl ? ' has-gl' : ''}`} aria-labelledby="hero-title">
      <div className="hero__sticky">
        {/* the room behind the curtain */}
        <div className="hero__stage">
          <figure className="hero__arch">
            <img src={img(ROOM, 1400)} srcSet={srcSet(ROOM, [640, 1000, 1400, 2000])} sizes="(max-width: 768px) 80vw, 38vw" alt="Sala de estar com luz natural, sofá em tons neutros e madeira — interior Quennie" fetchPriority="high" />
          </figure>
          <div className="hero__after">
            <p className="hero__after-line">
              Por trás de cada cortina,
              <br />
              <em>um espaço pensado ao detalhe.</em>
            </p>
            <Link to="/projetos" className="link-arrow link-arrow--light" data-cursor="Ver">
              Ver projetos realizados <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* CSS drape (instant paint + no-WebGL fallback) and WebGL drape */}
        <div className="hero__fallback" aria-hidden="true">
          <span />
          <span />
        </div>
        <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />

        {/* message — readable in under five seconds */}
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__eyebrow">Quennie · Design de Interiores, Remodelações, Mobiliário &amp; Cortinados à medida</span>
            <span className="hero__line">
              <span>Interiores</span>
            </span>
            <span className="hero__line">
              <span>
                que se <em>vivem.</em>
              </span>
            </span>
          </h1>
          <div className="hero__foot">
            <p className="hero__sub">
              Do projeto 3D à última peça montada — para <strong>casas, escritórios, hotéis e restaurantes</strong> na Guiné-Bissau e em Portugal.
            </p>
            <div className="hero__ctas">
              <a className="btn btn--light" href={whatsappLink()} target="_blank" rel="noopener">
                <WhatsAppIcon /> Pedir orçamento
              </a>
              <Link to="/projetos" className="btn btn--ghost-light">
                Ver projetos <ArrowIcon />
              </Link>
            </div>
          </div>
          <p className="hero__hint" aria-hidden="true">
            <span className="hero__hint-line" /> Deslize para abrir a cortina
          </p>
        </div>
      </div>
    </section>
  )
}

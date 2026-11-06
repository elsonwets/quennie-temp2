import { useEffect, useRef, useState } from 'react'
import { process } from '../content'
import { trackProgress } from '../lib/scroll'
import type { RoomScene } from '../three/room'

/** Pinned section: the room assembles itself in 3D as the four steps scroll by. */
export function Process() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = section.current!
    let scene: RoomScene | null = null
    let disposed = false
    let progress = 0
    let inView = false

    const st = trackProgress(el, (p) => {
        progress = p
        el.style.setProperty('--pp', progress.toFixed(4))
        setStep(Math.min(3, Math.floor(progress * 4 + 0.0001)))
        scene?.setProgress(progress)
    })

    // only fetch the 3D scene when the section approaches the viewport
    const io = new IntersectionObserver(
      async ([e]) => {
        inView = e.isIntersecting
        if (inView && !scene && !disposed) {
          const { createRoom } = await import('../three/room')
          if (disposed || !canvas.current) return
          scene = createRoom(canvas.current)
          if (!scene) return
          scene.setProgress(progress)
          setReady(true)
        }
        if (!scene) return
        if (inView) scene.start()
        else scene.stop()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    const onResize = () => scene?.resize()
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      st.kill()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      scene?.dispose()
    }
  }, [])

  return (
    <section id="processo" ref={section} className="process" aria-labelledby="processo-title">
      <div className="process__sticky">
        <div className="process__text">
          <p className="eyebrow">Como trabalhamos</p>
          <h2 id="processo-title" className="h2">
            Veja o seu espaço <em>antes</em> de ele existir.
          </h2>
          <ol className="process__steps">
            {process.map((s, i) => (
              <li key={s.n} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                <span className="process__n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={`process__canvas${ready ? ' is-ready' : ''}`}>
          <canvas ref={canvas} aria-label="Modelo 3D de uma sala a ser construída passo a passo" role="img" />
          <div className="process__bar" aria-hidden="true">
            <span />
          </div>
          <p className="process__caption" aria-hidden="true">
            {['Planta', 'Volumes 3D', 'Materiais', 'Luz & entrega'][step]}
          </p>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { testimonials } from '../content'

export function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = testimonials.length

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI((v) => (v + 1) % n), 7000)
    return () => clearTimeout(t)
  }, [i, paused, n])

  return (
    <section className="reviews section" aria-labelledby="reviews-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="reviews__head">
        <p className="eyebrow" data-reveal>
          Avaliações de clientes
        </p>
        <h2 id="reviews-title" className="h2 reviews__title" data-reveal>
          Quem já <em>vive</em> um espaço Quennie.
        </h2>
      </div>

      <div className="reviews__stage" aria-live="polite">
        {testimonials.map((t, k) => (
          <figure key={k} className={`review${k === i ? ' is-on' : ''}`} aria-hidden={k !== i}>
            <blockquote>
              <span className="review__mark" aria-hidden="true">
                “
              </span>
              {t.quote}
            </blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <span>{t.context}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="reviews__nav">
        <span className="reviews__count">
          {String(i + 1).padStart(2, '0')} <span>/ {String(n).padStart(2, '0')}</span>
        </span>
        <div className="reviews__dots" role="tablist" aria-label="Escolher avaliação">
          {testimonials.map((t, k) => (
            <button key={k} role="tab" aria-selected={k === i} aria-label={`Avaliação de ${t.name}`} className={k === i ? 'is-on' : ''} onClick={() => setI(k)}>
              <span style={{ animationPlayState: paused ? 'paused' : 'running' }} key={k === i ? `on-${i}` : 'off'} />
            </button>
          ))}
        </div>
        <div className="reviews__arrows">
          <button onClick={() => setI((i - 1 + n) % n)} aria-label="Avaliação anterior">
            ←
          </button>
          <button onClick={() => setI((i + 1) % n)} aria-label="Avaliação seguinte">
            →
          </button>
        </div>
      </div>
    </section>
  )
}

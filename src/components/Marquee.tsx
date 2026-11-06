import { sectors } from '../content'

/** Sector ribbon — CSS-only loop; skews with scroll velocity via --velocity (set by Lenis). */
export function Marquee() {
  const row = [...sectors, ...sectors]
  return (
    <section className="marquee" aria-label="Setores: Casas, Espaços Comerciais, Hotelaria, Restauração, Escritórios">
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((k) => (
          <div className="marquee__group" key={k}>
            {row.map((s, i) => (
              <span key={i} className="marquee__item">
                {i % 2 ? <em>{s}</em> : s}
                <span className="marquee__dot">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

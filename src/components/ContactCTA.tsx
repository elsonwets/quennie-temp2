import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { contact, whatsappLink } from '../content'
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from './Icons'

/** Terracotta "drenched" closing block with a magnetic primary CTA. */
export function ContactCTA({ message }: { message?: string }) {
  const btn = useRef<HTMLAnchorElement>(null)

  const onMove = (e: React.PointerEvent) => {
    const b = btn.current
    if (!b || e.pointerType !== 'mouse') return
    const r = b.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    if (Math.hypot(x, y) < 220) b.style.transform = `translate3d(${x * 0.25}px, ${y * 0.3}px, 0)`
    else b.style.transform = ''
  }

  return (
    <section className="cta" onPointerMove={onMove} onPointerLeave={() => btn.current && (btn.current.style.transform = '')} aria-labelledby="cta-title">
      <p className="eyebrow" data-reveal>
        Tem um espaço para transformar?
      </p>
      <h2 id="cta-title" className="cta__title" data-reveal>
        Vamos <em>conversar.</em>
      </h2>
      <div className="cta__actions" data-reveal>
        <a ref={btn} className="cta__magnet" href={whatsappLink(message)} target="_blank" rel="noopener">
          <WhatsAppIcon size={26} />
          <span>
            Pedir orçamento
            <small>{contact.whatsappDisplay}</small>
          </span>
        </a>
        <div className="cta__alt">
          <Link to="/contacto" className="link-arrow link-arrow--light">
            Descrever o meu projeto <ArrowIcon />
          </Link>
          <a href={contact.instagram} target="_blank" rel="noopener" className="link-arrow link-arrow--light">
            <InstagramIcon size={16} /> @quennieinteriordesign
          </a>
        </div>
      </div>
    </section>
  )
}

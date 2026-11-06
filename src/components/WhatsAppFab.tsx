import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { whatsappLink } from '../content'
import { WhatsAppIcon } from './Icons'

/** Always-on contact: one tap from anywhere (slides in once the hero's own CTAs are scrolled past). */
export function WhatsAppFab() {
  const isHome = useRouterState({ select: (s) => s.location.pathname === '/' })
  const [away, setAway] = useState(isHome)
  useEffect(() => {
    const on = () => setAway(isHome && window.scrollY < window.innerHeight * 0.35)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [isHome])
  return (
    <a className={`fab${away ? ' is-away' : ''}`} href={whatsappLink()} target="_blank" rel="noopener" aria-label="Pedir orçamento pelo WhatsApp">
      <span className="fab__pulse" aria-hidden="true" />
      <WhatsAppIcon size={22} />
      <span className="fab__label">Pedir orçamento</span>
    </a>
  )
}

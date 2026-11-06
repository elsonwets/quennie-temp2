import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { whatsappLink } from '../content'
import { getLenis } from '../lib/scroll'
import { ArrowIcon, WhatsAppIcon } from './Icons'
import { Logo } from './Logo'

const links = [
  { to: '/projetos', label: 'Projetos' },
  { to: '/', hash: 'servicos', label: 'Serviços' },
  { to: '/', hash: 'processo', label: 'Processo' },
  { to: '/contacto', label: 'Contacto' },
] as const

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 400 && y > lastY + 2)
      if (y < lastY - 2) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const l = getLenis()
    document.documentElement.classList.toggle('menu-open', open)
    if (open) l?.stop()
    else l?.start()
  }, [open])

  const onDark = pathname === '/' && !scrolled

  return (
    <>
      <a href="#conteudo" className="skip">
        Saltar para o conteúdo
      </a>
      <header className={`nav${scrolled ? ' is-solid' : ''}${hidden && !open ? ' is-hidden' : ''}${onDark && !open ? ' is-dark' : ''}`}>
        <Logo />
        <nav className="nav__links" aria-label="Principal">
          {links.map((l) => (
            <Link key={l.label} to={l.to} hash={'hash' in l ? l.hash : undefined} className="nav__link" activeOptions={{ exact: true, includeHash: true }}>
              <span data-text={l.label}>{l.label}</span>
            </Link>
          ))}
        </nav>
        <a className="btn btn--pill nav__cta" href={whatsappLink()} target="_blank" rel="noopener">
          <WhatsAppIcon size={16} />
          <span>Pedir orçamento</span>
        </a>
        <button className={`burger${open ? ' is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
          <span />
          <span />
        </button>
      </header>

      <div id="menu" className={`menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <ul>
          {links.map((l, i) => (
            <li key={l.label} style={{ '--i': i } as React.CSSProperties}>
              <Link to={l.to} hash={'hash' in l ? l.hash : undefined} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                <span className="menu__n">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a className="btn btn--light menu__cta" href={whatsappLink()} target="_blank" rel="noopener" tabIndex={open ? 0 : -1}>
          <WhatsAppIcon /> Falar no WhatsApp <ArrowIcon />
        </a>
      </div>
    </>
  )
}

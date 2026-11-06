import { HeadContent, Link, Outlet, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Cursor } from '../components/Cursor'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { WhatsAppFab } from '../components/WhatsAppFab'
import { observeReveals } from '../lib/reveal'
import { initScroll, scrollToEl, scrollToTop } from '../lib/scroll'
import { businessLd, jsonLd } from '../seo'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#a85f38' },
      { name: 'format-detection', content: 'telephone=no' },
      { title: 'Quennie — Design de Interiores & Remodelações' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
    scripts: [jsonLd(businessLd)],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <head>
        <HeadContent />
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}.split__word{transform:none!important}'}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const location = useRouterState({ select: (s) => s.location })

  useEffect(() => {
    initScroll()
  }, [])

  // per-navigation: reset scroll (or jump to #hash), re-arm reveals, re-measure triggers
  useEffect(() => {
    const hash = location.hash
    requestAnimationFrame(() => {
      if (hash) {
        const el = document.getElementById(hash)
        if (el) scrollToEl(el)
      } else {
        scrollToTop()
      }
      observeReveals()
      window.dispatchEvent(new Event('resize'))
    })
  }, [location.pathname, location.hash])

  return (
    <>
      <Nav />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

function NotFound() {
  return (
    <section className="notfound">
      <p className="eyebrow">Erro 404</p>
      <h1 className="h1">
        Esta divisão <em>ainda não existe.</em>
      </h1>
      <Link to="/" className="btn btn--dark">
        Voltar ao início
      </Link>
    </section>
  )
}

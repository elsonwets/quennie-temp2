import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from '../components/Icons'
import { Split } from '../components/Split'
import { contact, whatsappLink } from '../content'
import { seo } from '../seo'

export const Route = createFileRoute('/contacto')({
  head: () =>
    seo({
      title: 'Pedir Orçamento de Design de Interiores — Fale com a Quennie',
      description:
        'Conte-nos o seu projeto em 1 minuto: casa, escritório, hotel ou restaurante. Resposta direta pelo WhatsApp, sem formulários intermináveis. Guiné-Bissau e Portugal.',
      path: '/contacto',
    }),
  component: ContactPage,
})

const spaces = ['Casa', 'Escritório', 'Loja', 'Hotel', 'Restaurante']
const needs = ['Design de Interiores', 'Remodelação', 'Mobiliário à medida', 'Cortinados & Estores']

function ContactPage() {
  const [space, setSpace] = useState('Casa')
  const [want, setWant] = useState<string[]>(['Design de Interiores'])
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [msg, setMsg] = useState('')

  const toggle = (n: string) => setWant((w) => (w.includes(n) ? w.filter((x) => x !== n) : [...w, n]))

  const message = [
    `Olá Quennie! ${name ? `Sou ${name}. ` : ''}Gostaria de pedir um orçamento.`,
    `• Espaço: ${space}${city ? ` (${city})` : ''}`,
    want.length ? `• Serviços: ${want.join(', ')}` : '',
    msg ? `• Projeto: ${msg}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(whatsappLink(message), '_blank', 'noopener')
  }

  return (
    <section className="contact">
      <div className="contact__intro">
        <p className="eyebrow" data-reveal>
          Contacto · Orçamento
        </p>
        <Split as="h1" className="h1" text="Vamos falar do seu espaço." italic={[4]} />
        <p className="page-hero__lede" data-reveal>
          A forma mais rápida é o WhatsApp. Escreva-nos diretamente ou preencha os campos ao lado — preparamos a mensagem por si.
        </p>

        <a className="contact__wa" href={whatsappLink()} target="_blank" rel="noopener" data-reveal>
          <WhatsAppIcon size={28} />
          <span>
            <small>WhatsApp direto</small>
            {contact.whatsappDisplay}
          </span>
        </a>

        <ul className="contact__social" data-reveal>
          <li>
            <a href={contact.instagram} target="_blank" rel="noopener">
              <InstagramIcon /> Instagram
            </a>
          </li>
          <li>
            <a href={contact.facebook} target="_blank" rel="noopener">
              <FacebookIcon /> Facebook
            </a>
          </li>
          <li>
            <a href={contact.tiktok} target="_blank" rel="noopener">
              <TikTokIcon /> TikTok
            </a>
          </li>
        </ul>
        <p className="contact__regions" data-reveal>
          Projetos na <strong>Guiné-Bissau</strong> e em <strong>Portugal</strong>.
        </p>
      </div>

      <form className="brief" onSubmit={submit} data-reveal>
        <fieldset>
          <legend>Que espaço quer transformar?</legend>
          <div className="brief__chips">
            {spaces.map((s) => (
              <label key={s} className={`chip${space === s ? ' is-on' : ''}`}>
                <input type="radio" name="space" value={s} checked={space === s} onChange={() => setSpace(s)} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Do que precisa?</legend>
          <div className="brief__chips">
            {needs.map((n) => (
              <label key={n} className={`chip${want.includes(n) ? ' is-on' : ''}`}>
                <input type="checkbox" checked={want.includes(n)} onChange={() => toggle(n)} />
                {n}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="brief__row">
          <label className="field">
            <span>O seu nome</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ex.: Mariama" />
          </label>
          <label className="field">
            <span>Cidade</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" placeholder="Ex.: Bissau" />
          </label>
        </div>

        <label className="field">
          <span>Conte-nos em poucas palavras</span>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Ex.: Sala de 30 m², quero cortinados novos e um móvel de TV à medida." />
        </label>

        <div className="brief__preview" aria-live="polite">
          <p className="eyebrow">Pré-visualização da mensagem</p>
          <pre>{message}</pre>
        </div>

        <button type="submit" className="btn btn--terra brief__submit">
          <WhatsAppIcon /> Enviar pelo WhatsApp
        </button>
      </form>
    </section>
  )
}

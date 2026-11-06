import { createFileRoute } from '@tanstack/react-router'
import { ContactCTA } from '../components/ContactCTA'
import { CurtainHero } from '../components/CurtainHero'
import { Featured } from '../components/Featured'
import { Marquee } from '../components/Marquee'
import { Process } from '../components/Process'
import { Services } from '../components/Services'
import { Split } from '../components/Split'
import { Testimonials } from '../components/Testimonials'
import { stats } from '../content'
import { seo } from '../seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: 'Quennie — Design de Interiores que Transforma Casas e Negócios',
      description:
        'Projeto 3D, remodelação, mobiliário e cortinados feitos à medida — tudo num só atelier. Casas, escritórios, hotéis e restaurantes na Guiné-Bissau e em Portugal. Peça já o seu orçamento.',
      path: '/',
    }),
  component: Home,
})

function Home() {
  return (
    <>
      <CurtainHero />

      <section className="intro section" aria-label="Sobre a Quennie">
        <Split
          as="p"
          className="intro__statement"
          text="Um interior vai muito além de escolher peças bonitas: é perceber o espaço e fazer com que todas as escolhas funcionem em conjunto."
          italic={[10, 11, 12]}
        />
        <dl className="intro__stats">
          {stats.map((s) => (
            <div key={s.label} data-reveal>
              <dt>{s.label}</dt>
              <dd>
                {s.value}
                <span>{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Services />
      <Marquee />
      <Featured />
      <Process />
      <Testimonials />
      <ContactCTA />
    </>
  )
}

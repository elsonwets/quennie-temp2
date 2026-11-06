import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ContactCTA } from '../components/ContactCTA'
import { ProjectCard } from '../components/ProjectCard'
import { Split } from '../components/Split'
import { categories, projects } from '../content'
import { observeReveals } from '../lib/reveal'
import { jsonLd, portfolioLd, seo } from '../seo'

export const Route = createFileRoute('/projetos/')({
  head: () => ({
    ...seo({
      title: 'Projetos Realizados — Salas, Escritórios e Hotéis | Quennie',
      description:
        'Veja antes de decidir: salas, quartos, escritórios, suites de hotel e restaurantes desenhados, remodelados e mobilados pela Quennie. Inspire-se no seu próximo espaço.',
      path: '/projetos',
    }),
    scripts: [jsonLd(portfolioLd)],
  }),
  component: ProjectsPage,
})

function ProjectsPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>('Todos')
  const list = useMemo(() => (cat === 'Todos' ? projects : projects.filter((p) => p.category === cat)), [cat])

  const choose = (c: typeof cat) => {
    const apply = () => {
      setCat(c)
      requestAnimationFrame(() => observeReveals())
    }
    if ('startViewTransition' in document) (document as any).startViewTransition(apply)
    else apply()
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow" data-reveal>
          Portfólio · {projects.length} projetos
        </p>
        <Split as="h1" className="h1" text="Projetos realizados." italic={[1]} />
        <p className="page-hero__lede" data-reveal>
          O resultado final é apenas a última fase. Antes dele há obra, decisões, produção e montagem — e cada uma conta no espaço que entregamos.
        </p>
        <div className="filters" role="group" aria-label="Filtrar projetos por setor" data-reveal>
          {categories.map((c) => {
            const count = c === 'Todos' ? projects.length : projects.filter((p) => p.category === c).length
            return (
              <button key={c} className={`chip${c === cat ? ' is-on' : ''}`} aria-pressed={c === cat} onClick={() => choose(c)} disabled={count === 0}>
                {c} <sup>{count}</sup>
              </button>
            )
          })}
        </div>
      </section>

      <section className="projects-grid" aria-label="Lista de projetos">
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} size={i % 3 === 0 ? 'lg' : 'md'} eager={i < 2} />
        ))}
      </section>

      <ContactCTA message="Olá Quennie! Vi os vossos projetos e gostaria de pedir um orçamento." />
    </>
  )
}

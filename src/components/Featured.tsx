import { Link } from '@tanstack/react-router'
import { projects } from '../content'
import { ArrowIcon } from './Icons'
import { ProjectCard } from './ProjectCard'
import { Split } from './Split'

export function Featured() {
  const picks = projects.slice(0, 4)
  return (
    <section className="featured section" aria-labelledby="featured-title">
      <header className="section__head section__head--row">
        <div>
          <p className="eyebrow" data-reveal>
            Projetos realizados
          </p>
          <Split id="featured-title" as="h2" text="Espaços que já ganharam vida." italic={[3, 4]} className="h2" />
        </div>
        <Link to="/projetos" className="link-arrow" data-reveal>
          Ver todos os projetos <ArrowIcon />
        </Link>
      </header>
      <div className="featured__grid">
        {picks.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} size={i === 0 || i === 3 ? 'lg' : 'md'} />
        ))}
      </div>
    </section>
  )
}

import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ContactCTA } from '../components/ContactCTA'
import { ArrowIcon } from '../components/Icons'
import { SITE_URL, img, projects, srcSet } from '../content'
import { jsonLd, seo } from '../seo'

export const Route = createFileRoute('/projetos/$slug')({
  loader: ({ params }) => {
    const index = projects.findIndex((p) => p.slug === params.slug)
    if (index < 0) throw notFound()
    return { project: projects[index], next: projects[(index + 1) % projects.length] }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const p = loaderData.project
    const name = `${p.title} ${p.italic}`
    return {
      ...seo({
        title: `${name} — ${p.category}: Projeto de Interiores | Quennie`,
        description: `${p.excerpt} ${p.services.join(', ')}. Descubra o projeto completo.`,
        path: `/projetos/${p.slug}`,
        image: img(p.cover, 1200, 75),
        type: 'article',
      }),
      scripts: [
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name,
          description: p.excerpt,
          image: [p.cover, ...p.gallery].map((id) => img(id, 1600)),
          url: `${SITE_URL}/projetos/${p.slug}`,
          creator: { '@id': `${SITE_URL}/#business` },
          dateCreated: p.year,
          genre: p.category,
        }),
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Projetos', item: `${SITE_URL}/projetos` },
            { '@type': 'ListItem', position: 3, name, item: `${SITE_URL}/projetos/${p.slug}` },
          ],
        }),
      ],
    }
  },
  component: ProjectPage,
})

function ProjectPage() {
  const { project: p, next } = Route.useLoaderData()

  return (
    <article className="project">
      <header className="project__head">
        <nav className="crumbs" aria-label="Breadcrumb" data-reveal>
          <Link to="/projetos">Projetos</Link> <span>/</span> {p.category}
        </nav>
        <h1 className="project__title" data-reveal>
          {p.title} <em>{p.italic}</em>
        </h1>
        <dl className="project__meta" data-reveal>
          <div>
            <dt>Setor</dt>
            <dd>{p.category}</dd>
          </div>
          <div>
            <dt>Espaço</dt>
            <dd>{p.place}</dd>
          </div>
          <div>
            <dt>Ano</dt>
            <dd>{p.year}</dd>
          </div>
          <div>
            <dt>Serviços</dt>
            <dd>{p.services.join(' · ')}</dd>
          </div>
        </dl>
      </header>

      <figure className="project__cover">
        <img
          src={img(p.cover, 2000)}
          srcSet={srcSet(p.cover, [800, 1200, 1800, 2400])}
          sizes="100vw"
          alt={`${p.title} ${p.italic} — ${p.place}, projeto Quennie`}
          fetchPriority="high"
          style={{ viewTransitionName: `cover-${p.slug}` }}
        />
      </figure>

      <section className="project__story">
        <p className="project__excerpt" data-reveal>
          {p.excerpt}
        </p>
        <div className="project__cols">
          {p.story.map((t, i) => (
            <p key={i} data-reveal style={{ '--d': i } as React.CSSProperties}>
              {t}
            </p>
          ))}
        </div>
        <div className="palette" data-reveal>
          <p className="eyebrow">Paleta do projeto</p>
          <ul>
            {p.palette.map((c) => (
              <li key={c} style={{ background: c }}>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="project__gallery" aria-label="Galeria">
        {p.gallery.map((id, i) => (
          <figure key={id} className={`g g--${i}`} data-reveal>
            <img src={img(id, 1400)} srcSet={srcSet(id, [600, 1000, 1400])} sizes={i === 0 ? '(max-width:768px) 92vw, 60vw' : '(max-width:768px) 92vw, 40vw'} alt={`${p.title} ${p.italic} — detalhe ${i + 1}`} loading="lazy" decoding="async" />
          </figure>
        ))}
      </section>

      <Link to="/projetos/$slug" params={{ slug: next.slug }} className="next" data-cursor="Abrir">
        <span className="eyebrow">Próximo projeto</span>
        <span className="next__title">
          {next.title} <em>{next.italic}</em>
          <ArrowIcon size={40} />
        </span>
        <img src={img(next.cover, 900)} alt="" loading="lazy" className="next__img" />
      </Link>

      <ContactCTA message={`Olá Quennie! Vi o projeto "${p.title} ${p.italic}" e gostaria de algo semelhante.`} />
    </article>
  )
}

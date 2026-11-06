import { Link } from '@tanstack/react-router'
import type { Project } from '../content'
import { img, srcSet } from '../content'

type Props = { project: Project; index: number; size?: 'lg' | 'md' | 'sm'; eager?: boolean }

export function ProjectCard({ project: p, index, size = 'md', eager }: Props) {
  return (
    <Link to="/projetos/$slug" params={{ slug: p.slug }} className={`pcard pcard--${size}`} data-cursor="Ver" data-reveal style={{ '--d': index % 3 } as React.CSSProperties}>
      <div className="pcard__media">
        <img
          src={img(p.cover, 1200)}
          srcSet={srcSet(p.cover, [480, 800, 1200, 1600])}
          sizes={size === 'lg' ? '(max-width: 768px) 92vw, 58vw' : '(max-width: 768px) 92vw, 36vw'}
          alt={`${p.title} ${p.italic} — ${p.place}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ viewTransitionName: `cover-${p.slug}` }}
        />
      </div>
      <div className="pcard__meta">
        <span className="pcard__n">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="pcard__title">
          {p.title} <em>{p.italic}</em>
        </h3>
        <span className="pcard__cat">
          {p.category} · {p.year}
        </span>
      </div>
    </Link>
  )
}

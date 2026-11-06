import { Fragment } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** words (0-based index) rendered in italic serif */
  italic?: number[]
  delay?: number
  id?: string
  children?: ReactNode
}

/**
 * Word-masked line reveal. Each word slides up from behind its own mask.
 * Italic words are a single span (no per-char split) to avoid the transparent-gradient gotcha.
 */
export function Split({ text, as: Tag = 'span', className, italic = [], delay = 0, id }: Props) {
  const words = text.split(' ')
  return (
    <Tag id={id} className={`split ${className ?? ''}`} data-reveal>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split__mask">
            <span className={`split__word${italic.includes(i) ? ' is-italic' : ''}`} style={{ '--i': i + delay } as CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

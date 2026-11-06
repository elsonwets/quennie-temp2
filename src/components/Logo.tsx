import { Link } from '@tanstack/react-router'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="Quennie — página inicial">
      <span className="logo__word">Quennie</span>
      <span className="logo__tag">Home Concept &amp; Interior Design</span>
    </Link>
  )
}

import { Link } from 'react-router-dom'

export default function Brand({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`} aria-label="RideX home">
      <span className="h-8 w-8 rounded-full bg-ink" aria-hidden="true" />
      <span className="text-lg font-medium tracking-tight text-ink">RideX</span>
    </Link>
  )
}

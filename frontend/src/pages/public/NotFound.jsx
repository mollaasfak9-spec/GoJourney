import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft">
        <MapPin className="h-6 w-6 text-muted" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-3xl font-medium tracking-tight text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-strong">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-on-ink shadow-button transition-colors hover:bg-ink/90"
      >
        Back to home
      </Link>
    </div>
  )
}

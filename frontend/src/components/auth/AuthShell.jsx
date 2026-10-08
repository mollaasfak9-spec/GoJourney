import MapPlaceholder from '../common/MapPlaceholder'
import Brand from '../layout/Brand'
import { Navigation } from 'lucide-react'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <div className="flex w-full flex-col justify-center px-5 py-10 sm:px-10 lg:w-1/2 lg:px-16">
        <Brand className="mb-10 self-start" />
        <div className="mx-auto w-full max-w-[400px]">
          <h1 className="text-3xl font-medium tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted-strong">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 overflow-hidden rounded-l-3xl border-l border-line bg-[linear-gradient(180deg,rgb(var(--color-map-block))_0%,rgb(var(--color-paper))_100%)]">
          <MapPlaceholder className="h-full w-full" />
        </div>
        <div className="absolute bottom-8 left-8 right-8 max-w-xs rounded-3xl border border-line bg-surface p-5 shadow-float">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft">
              <Navigation className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Your ride is one tap away</p>
              <p className="text-xs text-muted">Average pickup 2–5 min</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-soft px-3 py-2.5 text-sm text-muted-strong">
            <span className="h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
            GMIT College
            <span className="text-muted">→</span>
            <span className="h-2 w-2 rounded-full bg-pin" aria-hidden="true" />
            Baruipur Station
          </div>
        </div>
      </div>
    </div>
  )
}

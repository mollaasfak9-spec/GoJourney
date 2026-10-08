import { ChevronRight } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { formatDate, formatINR } from '../../utils/format'

export default function RideCard({ ride, onClick, footer }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-ink">
          {ride.pickup} <span className="text-muted">→</span> {ride.destination}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          {formatDate(ride.date)}
          {ride.distance ? ` • ${ride.distance} km` : ''}
          {footer ? ` • ${footer}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <StatusBadge status={ride.status} />
        <span className="w-16 text-right text-base font-medium tabular-nums text-ink">
          {ride.fare ? formatINR(ride.fare) : '—'}
        </span>
        <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </button>
  )
}

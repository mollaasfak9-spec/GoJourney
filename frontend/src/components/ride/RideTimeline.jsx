import { RIDE_FLOW } from '../../constants/mockData'

const LABELS = {
  requested: 'Ride requested',
  accepted: 'Driver accepted',
  driver_arriving: 'Driver arriving',
  driver_arrived: 'Driver arrived',
  started: 'Ride started',
  completed: 'Ride completed',
}

const STOP_BEFORE = {
  requested: 1,
  accepted: 2,
  driver_arriving: 3,
  driver_arrived: 4,
  started: 5,
  completed: 6,
}

export default function RideTimeline({ status, times = {}, className = '' }) {
  if (status === 'cancelled') {
    return (
      <div className={`rounded-2xl border border-line bg-surface-soft px-4 py-3 text-sm text-muted-strong ${className}`}>
        This ride was cancelled before completion.
      </div>
    )
  }

  const visible = RIDE_FLOW.slice(0, STOP_BEFORE[status] ?? 1)

  return (
    <ol className={`relative ${className}`}>
      {visible.map((step, index) => {
        const isLast = index === visible.length - 1
        const isCurrent = isLast && status !== 'completed'
        return (
          <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast && <span className="absolute left-[7px] top-4 h-full w-0.5 bg-ink" aria-hidden="true" />}
            <span className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
              <span
                className={`h-4 w-4 rounded-full border-2 ${
                  isCurrent ? 'border-ink bg-surface' : 'border-ink bg-ink'
                }`}
              />
              {isCurrent && (
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-ink/20" aria-hidden="true" />
              )}
            </span>
            <div className="flex flex-1 items-baseline justify-between gap-3">
              <span className={`text-sm ${isCurrent ? 'font-medium text-ink' : 'text-ink-soft'}`}>
                {LABELS[step]}
              </span>
              <span className="text-[13px] text-muted tabular-nums">{times[step] || (isCurrent ? 'Now' : '')}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

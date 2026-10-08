import { formatINR } from '../../utils/format'

export default function RequestCard({ request, onAccept, onReject, index = 0 }) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-line bg-surface p-4 sm:p-5"
      style={{ animation: `rise 320ms cubic-bezier(0.22,1,0.36,1) ${index * 60}ms both` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-medium text-ink">
              {request.passenger
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{request.passenger}</p>
              <p className="text-[13px] text-muted">
                {request.distance} km • {request.eta}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink bg-surface" aria-hidden="true" />
            <span className="truncate text-muted-strong">{request.pickup}</span>
          </div>
          <span className="my-1 ml-[4px] block h-3 w-0.5 bg-line" aria-hidden="true" />
          <div className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-pin" aria-hidden="true" />
            <span className="truncate text-muted-strong">{request.destination}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-medium tabular-nums text-ink">{formatINR(request.fare)}</p>
          <p className="text-[13px] text-muted">estimated fare</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onReject?.(request)}
          className="h-11 flex-1 rounded-full border border-line bg-surface text-sm font-medium text-ink-soft transition hover:bg-surface-soft"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => onAccept?.(request)}
          className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
        >
          Accept
        </button>
      </div>

      <span
        className="absolute inset-x-0 bottom-0 h-1 origin-left bg-ink/70"
        style={{ animation: 'drain 12s linear forwards' }}
        aria-hidden="true"
      />
    </article>
  )
}

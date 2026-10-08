import { RIDE_STATUS_LABEL } from '../../constants/mockData'

const TONES = {
  requested: 'requested',
  accepted: 'accepted',
  driver_arriving: 'driver_arriving',
  driver_arrived: 'driver_arrived',
  started: 'started',
  completed: 'completed',
  cancelled: 'cancelled',
  verified: 'driver_arrived',
  pending: 'requested',
  active: 'driver_arrived',
  inactive: 'completed',
  suspended: 'cancelled',
  suspended_: 'cancelled',
  captured: 'driver_arrived',
  refunded: 'accepted',
  failed: 'cancelled',
}

function tintedStyle(status) {
  return {
    backgroundColor: `rgb(var(--color-status-${status}) / 0.14)`,
    color: 'rgb(var(--color-status-' + status + '))',
  }
}

export default function StatusBadge({ status, label, className = '' }) {
  const tone = TONES[status] || 'completed'
  const text = label || RIDE_STATUS_LABEL[status] || status
  const isLive = status === 'accepted' || status === 'driver_arriving' || status === 'started'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium capitalize ${className}`}
      style={tintedStyle(tone)}
    >
      {isLive && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />}
      {text}
    </span>
  )
}

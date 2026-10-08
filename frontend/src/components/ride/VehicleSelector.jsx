import { Check } from 'lucide-react'
import { BOOKING_VEHICLES } from '../../utils/fare'
import { formatINR } from '../../utils/format'

export default function VehicleSelector({ value, onChange, fares = {}, className = '' }) {
  return (
    <div role="radiogroup" aria-label="Vehicle type" className={`grid grid-cols-3 gap-3 ${className}`}>
      {BOOKING_VEHICLES.map((vehicle) => {
        const isSelected = vehicle.id === value
        const fare = fares[vehicle.id]
        return (
          <button
            key={vehicle.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange?.(vehicle.id)}
            className={`relative rounded-2xl border bg-surface p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
              isSelected ? 'border-ink' : 'border-line hover:bg-surface-soft/60'
            }`}
          >
            {isSelected && (
              <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-on-ink">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
            )}
            <span className="block text-sm font-medium text-ink">{vehicle.label}</span>
            <span className="mt-0.5 block text-[13px] text-muted">{vehicle.eta}</span>
            <span className="mt-2 block text-sm font-medium tabular-nums text-ink">
              {fare != null ? formatINR(fare) : '—'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

import Modal from '../common/Modal'
import { User } from 'lucide-react'
import carPlaceholder from '../../assets/car-placeholder.jpg'
import { VEHICLE_TYPE_LABELS } from '../../constants/cars'

function NumberPlate({ value }) {
  return (
    <span className="inline-flex items-center rounded-md border-2 border-ink/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink">
      {value}
    </span>
  )
}

export default function RideCarModal({ isOpen, onClose, cars = [], selectedCarId, onSelect, title = 'Choose your ride car' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="pr-8">
          <h3 className="text-lg font-medium text-ink">{title}</h3>
          <p className="mt-1 text-sm text-muted">
            Pick a vehicle to see its photo and number plate.
          </p>
        </div>

        <ul className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
          {cars.map((car) => {
            const isSelected = car.id === selectedCarId
            const image = car.image || car.imageUrl || carPlaceholder

            return (
              <li key={car.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(car)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'border-ink bg-surface-soft'
                      : 'border-line bg-surface hover:bg-surface-soft/60'
                  }`}
                >
                  <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                    <img
                      src={image}
                      alt={`${car.brand} ${car.model}`}
                      className={`h-full w-full ${car.imageFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = carPlaceholder
                      }}
                    />
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="truncate text-sm font-medium text-ink">
                      {car.brand} {car.model}
                    </span>
                    {car.driverName && (
                      <span className="flex items-center gap-1.5 truncate text-xs text-muted-strong">
                        <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{car.driverName}</span>
                      </span>
                    )}
                    <span className="truncate text-xs text-muted">
                      {VEHICLE_TYPE_LABELS[car.vehicleType] || car.vehicleType} • {car.color} •{' '}
                      {car.seats} seat{car.seats === 1 ? '' : 's'}
                    </span>
                    {car.distance && (
                      <span className="truncate text-xs text-muted">Distance: {car.distance}</span>
                    )}
                    <NumberPlate value={car.vehicleNumber} />
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-medium text-ink">{car.fare}/km</span>
                    <span className="mt-1 block text-xs font-medium text-live-ink">
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </Modal>
  )
}
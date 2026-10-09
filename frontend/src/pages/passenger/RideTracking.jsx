import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Phone, Star } from 'lucide-react'
import RideMap from '../../components/map/RideMap'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import RideTimeline from '../../components/ride/RideTimeline'
import StatusBadge from '../../components/common/StatusBadge'
import { DRIVERS, getRideById, RIDE_FLOW } from '../../constants/mockData'
import { getVehicleImage } from '../../constants/cars'
import { formatINR } from '../../utils/format'
import { placePointFromText } from '../../utils/placePoint'
import { useToast } from '../../context/toast'

const HEADLINES = {
  requested: ['Looking for a driver nearby', 'Matching you with the closest ride'],
  accepted: ['Rahul accepted your ride', 'Heading to your pickup point'],
  driver_arriving: ['Driver is on the way', 'Arriving in 4 min'],
  driver_arrived: ['Driver has arrived', 'Look for a white Toyota Etios'],
  started: ['On the way to your destination', 'ETA 18 min'],
  completed: ["You've arrived", 'Ride completed'],
  cancelled: ['Ride cancelled', 'You were not charged'],
}

export default function RideTracking() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const ride = getRideById(rideId)
  const [status, setStatus] = useState(ride?.status || 'requested')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!ride || !['requested', 'accepted', 'driver_arriving', 'driver_arrived'].includes(status)) return undefined
    const timer = setTimeout(() => {
      const index = RIDE_FLOW.indexOf(status)
      setStatus(RIDE_FLOW[Math.min(index + 1, RIDE_FLOW.indexOf('started'))])
    }, 4500)
    return () => clearTimeout(timer)
  }, [status, ride])

  const pickupPoint = placePointFromText(ride?.pickup)
  const destinationPoint = placePointFromText(ride?.destination)

  if (!ride) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Ride not found"
          description="This ride doesn't exist or was removed."
          action={
            <button
              type="button"
              onClick={() => navigate('/passenger/rides')}
              className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink"
            >
              View your rides
            </button>
          }
        />
      </div>
    )
  }

  const driverRecord = DRIVERS.find((driver) => driver.name === ride.driver) || DRIVERS[0]
  const carImage = getVehicleImage(driverRecord.vehicle.type)

  const [headline, subline] = HEADLINES[status] || HEADLINES.requested
  const showDriver = ['accepted', 'driver_arriving', 'driver_arrived', 'started', 'completed'].includes(status)
  const canCancel = ['requested', 'accepted'].includes(status)

  function cancelRide() {
    setConfirmCancel(false)
    setStatus('cancelled')
    toast('Ride cancelled')
  }

  return (
    <div className="relative">
      <div className="relative isolate h-[45vh] overflow-hidden border-b border-line bg-map-block lg:h-[62vh]">
        <RideMap pickup={pickupPoint} destination={destinationPoint} />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper/70 to-transparent" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto -mt-8 max-w-xl px-4 pb-12 sm:px-6 lg:absolute lg:left-6 lg:top-6 lg:mx-0 lg:mt-0 lg:w-[400px] lg:px-0">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-float sm:p-6" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-medium tracking-tight text-ink">{headline}</h1>
              <p className="mt-1 text-sm text-muted">{subline}</p>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-5 rounded-2xl bg-surface-soft px-4 py-3 text-sm text-muted-strong">
            <p className="truncate">
              <span className="text-ink">{ride.pickup}</span> <span className="text-muted">→</span>{' '}
              <span className="text-ink">{ride.destination}</span>
            </p>
            <p className="mt-1 text-[13px] text-muted">
              {ride.id} • {ride.distance} km • {ride.duration}
            </p>
          </div>

          {status === 'cancelled' ? (
            <div className="mt-5 space-y-4">
              <p className="text-sm text-muted-strong">
                This ride was cancelled. Any hold on your payment method is released immediately.
              </p>
              <button
                type="button"
                onClick={() => navigate('/passenger/book')}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
              >
                Book another ride <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6">
                <RideTimeline status={status} />
              </div>

              {showDriver && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
                  <div className="relative h-40 w-full bg-surface-soft">
                    <img
                      src={carImage}
                      alt={`${driverRecord.vehicle.brand} ${driverRecord.vehicle.model}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-3 left-3 inline-flex items-center rounded-md border-2 border-ink/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink">
                      {driverRecord.vehicle.number}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-medium text-ink">
                          {driverRecord.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{driverRecord.name}</p>
                          <p className="flex items-center gap-1 truncate text-[13px] text-muted">
                            <Star className="h-3.5 w-3.5 shrink-0 fill-ink text-ink" aria-hidden="true" />
                            <span className="truncate">
                              {driverRecord.rating} • {driverRecord.vehicle.brand} {driverRecord.vehicle.model} • {driverRecord.vehicle.color}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast(`Calling ${driverRecord.name}...`)}
                        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-ink-soft transition hover:bg-surface-soft"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {status === 'completed' && (
                <div className="mt-5 space-y-4">
                  <dl className="space-y-2 rounded-2xl bg-surface-soft p-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Ride fare</dt>
                      <dd className="tabular-nums text-ink-soft">{formatINR(Math.round(ride.fare * 0.8))}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Platform fee</dt>
                      <dd className="tabular-nums text-ink-soft">{formatINR(ride.fare - Math.round(ride.fare * 0.8))}</dd>
                    </div>
                    <div className="flex justify-between border-t border-line pt-2">
                      <dt className="font-medium text-ink">Total • {ride.paymentMethod}</dt>
                      <dd className="text-lg font-medium tabular-nums text-ink">{formatINR(ride.fare)}</dd>
                    </div>
                  </dl>

                  <div>
                    <p className="text-[13px] text-muted">Rate your driver</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setRating(star)
                            toast('Rating saved')
                          }}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-surface-soft"
                        >
                          <Star
                            className={`h-5 w-5 ${star <= rating ? 'fill-ink text-ink' : 'text-muted'}`}
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/passenger')}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
                  >
                    Done <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full border border-line bg-surface text-sm font-medium text-[rgb(var(--color-status-cancelled))] transition hover:bg-pin-tint"
                >
                  Cancel ride
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <div className="flex flex-col gap-4">
          <div className="pr-8">
            <h3 className="text-lg font-medium text-ink">Cancel this ride?</h3>
            <p className="mt-1 text-sm text-muted">
              Rahul is already on the way. Cancelling now may charge a small fee.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="h-11 flex-1 rounded-full border border-line bg-surface text-sm font-medium text-ink-soft transition hover:bg-surface-soft"
            >
              Keep ride
            </button>
            <button
              type="button"
              onClick={cancelRide}
              className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-on-ink transition hover:bg-ink/90"
            >
              Cancel ride
            </button>
          </div>
        </div>
      </Modal>

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="absolute left-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft shadow-button transition hover:bg-surface-soft"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

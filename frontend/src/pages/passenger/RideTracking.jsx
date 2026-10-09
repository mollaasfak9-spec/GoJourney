import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Phone, Star } from 'lucide-react'
import RideMap from '../../components/map/RideMap'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import RideTimeline from '../../components/ride/RideTimeline'
import StatusBadge from '../../components/common/StatusBadge'
import { getRideById, RIDE_FLOW } from '../../constants/mockData'
import { VEHICLE_TYPE_LABELS, getVehicleImage } from '../../constants/cars'
import { formatINR } from '../../utils/format'
import { placePointFromText } from '../../utils/placePoint'
import { ridesApi } from '../../services/endpoints'
import { useToast } from '../../context/toast'

const HEADLINES = {
  requested: ['Looking for a driver nearby', 'Matching you with the closest ride'],
  accepted: ['Driver accepted your ride', 'Heading to your pickup point'],
  driver_arriving: ['Driver is on the way', 'Your driver is almost there'],
  driver_arrived: ['Driver has arrived', 'Meet your driver at the pickup point'],
  started: ['On the way to your destination', 'Enjoy your ride'],
  completed: ["You've arrived", 'Ride completed'],
  cancelled: ['Ride cancelled', 'You were not charged'],
}

const ACTIVE_STATUSES = ['requested', 'accepted', 'driver_arriving', 'driver_arrived', 'started']
const CANCELLABLE_STATUSES = ['requested', 'accepted', 'driver_arriving', 'driver_arrived']
const TERMINAL_STATUSES = ['completed', 'cancelled']

function parseMinutes(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = parseInt(String(value || '').replace(/[^0-9]/g, ''), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function isUnreachable(error) {
  if (!error) return false
  const status = error.status
  return status === undefined || status === null || status >= 500
}

// Backend `{ ride, driver, payment }` -> the view model the UI renders.
function normalizeBackend({ ride, driver, payment }) {
  return {
    id: ride.id,
    status: ride.status,
    pickup: { ...ride.pickup, label: ride.pickup?.address || 'Pickup' },
    destination: { ...ride.destination, label: ride.destination?.address || 'Drop-off' },
    distance: ride.distance || 0,
    duration: ride.estimatedDuration || 0,
    fare: ride.finalFare || ride.estimatedFare || 0,
    vehicleType: ride.vehicleType,
    routeGeometry: Array.isArray(ride.routeGeometry) && ride.routeGeometry.length >= 2 ? ride.routeGeometry : null,
    routeApproximate: ride.routeSource === 'approximate',
    driver: driver
      ? {
          name: driver.userId?.name || 'Your driver',
          phone: driver.userId?.phone || null,
          rating: driver.rating || 0,
          vehicleType: ride.vehicleType,
          location: driver.currentLocation?.lat != null ? driver.currentLocation : null,
        }
      : null,
    paymentMethod: payment?.method || null,
  }
}

// Legacy mock ride -> same view model.
function normalizeMock(ride) {
  const pickupPoint = placePointFromText(ride.pickup)
  const destinationPoint = placePointFromText(ride.destination)
  return {
    id: ride.id,
    status: ride.status,
    pickup: { label: ride.pickup, lat: pickupPoint?.lat, lng: pickupPoint?.lng },
    destination: { label: ride.destination, lat: destinationPoint?.lat, lng: destinationPoint?.lng },
    distance: ride.distance || 0,
    duration: parseMinutes(ride.duration),
    fare: ride.fare || 0,
    vehicleType: ride.vehicleType || 'car',
    routeGeometry: null,
    routeApproximate: false,
    driver: ride.driver
      ? { name: ride.driver, phone: null, rating: 4.8, vehicleType: ride.vehicleType || 'car', location: null }
      : null,
    paymentMethod: ride.paymentMethod || null,
  }
}

export default function RideTracking() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Single state object keyed by ride id: a new id shows the loading state
  // immediately without needing a synchronous setState in an effect.
  const [data, setData] = useState({ id: null, ride: null, source: null, notFound: false })
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [rating, setRating] = useState(0)
  const [busy, setBusy] = useState(false)

  const current = data.id === rideId ? data : { ride: null, source: null, notFound: false }
  const ride = current.ride
  const source = current.source
  const notFound = current.notFound

  // Initial load: prefer the backend, fall back to legacy mock rides.
  useEffect(() => {
    let cancelled = false

    ridesApi
      .get(rideId)
      .then((res) => {
        if (cancelled) return
        setData({ id: rideId, ride: normalizeBackend(res.data), source: 'backend', notFound: false })
      })
      .catch((error) => {
        if (cancelled) return
        const fallbackable = isUnreachable(error) || [400, 404, 422].includes(error.status)
        const mock = fallbackable ? getRideById(rideId) : null
        if (mock) {
          setData({ id: rideId, ride: normalizeMock(mock), source: 'mock', notFound: false })
        } else {
          setData({ id: rideId, ride: null, source: null, notFound: true })
        }
      })

    return () => {
      cancelled = true
    }
  }, [rideId])

  // Poll the backend while the ride is active so status and driver location update.
  useEffect(() => {
    if (source !== 'backend' || !ride || TERMINAL_STATUSES.includes(ride.status)) return undefined

    const timer = setInterval(() => {
      ridesApi
        .get(rideId)
        .then((res) => {
          setData((prev) =>
            prev.id === rideId ? { ...prev, ride: normalizeBackend(res.data) } : prev,
          )
        })
        .catch(() => {
          /* transient poll failure — keep the last known state */
        })
    }, 4000)

    return () => clearInterval(timer)
  }, [source, ride, rideId])

  // Legacy mock rides keep their simulated progression.
  useEffect(() => {
    if (source !== 'mock' || !ride || !ACTIVE_STATUSES.includes(ride.status)) return undefined

    const timer = setTimeout(() => {
      setData((prev) => {
        if (prev.id !== rideId || !prev.ride) return prev
        const index = RIDE_FLOW.indexOf(prev.ride.status)
        const nextStatus = RIDE_FLOW[Math.min(index + 1, RIDE_FLOW.indexOf('started'))]
        return { ...prev, ride: { ...prev.ride, status: nextStatus } }
      })
    }, 4500)

    return () => clearTimeout(timer)
  }, [source, ride, rideId])

  const status = ride?.status
  const [headline, subline] = HEADLINES[status] || HEADLINES.requested
  const showDriver = Boolean(ride?.driver) && ['accepted', 'driver_arriving', 'driver_arrived', 'started', 'completed'].includes(status)
  const canCancel = CANCELLABLE_STATUSES.includes(status)

  const carImage = useMemo(() => getVehicleImage(ride?.vehicleType), [ride?.vehicleType])

  async function cancelRide() {
    setConfirmCancel(false)
    setBusy(true)
    try {
      if (source === 'backend') {
        await ridesApi.cancel(rideId, {})
        const res = await ridesApi.get(rideId)
        setData((prev) => (prev.id === rideId ? { ...prev, ride: normalizeBackend(res.data) } : prev))
      } else {
        setData((prev) => (prev.ride ? { ...prev, ride: { ...prev.ride, status: 'cancelled' } } : prev))
      }
      toast('Ride cancelled')
    } catch (error) {
      toast(error.message || 'Could not cancel this ride')
    } finally {
      setBusy(false)
    }
  }

  async function submitRating(value) {
    setRating(value)
    if (source !== 'backend') {
      toast('Rating saved')
      return
    }
    try {
      await ridesApi.rate(rideId, { rating: value })
      toast('Rating saved')
    } catch (error) {
      toast(error.message || 'Could not save your rating')
    }
  }

  if (notFound) {
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

  if (!ride) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <span className="text-sm text-muted">Loading ride...</span>
      </div>
    )
  }

  const driverLabel = ride.driver ? VEHICLE_TYPE_LABELS[ride.driver.vehicleType] || ride.driver.vehicleType : ''

  return (
    <div className="relative">
      <div className="relative isolate h-[45vh] overflow-hidden border-b border-line bg-map-block lg:h-[62vh]">
        <RideMap
          pickup={ride.pickup?.lat != null ? ride.pickup : null}
          destination={ride.destination?.lat != null ? ride.destination : null}
          route={ride.routeGeometry}
          routeApproximate={ride.routeApproximate}
          driver={ride.driver?.location || null}
        />
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
              <span className="text-ink">{ride.pickup?.label}</span> <span className="text-muted">→</span>{' '}
              <span className="text-ink">{ride.destination?.label}</span>
            </p>
            <p className="mt-1 text-[13px] text-muted">
              {ride.id} • {ride.distance} km • {ride.duration} min
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
                      alt={driverLabel}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-medium text-ink">
                          {ride.driver.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{ride.driver.name}</p>
                          <p className="flex items-center gap-1 truncate text-[13px] text-muted">
                            <Star className="h-3.5 w-3.5 shrink-0 fill-ink text-ink" aria-hidden="true" />
                            <span className="truncate">
                              {ride.driver.rating ? ride.driver.rating : 'New'} • {driverLabel}
                            </span>
                          </p>
                        </div>
                      </div>
                      {ride.driver.phone && (
                        <a
                          href={`tel:${ride.driver.phone}`}
                          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-ink-soft transition hover:bg-surface-soft"
                        >
                          <Phone className="h-4 w-4" aria-hidden="true" />
                          Call
                        </a>
                      )}
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
                      <dt className="font-medium text-ink">
                        Total{ride.paymentMethod ? ` • ${ride.paymentMethod}` : ''}
                      </dt>
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
                          disabled={busy}
                          onClick={() => submitRating(star)}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-surface-soft disabled:opacity-50"
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
                  disabled={busy}
                  onClick={() => setConfirmCancel(true)}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full border border-line bg-surface text-sm font-medium text-[rgb(var(--color-status-cancelled))] transition hover:bg-pin-tint disabled:opacity-50"
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
              Your driver may already be on the way. Cancelling now may charge a small fee.
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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Loader2, MapPin, Navigation, TriangleAlert } from 'lucide-react'
import RideMap from '../../components/map/RideMap'
import PlaceInput from '../../components/ride/PlaceInput'
import VehicleSelector from '../../components/ride/VehicleSelector'
import { SAVED_PLACES } from '../../constants/mockData'
import { PLACES } from '../../constants/places'
import { PARCEL_TYPES } from '../../constants/services'
import { BOOKING_VEHICLES } from '../../utils/fare'
import { formatINR } from '../../utils/format'
import { mapsApi, ridesApi } from '../../services/endpoints'
import { useToast } from '../../context/toast'

function pointPayload(point) {
  return {
    address: point.address || point.name || null,
    lat: point.lat,
    lng: point.lng,
  }
}

export default function BookRide() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupPoint, setPickupPoint] = useState(null)
  const [destinationPoint, setDestinationPoint] = useState(null)
  const [activeField, setActiveField] = useState('pickup')
  const [vehicle, setVehicle] = useState('car')
  const [parcelType, setParcelType] = useState(PARCEL_TYPES[0])
  const [parcelOpen, setParcelOpen] = useState(false)
  const [estimateResult, setEstimateResult] = useState({ key: '', data: {}, error: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const parcelRef = useRef(null)

  const hasRoute = Boolean(pickupPoint && destinationPoint)
  const routeKey = hasRoute
    ? `${pickupPoint.lat},${pickupPoint.lng}|${destinationPoint.lat},${destinationPoint.lng}`
    : ''

  // Estimates are keyed by the route they describe, so a stale response can
  // never show a fare for the previous pickup/destination pair.
  const estimates = useMemo(
    () => (estimateResult.key === routeKey ? estimateResult.data : {}),
    [estimateResult, routeKey],
  )
  const estimating = hasRoute && estimateResult.key !== routeKey
  const estimateError = estimateResult.key === routeKey ? estimateResult.error : ''
  const error = submitError || estimateError

  const estimate = estimates[vehicle] || null
  const fare = estimate?.estimatedFare ?? null
  const distance = estimate?.estimatedDistance ?? 0
  const duration = estimate?.estimatedDuration ?? 0
  const ParcelIcon = parcelType.icon

  const fares = useMemo(
    () => Object.fromEntries(BOOKING_VEHICLES.map((v) => [v.id, estimates[v.id]?.estimatedFare ?? null])),
    [estimates],
  )

  // Debounced, backend calculated fare estimate for every bookable vehicle.
  // The backend is the only source of truth for pricing.
  useEffect(() => {
    if (!routeKey || !pickupPoint || !destinationPoint) return undefined

    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const results = await Promise.all(
          BOOKING_VEHICLES.map((v) =>
            ridesApi
              .fareEstimate({
                pickup: pointPayload(pickupPoint),
                destination: pointPayload(destinationPoint),
                vehicleType: v.id,
              })
              .then((res) => [v.id, res.data]),
          ),
        )
        if (!cancelled) setEstimateResult({ key: routeKey, data: Object.fromEntries(results), error: '' })
      } catch (err) {
        if (!cancelled) {
          setEstimateResult({
            key: routeKey,
            data: {},
            error: err.message || 'Could not estimate the fare. Please try again.',
          })
        }
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [routeKey, pickupPoint, destinationPoint])

  useEffect(() => {
    function handleClickOutside(event) {
      if (parcelRef.current && !parcelRef.current.contains(event.target)) setParcelOpen(false)
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setParcelOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const searchAddresses = useCallback(async (query) => {
    const res = await mapsApi.geocode(query)
    return res?.data || []
  }, [])

  function handlePickupChange(text) {
    setPickup(text)
    setPickupPoint(null)
    setActiveField('pickup')
  }

  function handleDestinationChange(text) {
    setDestination(text)
    setDestinationPoint(null)
    setActiveField('destination')
  }

  function handlePickupSelect(place) {
    setPickup(place.name)
    setPickupPoint({ lat: place.lat, lng: place.lng, name: place.name, address: place.address })
    setActiveField('destination')
  }

  function handleDestinationSelect(place) {
    setDestination(place.name)
    setDestinationPoint({ lat: place.lat, lng: place.lng, name: place.name, address: place.address })
  }

  // Drop a pin on the map: assign it to the field the user is working on and
  // resolve a human readable address (best effort) without faking one.
  async function handleMapClick({ lat, lng }) {
    const field = !pickupPoint ? 'pickup' : !destinationPoint ? 'destination' : activeField
    const fallbackLabel = `${lat.toFixed(5)}, ${lng.toFixed(5)}`

    if (field === 'pickup') {
      setPickup(fallbackLabel)
      setPickupPoint({ lat, lng, name: fallbackLabel, address: '' })
    } else {
      setDestination(fallbackLabel)
      setDestinationPoint({ lat, lng, name: fallbackLabel, address: '' })
    }

    try {
      const res = await mapsApi.reverse(lat, lng)
      const place = res?.data
      if (!place) return
      const name = place.name || fallbackLabel
      const withAddress = { lat, lng, name, address: place.address || '' }
      if (field === 'pickup') {
        setPickup(name)
        setPickupPoint(withAddress)
      } else {
        setDestination(name)
        setDestinationPoint(withAddress)
      }
    } catch {
      /* keep the coordinate label when reverse geocoding is unavailable */
    }
  }

  async function handleConfirm() {
    if (!hasRoute || fare == null || submitting) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await ridesApi.create({
        pickup: pointPayload(pickupPoint),
        destination: pointPayload(destinationPoint),
        vehicleType: vehicle,
      })

      const ride = res?.data
      if (!ride?.id) throw new Error('Ride was created but no id was returned.')

      toast('Ride requested')
      navigate(`/passenger/rides/${ride.id}`)
    } catch (err) {
      // A passenger can only have one active ride — send them to the existing one.
      if (err.code === 'RIDE_ALREADY_IN_PROGRESS') {
        try {
          const active = await ridesApi.active()
          if (active?.data?.id) {
            toast('You already have a ride in progress')
            navigate(`/passenger/rides/${active.data.id}`)
            return
          }
        } catch {
          /* fall through to the inline error */
        }
      }
      setSubmitError(err.message || 'Could not create your ride. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const pickupMarker = pickupPoint ? { ...pickupPoint, label: pickupPoint.name } : null
  const destinationMarker = destinationPoint ? { ...destinationPoint, label: destinationPoint.name } : null

  return (
    <div className="relative">
      <div className="relative isolate h-[45vh] w-full overflow-hidden border-b border-line bg-map-block lg:h-[calc(100dvh-4rem)]">
        <RideMap
          pickup={pickupMarker}
          destination={destinationMarker}
          route={estimate?.route?.geometry || null}
          routeApproximate={estimate?.route?.approximate ?? false}
          onMapClick={handleMapClick}
        />
      </div>

      <div className="relative z-10 -mt-8 px-4 pb-10 sm:px-6 lg:absolute lg:left-6 lg:top-6 lg:mt-0 lg:w-[400px] lg:px-0">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-float sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-medium tracking-tight text-ink">Book your ride</h1>
            <span className="text-[13px] text-muted">{distance ? `${distance} km` : '—'}</span>
          </div>

          <div className="relative mt-5 space-y-3">
            <span className="absolute left-[18px] top-10 h-9 w-0.5 bg-line" aria-hidden="true" />
            <div className="relative" onFocusCapture={() => setActiveField('pickup')}>
              <label htmlFor="pickup" className="sr-only">
                Pickup location
              </label>
              <PlaceInput
                id="pickup"
                value={pickup}
                onChange={handlePickupChange}
                onSelect={handlePickupSelect}
                placeholder="Pickup location"
                icon={MapPin}
                iconClassName="text-ink"
                places={PLACES}
                saved={SAVED_PLACES}
                search={searchAddresses}
              />
            </div>
            <div className="relative" onFocusCapture={() => setActiveField('destination')}>
              <label htmlFor="destination" className="sr-only">
                Destination
              </label>
              <PlaceInput
                id="destination"
                value={destination}
                onChange={handleDestinationChange}
                onSelect={handleDestinationSelect}
                placeholder="Destination"
                icon={Navigation}
                iconClassName="text-pin"
                places={PLACES}
                saved={SAVED_PLACES}
                search={searchAddresses}
              />
            </div>
          </div>

          <p className="mt-5 text-[13px] text-muted">Choose your vehicle</p>
          <VehicleSelector className="mt-2" value={vehicle} onChange={setVehicle} fares={fares} />

          <p className="mt-5 text-[13px] text-muted">Parcel type</p>
          <div ref={parcelRef} className="relative mt-2">
            <button
              type="button"
              onClick={() => setParcelOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={parcelOpen}
              className="flex h-12 w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 text-sm text-ink transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                <ParcelIcon className="h-4 w-4 text-muted-strong" aria-hidden="true" />
                {parcelType.label}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted transition-transform duration-150 ${parcelOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {parcelOpen && (
              <ul
                role="listbox"
                aria-label="Parcel type"
                className="absolute inset-x-0 top-full z-20 mt-2 max-h-64 overflow-auto rounded-2xl border border-line bg-surface p-2 shadow-float"
              >
                {PARCEL_TYPES.map((type) => {
                  const Icon = type.icon
                  const isSelected = type.id === parcelType.id
                  return (
                    <li key={type.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setParcelType(type)
                          setParcelOpen(false)
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-soft ${
                          isSelected ? 'bg-surface-soft text-ink' : 'text-muted-strong'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {type.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="mt-5 rounded-2xl bg-surface-soft p-4">
            {!hasRoute ? (
              <p className="text-sm text-muted">Enter pickup and destination</p>
            ) : estimating ? (
              <div className="space-y-2" aria-live="polite">
                <p className="text-sm text-muted">Calculating fare...</p>
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-line" />
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-line" />
              </div>
            ) : estimate ? (
              <dl className="space-y-2 text-sm" aria-live="polite">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Base fare</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(estimate.breakdown.baseFare)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Distance ({distance} km)</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(estimate.breakdown.distanceCharge)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Time ({duration} min)</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(estimate.breakdown.timeCharge)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <dt className="text-sm text-ink">Estimated fare</dt>
                  <dd className="text-xl font-medium tabular-nums text-ink">{formatINR(fare)}</dd>
                </div>
                {estimate.route?.approximate && (
                  <p className="pt-1 text-[12px] text-muted">
                    Live routing unavailable — approximate distance shown.
                  </p>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted">Fare unavailable for this route.</p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl bg-pin-tint px-3 py-2.5 text-[13px] text-[rgb(var(--color-status-cancelled))]"
            >
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasRoute || estimating || submitting || fare == null}
            className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Requesting...
              </>
            ) : fare != null ? (
              <>
                Confirm ride · {formatINR(fare)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              'Confirm ride'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

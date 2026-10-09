import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Loader2, MapPin, Navigation, TriangleAlert } from 'lucide-react'
import RideMap from '../../components/map/RideMap'
import PlaceInput from '../../components/ride/PlaceInput'
import VehicleSelector from '../../components/ride/VehicleSelector'
import { SAVED_PLACES } from '../../constants/mockData'
import { PLACES } from '../../constants/places'
import { PARCEL_TYPES } from '../../constants/services'
import { BOOKING_VEHICLES, estimateDistanceKm, fareFromDistance, routeDistanceKm } from '../../utils/fare'
import { formatINR } from '../../utils/format'
import { resolvePlacePoint } from '../../utils/placePoint'
import { useToast } from '../../context/toast'

const DEFAULT_PICKUP_POINT = { lat: SAVED_PLACES[0].lat, lng: SAVED_PLACES[0].lng, label: SAVED_PLACES[0].label }
const DEFAULT_DESTINATION_POINT = { lat: SAVED_PLACES[1].lat, lng: SAVED_PLACES[1].lng, label: SAVED_PLACES[1].label }

export default function BookRide() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupPlace, setPickupPlace] = useState(null)
  const [destinationPlace, setDestinationPlace] = useState(null)
  const [vehicle, setVehicle] = useState('car')
  const [parcelType, setParcelType] = useState(PARCEL_TYPES[0])
  const [parcelOpen, setParcelOpen] = useState(false)
  const [route, setRoute] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const parcelRef = useRef(null)

  const hasRoute = Boolean(pickup.trim() && destination.trim())
  const routeKey = hasRoute ? `${pickup.trim()}|${destination.trim()}` : ''
  const calculating = hasRoute && route !== routeKey
  const distance = useMemo(() => {
    if (!hasRoute) return 0
    if (pickupPlace && destinationPlace) {
      const realDistance = routeDistanceKm(pickupPlace, destinationPlace)
      if (realDistance) return realDistance
    }
    return estimateDistanceKm(pickup, destination)
  }, [pickup, destination, pickupPlace, destinationPlace, hasRoute])
  const fares = useMemo(() => {
    if (!hasRoute) return {}
    return Object.fromEntries(BOOKING_VEHICLES.map((v) => [v.id, fareFromDistance(distance, v.id)]))
  }, [distance, hasRoute])
  const fare = fares[vehicle]
  const ParcelIcon = parcelType.icon

  const pickupPoint = useMemo(() => {
    const point = resolvePlacePoint(pickupPlace, pickup)
    return point ? { ...point, label: point.name } : DEFAULT_PICKUP_POINT
  }, [pickupPlace, pickup])
  const destinationPoint = useMemo(() => {
    const point = resolvePlacePoint(destinationPlace, destination)
    return point ? { ...point, label: point.name } : DEFAULT_DESTINATION_POINT
  }, [destinationPlace, destination])

  function handlePickupChange(text) {
    setPickup(text)
    setPickupPlace(null)
  }

  function handleDestinationChange(text) {
    setDestination(text)
    setDestinationPlace(null)
  }

  function handlePickupSelect(place) {
    setPickup(place.name)
    setPickupPlace(place)
  }

  function handleDestinationSelect(place) {
    setDestination(place.name)
    setDestinationPlace(place)
  }

  useEffect(() => {
    if (!hasRoute) return undefined
    const timer = setTimeout(() => setRoute(routeKey), 700)
    return () => clearTimeout(timer)
  }, [routeKey, hasRoute])

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

  async function handleConfirm() {
    if (!hasRoute || fare == null) return
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitting(false)
    toast('Ride requested')
    navigate('/passenger/rides/RX-1042')
  }

  return (
    <div className="relative">
      <div className="relative isolate h-[45vh] w-full overflow-hidden border-b border-line bg-map-block lg:h-[calc(100dvh-4rem)]">
        <RideMap pickup={pickupPoint} destination={destinationPoint} />
      </div>

      <div className="relative z-10 -mt-8 px-4 pb-10 sm:px-6 lg:absolute lg:left-6 lg:top-6 lg:mt-0 lg:w-[400px] lg:px-0">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-float sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-medium tracking-tight text-ink">Book your ride</h1>
            <span className="text-[13px] text-muted">{distance ? `${distance} km` : '—'}</span>
          </div>

          <div className="relative mt-5 space-y-3">
            <span className="absolute left-[18px] top-10 h-9 w-0.5 bg-line" aria-hidden="true" />
            <div className="relative">
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
              />
            </div>
            <div className="relative">
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
            ) : calculating ? (
              <div className="space-y-2" aria-live="polite">
                <p className="text-sm text-muted">Calculating fare...</p>
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-line" />
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-line" />
              </div>
            ) : (
              <dl className="space-y-2 text-sm" aria-live="polite">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Base fare</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(Math.round(fare * 0.3))}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Distance ({distance} km)</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(Math.round(fare * 0.7))}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <dt className="text-sm text-ink">Estimated fare</dt>
                  <dd className="text-xl font-medium tabular-nums text-ink">{formatINR(fare)}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-pin-tint px-3 py-2.5 text-[13px] text-[rgb(var(--color-status-cancelled))]">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            No drivers nearby? Try again in a few minutes.
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!hasRoute || calculating || submitting}
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

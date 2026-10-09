import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, MapPin, Navigation } from 'lucide-react'
import RideMap from '../../components/map/RideMap'
import EmptyState from '../../components/common/EmptyState'
import { getRideById } from '../../constants/mockData'
import { formatINR } from '../../utils/format'
import { placePointFromText } from '../../utils/placePoint'
import { useToast } from '../../context/toast'

const STEPS = ['accepted', 'driver_arriving', 'driver_arrived', 'started']

const STATES = {
  accepted: {
    eyebrow: 'Ride accepted',
    title: 'Head to the pickup point',
    detail: null,
    detailKey: 'pickup',
    button: "I'm arriving",
    icon: MapPin,
  },
  driver_arriving: {
    eyebrow: 'On the way',
    title: 'Navigate to passenger',
    detailKey: 'pickup',
    button: "I've arrived",
    icon: Navigation,
  },
  driver_arrived: {
    eyebrow: 'At pickup',
    title: 'Passenger is here',
    detailKey: 'pickup',
    button: 'Start ride',
    icon: MapPin,
  },
  started: {
    eyebrow: 'Ride in progress',
    title: 'Head to the destination',
    detailKey: 'destination',
    button: 'Complete ride',
    icon: Navigation,
  },
  completed: {
    eyebrow: 'Ride completed',
    title: 'Great drive',
    detailKey: null,
    button: 'Back to dashboard',
    icon: ArrowRight,
  },
}

export default function ActiveRide() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const ride = getRideById(rideId)
  const [status, setStatus] = useState(ride ? (ride.status === 'requested' ? 'accepted' : ride.status) : 'accepted')

  const pickupPoint = placePointFromText(ride?.pickup)
  const destinationPoint = placePointFromText(ride?.destination)

  if (!ride) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Ride not found"
          description="This ride is no longer available."
          action={
            <button
              type="button"
              onClick={() => navigate('/driver')}
              className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink"
            >
              Back to dashboard
            </button>
          }
        />
      </div>
    )
  }

  const state = STATES[status] || STATES.accepted
  const stepIndex = STEPS.indexOf(status)
  const DetailIcon = state.icon

  function advance() {
    if (status === 'completed') {
      navigate('/driver')
      return
    }
    const index = STEPS.indexOf(status)
    const next = STEPS[index + 1]
    if (next) {
      setStatus(next)
      toast(next === 'completed' ? 'Ride completed' : 'Ride updated')
    } else {
      setStatus('completed')
      toast('Ride completed')
    }
  }

  return (
    <div className="relative">
      <div className="relative isolate h-[45vh] overflow-hidden border-b border-line bg-map-block lg:h-[calc(100dvh-4rem)]">
        <RideMap pickup={pickupPoint} destination={destinationPoint} />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper/70 to-transparent" aria-hidden="true" />
      </div>

      <div className="relative z-10 -mt-8 px-4 pb-12 sm:px-6 lg:absolute lg:bottom-6 lg:left-6 lg:mt-0 lg:w-[400px] lg:px-0">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-float sm:p-6" aria-live="polite">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <span key={step} className="flex-1">
                <span
                  className={`block h-1 rounded-full ${index <= stepIndex ? 'bg-ink' : 'bg-line'}`}
                  aria-hidden="true"
                />
              </span>
            ))}
          </div>

          <p className="mt-4 text-[13px] text-muted">{state.eyebrow}</p>
          <h1 className="mt-1 text-xl font-medium tracking-tight text-ink">{state.title}</h1>

          <div className="mt-4 rounded-2xl bg-surface-soft p-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink bg-surface" aria-hidden="true" />
              <span className="truncate text-muted-strong">{ride.pickup}</span>
            </div>
            <span className="my-1 ml-[4px] block h-3 w-0.5 bg-line" aria-hidden="true" />
            <div className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-pin" aria-hidden="true" />
              <span className="truncate text-muted-strong">{ride.destination}</span>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
              <DetailIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {ride.passenger} • {ride.distance} km • {ride.duration}
            </p>
          </div>

          {status === 'completed' ? (
            <div className="mt-5">
              <p className="text-[13px] text-muted">Total fare</p>
              <p className="text-4xl font-medium tracking-tight tabular-nums text-ink">{formatINR(ride.fare)}</p>
              <p className="mt-1 text-[13px] text-muted">Your cut: {formatINR(Math.round(ride.fare * 0.85))}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={advance}
            className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            {state.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

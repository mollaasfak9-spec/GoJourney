import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Phone, Star } from 'lucide-react'
import MapPlaceholder from '../../components/common/MapPlaceholder'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import RideTimeline from '../../components/ride/RideTimeline'
import { getRideById } from '../../constants/mockData'
import { formatDate, formatINR, formatTime } from '../../utils/format'

export default function RideDetails() {
  const { id } = useParams()
  const ride = getRideById(id)

  if (!ride) {
    return (
      <div className="py-10">
        <EmptyState title="Ride not found" description="This ride doesn't exist." />
      </div>
    )
  }

  const driverInitials = ride.driver
    ? ride.driver
        .split(' ')
        .map((part) => part[0])
        .join('')
    : '—'

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-[13px] text-muted" aria-label="Breadcrumb">
        <Link to="/admin/rides" className="hover:text-ink">
          Rides
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-medium text-ink">{ride.id}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">{ride.id}</h1>
            <StatusBadge status={ride.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted-strong">
            {formatDate(ride.date)} at {formatTime(ride.date)} • {ride.distance} km • {ride.duration}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-muted">Fare</p>
          <p className="text-3xl font-medium tabular-nums text-ink">{ride.fare ? formatINR(ride.fare) : '—'}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative h-64 overflow-hidden rounded-3xl border border-line bg-map-block sm:h-80">
            <MapPlaceholder className="h-full w-full" />
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-ink bg-surface" aria-hidden="true" />
              <span className="text-ink">{ride.pickup}</span>
            </div>
            <span className="my-2 ml-[5px] block h-4 w-0.5 bg-line" aria-hidden="true" />
            <div className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 shrink-0 rounded-full bg-pin" aria-hidden="true" />
              <span className="text-ink">{ride.destination}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Passenger</h2>
              <p className="mt-3 text-sm text-ink-soft">{ride.passenger}</p>
              <p className="text-[13px] text-muted">{ride.vehicleType} • {ride.paymentMethod}</p>
            </div>
            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Driver</h2>
              {ride.driver ? (
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-medium text-ink">
                    {driverInitials}
                  </span>
                  <div className="text-sm text-ink-soft">
                    <p>{ride.driver}</p>
                    <p className="flex items-center gap-1 text-[13px] text-muted">
                      <Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden="true" /> 4.8
                      <Phone className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No driver was assigned.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-medium text-ink">Status timeline</h2>
            <div className="mt-4">
              <RideTimeline status={ride.status} />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-medium text-ink">Fare breakdown</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Base fare</dt>
                <dd className="tabular-nums text-ink-soft">{formatINR(Math.round(ride.fare * 0.3))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Distance ({ride.distance} km)</dt>
                <dd className="tabular-nums text-ink-soft">{formatINR(Math.round(ride.fare * 0.6))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Platform fee</dt>
                <dd className="tabular-nums text-ink-soft">{formatINR(Math.round(ride.fare * 0.1))}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5">
                <dt className="font-medium text-ink">Total</dt>
                <dd className="text-lg font-medium tabular-nums text-ink">{formatINR(ride.fare)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[13px] text-muted">Paid via {ride.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

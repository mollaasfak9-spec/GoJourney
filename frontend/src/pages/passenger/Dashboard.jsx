import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, History, MapPin, Navigation, UserRound } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import RideCard from '../../components/ride/RideCard'
import { useAuth } from '../../context/auth'
import { RIDES, SAVED_PLACES } from '../../constants/mockData'
import { greeting } from '../../utils/format'

const quickActions = [
  { to: '/passenger/book', label: 'Book a ride', description: 'Set your route and go', icon: Navigation },
  { to: '/passenger/rides', label: 'Ride history', description: 'Receipts and past trips', icon: History },
  { to: '/passenger/profile', label: 'Profile', description: 'Manage your details', icon: UserRound },
]

export default function PassengerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const name = user?.name || 'there'

  const myRides = RIDES.filter((ride) => ride.passenger === (user?.name || 'Akash Das'))
  const activeRide = myRides.find((ride) => !['completed', 'cancelled'].includes(ride.status))
  const recentRides = myRides.filter((ride) => ['completed', 'cancelled'].includes(ride.status)).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={`${greeting()}, ${name.split(' ')[0]}`}
        description="Where are you going?"
        actions={
          <Link
            to="/passenger/book"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
          >
            Book a ride <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />

      <button
        type="button"
        onClick={() => navigate('/passenger/book')}
        className="mt-6 flex w-full items-center gap-3 rounded-full border border-line bg-surface py-2 pl-6 pr-2 text-left shadow-float transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        <span className="flex-1 border-r border-line py-2 pr-4">
          <span className="block text-[13px] text-muted">Pickup</span>
          <span className="block truncate text-sm text-ink">Enter pickup location</span>
        </span>
        <span className="hidden flex-1 py-2 sm:block">
          <span className="block text-[13px] text-muted">Destination</span>
          <span className="block truncate text-sm text-ink">Where to?</span>
        </span>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-ink">Current ride</h2>
          <div className="mt-3">
            {activeRide ? (
              <div className="rounded-3xl border border-line bg-surface p-5 shadow-float sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] text-muted">Arriving in</p>
                    <p className="text-3xl font-medium tracking-tight text-ink">4 min</p>
                  </div>
                  <StatusBadge status={activeRide.status} />
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface-soft px-4 py-3 text-sm text-muted-strong">
                  <MapPin className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                  <span className="truncate">{activeRide.pickup}</span>
                  <span className="text-muted">→</span>
                  <Navigation className="h-4 w-4 shrink-0 text-pin" aria-hidden="true" />
                  <span className="truncate">{activeRide.destination}</span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[13px] text-muted">
                    <span>Matched</span>
                    <span>On the way</span>
                    <span>Arriving</span>
                  </div>
                  <div className="relative mt-2 h-0.5 rounded-full bg-line">
                    <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-ink" />
                    <span className="absolute -top-1 left-1/3 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-ink bg-surface" />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-sm font-medium text-ink">
                      RD
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">Rahul Dey</p>
                      <p className="text-[13px] text-muted">Toyota Etios • KA-01-AB-1234</p>
                    </div>
                  </div>
                  <Link
                    to={`/passenger/rides/${activeRide.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink transition hover:bg-ink/90"
                  >
                    Track ride <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="No active ride"
                description="Book a ride and it will show up here while you travel."
                action={
                  <Link
                    to="/passenger/book"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
                  >
                    Book a ride <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                }
              />
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-ink">Recent rides</h2>
              <Link to="/passenger/rides" className="text-sm text-muted-strong underline-offset-4 hover:text-ink hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {recentRides.length === 0 ? (
                <EmptyState icon={History} title="No rides yet" description="Your completed rides will appear here." />
              ) : (
                recentRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} onClick={() => navigate(`/passenger/rides/${ride.id}`)} footer={ride.id} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-ink">Quick actions</h2>
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-float"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{action.label}</span>
                  <span className="mt-0.5 block text-sm text-muted">{action.description}</span>
                </span>
              </Link>
            )
          })}

          <div className="rounded-2xl border border-line bg-surface p-4">
            <h3 className="text-sm font-medium text-ink">Saved places</h3>
            <ul className="mt-3 space-y-3">
              {SAVED_PLACES.map((place) => (
                <li key={place.label} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                  <span>
                    <span className="block text-sm text-ink">{place.label}</span>
                    <span className="block text-[13px] text-muted">{place.address}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

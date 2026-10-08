import { Link } from 'react-router-dom'
import { Car, Mail, Phone, Star } from 'lucide-react'
import ProfileCard from '../../components/common/ProfileCard'
import { useAuth } from '../../context/auth'
import { DRIVER_PROFILE } from '../../constants/mockData'

export default function DriverProfile() {
  const { user } = useAuth()

  const stats = [
    { label: 'Member since', value: DRIVER_PROFILE.memberSince },
    { label: 'Total rides', value: DRIVER_PROFILE.totalRides },
    { label: 'Rating', value: DRIVER_PROFILE.rating },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-5 text-2xl font-medium tracking-tight text-ink">Profile</h1>

      <ProfileCard
        name={user?.name || DRIVER_PROFILE.name}
        subtitle={user?.email || DRIVER_PROFILE.email}
        chip={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-live-tint px-2.5 py-0.5 text-[13px] text-live-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden="true" />
            Verified driver
          </span>
        }
        stats={stats}
        actions={
          <Link
            to="/driver/vehicle"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
          >
            Manage vehicle
          </Link>
        }
      >
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface-soft p-5">
            <h2 className="text-sm font-medium text-ink">Contact</h2>
            <ul className="mt-3 space-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
                {user?.email || DRIVER_PROFILE.email}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
                {DRIVER_PROFILE.phone}
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-surface-soft p-5">
            <h2 className="text-sm font-medium text-ink">Vehicle</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                <Car className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="text-sm text-ink-soft">
                <p>
                  {DRIVER_PROFILE.vehicle.brand} {DRIVER_PROFILE.vehicle.model}
                </p>
                <p className="text-[13px] text-muted">
                  {DRIVER_PROFILE.vehicle.color} • {DRIVER_PROFILE.vehicle.type}
                </p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center rounded-md border-2 border-ink/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink">
              {DRIVER_PROFILE.vehicle.number}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm text-muted-strong">
          <Star className="h-4 w-4 fill-ink text-ink" aria-hidden="true" />
          {DRIVER_PROFILE.rating} average rating over {DRIVER_PROFILE.totalRides} rides
        </div>
      </ProfileCard>
    </div>
  )
}

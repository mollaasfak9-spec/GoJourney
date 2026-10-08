import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Mail, Phone, Star } from 'lucide-react'
import ProfileCard from '../../components/common/ProfileCard'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import RideCard from '../../components/ride/RideCard'
import { getDriverById, RIDES } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

export default function DriverDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const driver = getDriverById(id)

  if (!driver) {
    return (
      <div className="py-10">
        <EmptyState title="Driver not found" description="This driver doesn't exist." />
      </div>
    )
  }

  const rides = RIDES.filter((ride) => ride.driver === driver.name).slice(0, 4)

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-[13px] text-muted" aria-label="Breadcrumb">
        <Link to="/admin/drivers" className="hover:text-ink">
          Drivers
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-medium text-ink">{driver.name}</span>
      </nav>

      <div className="mt-4">
        <ProfileCard
          name={driver.name}
          subtitle={driver.email}
          chip={
            driver.verification === 'verified' ? (
              <StatusBadge status="verified" label="Verified" />
            ) : (
              <StatusBadge status="pending" label="Pending" />
            )
          }
          stats={[
            { label: 'Joined', value: formatDate(driver.joined) },
            { label: 'Trips', value: driver.trips },
            { label: 'Rating', value: driver.rating },
          ]}
        >
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Contact</h2>
              <ul className="mt-3 space-y-3 text-sm text-ink-soft">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
                  {driver.phone}
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
                  {driver.email}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Vehicle</h2>
              <p className="mt-3 text-sm text-ink-soft">
                {driver.vehicle.brand} {driver.vehicle.model}
              </p>
              <p className="text-[13px] text-muted capitalize">
                {driver.vehicle.type} • {driver.vehicle.color}
              </p>
              <span className="mt-3 inline-flex items-center rounded-md border-2 border-ink/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink">
                {driver.vehicle.number}
              </span>
            </div>

            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Performance</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Lifetime earnings</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(driver.earnings)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Status</dt>
                  <dd className="capitalize text-ink-soft">{driver.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Rating</dt>
                  <dd className="inline-flex items-center gap-1 text-ink-soft">
                    <Star className="h-3.5 w-3.5 fill-ink" aria-hidden="true" />
                    {driver.rating}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </ProfileCard>
      </div>

      <h2 className="mt-8 text-lg font-medium text-ink">Recent rides</h2>
      <div className="mt-3 space-y-3">
        {rides.length === 0 ? (
          <EmptyState title="No rides yet" description="This driver hasn't completed a ride." />
        ) : (
          rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} onClick={() => navigate(`/admin/rides/${ride.id}`)} footer={ride.id} />
          ))
        )}
      </div>
    </div>
  )
}

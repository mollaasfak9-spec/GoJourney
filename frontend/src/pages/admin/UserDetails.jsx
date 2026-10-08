import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Mail, Phone } from 'lucide-react'
import ProfileCard from '../../components/common/ProfileCard'
import StatusBadge from '../../components/common/StatusBadge'
import RideCard from '../../components/ride/RideCard'
import EmptyState from '../../components/common/EmptyState'
import { getUserById, RIDES } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

export default function UserDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = getUserById(id)

  if (!user) {
    return (
      <div className="py-10">
        <EmptyState title="User not found" description="This account doesn't exist." />
      </div>
    )
  }

  const rides = RIDES.filter((ride) => ride.passenger === user.name).slice(0, 4)

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-[13px] text-muted" aria-label="Breadcrumb">
        <Link to="/admin/users" className="hover:text-ink">
          Users
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-medium text-ink">{user.name}</span>
      </nav>

      <div className="mt-4">
        <ProfileCard
          name={user.name}
          subtitle={user.email}
          chip={<StatusBadge status={user.status} label={user.status} />}
          stats={[
            { label: 'Joined', value: formatDate(user.createdAt) },
            { label: 'Total rides', value: user.rides },
            { label: 'Rating', value: user.rating },
          ]}
        >
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Contact</h2>
              <ul className="mt-3 space-y-3 text-sm text-ink-soft">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
                  {user.email}
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
                  {user.phone}
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-surface-soft p-5">
              <h2 className="text-sm font-medium text-ink">Account</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Role</dt>
                  <dd className="capitalize text-ink-soft">{user.role}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Status</dt>
                  <dd className="capitalize text-ink-soft">{user.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Lifetime fares</dt>
                  <dd className="tabular-nums text-ink-soft">{formatINR(user.rides * 178)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </ProfileCard>
      </div>

      <h2 className="mt-8 text-lg font-medium text-ink">Recent rides</h2>
      <div className="mt-3 space-y-3">
        {rides.length === 0 ? (
          <EmptyState title="No rides" description="This user hasn't taken a ride yet." />
        ) : (
          rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} onClick={() => navigate(`/admin/rides/${ride.id}`)} footer={ride.id} />
          ))
        )}
      </div>
    </div>
  )
}

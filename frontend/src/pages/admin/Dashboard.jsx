import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import BarChart from '../../components/common/BarChart'
import StatusBadge from '../../components/common/StatusBadge'
import { ADMIN_STATS, RIDES } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

export default function AdminDashboard() {
  const recent = RIDES.slice(0, 6)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1.5 text-sm text-muted-strong">A live overview of the RideX platform.</p>
        </div>
        <Link
          to="/admin/rides"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
        >
          View all rides <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={ADMIN_STATS.users.value.toLocaleString('en-IN')} delta={ADMIN_STATS.users.delta} hint="Registered accounts" />
        <StatCard label="Drivers" value={ADMIN_STATS.drivers.value.toLocaleString('en-IN')} delta={ADMIN_STATS.drivers.delta} hint="Across 6 cities" />
        <StatCard label="Rides" value={ADMIN_STATS.rides.value.toLocaleString('en-IN')} delta={ADMIN_STATS.rides.delta} hint="All time" />
        <StatCard label="Revenue" value={formatINR(ADMIN_STATS.revenue.value)} delta={ADMIN_STATS.revenue.delta} hint="This month" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-ink">Ride activity</h2>
            <span className="text-[13px] text-muted">Rides per day, last 7 days</span>
          </div>
          <BarChart className="mt-5" data={ADMIN_STATS.activity} height={180} />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-ink">Recent rides</h2>
            <Link to="/admin/rides" className="text-sm text-muted-strong underline-offset-4 hover:text-ink hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {recent.map((ride) => (
              <li key={ride.id}>
                <Link to={`/admin/rides/${ride.id}`} className="block rounded-xl px-2 py-2 transition hover:bg-surface-soft">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">
                      {ride.pickup} <span className="text-muted">→</span> {ride.destination}
                    </span>
                    <StatusBadge status={ride.status} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[13px] text-muted">
                    <span>{formatDate(ride.date)} • {ride.id}</span>
                    <span className="tabular-nums text-ink-soft">{ride.fare ? formatINR(ride.fare) : '—'}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

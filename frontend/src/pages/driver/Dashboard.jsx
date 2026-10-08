import { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowRight, ClipboardList, History, Wallet, WifiOff } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import EmptyState from '../../components/common/EmptyState'
import RequestCard from '../../components/driver/RequestCard'
import { DRIVER_REQUESTS, EARNINGS } from '../../constants/mockData'
import { formatINR, greeting } from '../../utils/format'
import { useAuth } from '../../context/auth'

const shortcuts = [
  { to: '/driver/earnings', label: 'Earnings', description: 'Today, week, and month', icon: Wallet },
  { to: '/driver/rides/history', label: 'Ride history', description: 'Completed rides', icon: History },
  { to: '/driver/vehicle', label: 'Vehicle', description: 'Your car and plates', icon: ClipboardList },
]

export default function DriverDashboard() {
  const { online, setOnline } = useOutletContext()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState(DRIVER_REQUESTS)

  const name = user?.name || 'Rahul'

  function accept(request) {
    navigate(`/driver/rides/${request.id}`)
  }

  function reject(request) {
    setRequests((prev) => prev.filter((item) => item.id !== request.id))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={`${greeting()}, ${name.split(' ')[0]}`}
        description={online ? 'You are live. New requests appear below.' : 'You are offline. Go online to receive requests.'}
      />

      <div className={`mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${online ? '' : 'opacity-60'}`}>
        <StatCard label="Today's earnings" value={formatINR(EARNINGS.today)} hint="+₹120 vs yesterday" />
        <StatCard label="Today's rides" value="7" hint="2 more to beat yesterday" />
        <StatCard label="This week" value={formatINR(EARNINGS.week)} hint="Mon – Sun" />
        <StatCard label="Acceptance rate" value="92%" hint="Last 30 days" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-ink">Ride requests</h2>
            <Link to="/driver/rides" className="text-sm text-muted-strong underline-offset-4 hover:text-ink hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-3 space-y-4">
            {!online ? (
              <EmptyState
                icon={WifiOff}
                title="You're offline"
                description="Go online to receive ride requests from passengers nearby."
                action={
                  <button
                    type="button"
                    onClick={() => setOnline(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
                  >
                    Go online
                  </button>
                }
              />
            ) : requests.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No requests right now"
                description="Stay online and they'll appear here."
              />
            ) : (
              requests.map((request, index) => (
                <RequestCard key={request.id} request={request} index={index} onAccept={accept} onReject={reject} />
              ))
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <h2 className="text-lg font-medium text-ink">Shortcuts</h2>
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <Link
                key={shortcut.to}
                to={shortcut.to}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-float"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{shortcut.label}</span>
                  <span className="block text-[13px] text-muted">{shortcut.description}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </Link>
            )
          })}
        </aside>
      </div>
    </div>
  )
}

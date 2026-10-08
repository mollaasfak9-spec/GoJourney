import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import FilterTabs from '../../components/common/FilterTabs'
import Pagination from '../../components/common/Pagination'
import RideCard from '../../components/ride/RideCard'
import { useAuth } from '../../context/auth'
import { RIDES } from '../../constants/mockData'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PER_PAGE = 5

export default function PassengerRideHistory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)

  const rides = useMemo(() => {
    const mine = RIDES.filter((ride) => ride.passenger === (user?.name || 'Akash Das'))
    return tab === 'all' ? mine : mine.filter((ride) => ride.status === tab)
  }, [tab, user])

  const totalPages = Math.max(1, Math.ceil(rides.length / PER_PAGE))
  const visible = rides.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function changeTab(value) {
    setTab(value)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Your rides" description="Every ride you've taken with RideX." />

      <div className="mt-6">
        <FilterTabs tabs={TABS} value={tab} onChange={changeTab} />
      </div>

      <div className="mt-5 space-y-3">
        {visible.length === 0 ? (
          <EmptyState
            icon={History}
            title="No rides here"
            description={tab === 'all' ? 'Book your first ride to see it here.' : 'No rides match this filter.'}
            action={
              <button
                type="button"
                onClick={() => navigate('/passenger/book')}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
              >
                Book a ride
              </button>
            }
          />
        ) : (
          visible.map((ride) => (
            <RideCard key={ride.id} ride={ride} onClick={() => navigate(`/passenger/rides/${ride.id}`)} footer={ride.id} />
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}

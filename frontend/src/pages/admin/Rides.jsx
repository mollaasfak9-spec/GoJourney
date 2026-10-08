import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Route as RouteIcon, Search } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { RIDES, RIDE_STATUS_LABEL } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

const PER_PAGE = 8

const searchClass =
  'h-11 w-full rounded-full bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface-soft focus:ring-2 focus:ring-ink sm:w-72'

const selectClass =
  'h-11 rounded-full border border-line bg-surface px-4 text-sm text-ink-soft outline-none transition focus:ring-2 focus:ring-ink'

export default function Rides() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const rows = useMemo(() => {
    return RIDES.filter((ride) => {
      const haystack = `${ride.id} ${ride.passenger} ${ride.driver || ''} ${ride.pickup} ${ride.destination}`.toLowerCase()
      const matchesQuery = !query.trim() || haystack.includes(query.toLowerCase())
      const matchesStatus = status === 'all' || ride.status === status
      return matchesQuery && matchesStatus
    })
  }, [query, status])

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  const visible = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const columns = [
    { key: 'id', label: 'Ride ID', render: (row) => <span className="text-muted">{row.id}</span> },
    { key: 'passenger', label: 'Passenger', render: (row) => <span className="text-ink">{row.passenger}</span> },
    { key: 'driver', label: 'Driver', render: (row) => <span className="text-muted-strong">{row.driver || '—'}</span> },
    {
      key: 'route',
      label: 'Route',
      render: (row) => (
        <span className="text-ink">
          {row.pickup} <span className="text-muted">→</span> {row.destination}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'fare', label: 'Fare', align: 'right', render: (row) => (row.fare ? formatINR(row.fare) : '—') },
    { key: 'date', label: 'Date', render: (row) => <span className="text-muted-strong">{formatDate(row.date)}</span> },
  ]

  return (
    <div>
      <PageHeader title="Rides" description="Every ride across the platform, newest first." />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:flex-none">
          <span className="sr-only">Search rides</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search ID, people, or place"
            className={searchClass}
          />
        </label>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
          aria-label="Filter by status"
          className={selectClass}
        >
          <option value="all">All statuses</option>
          {Object.entries(RIDE_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        {rows.length === 0 ? (
          <EmptyState icon={RouteIcon} title="No rides found" description="Try a different search or status filter." />
        ) : (
          <>
            <DataTable columns={columns} rows={visible} onRowClick={(row) => navigate(`/admin/rides/${row.id}`)} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

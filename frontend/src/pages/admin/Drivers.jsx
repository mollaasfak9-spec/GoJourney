import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Search, Star } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import Avatar from '../../components/common/Avatar'
import { DRIVERS } from '../../constants/mockData'
import { useToast } from '../../context/toast'

const PER_PAGE = 6

const searchClass =
  'h-11 w-full rounded-full bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface-soft focus:ring-2 focus:ring-ink sm:w-72'

const selectClass =
  'h-11 rounded-full border border-line bg-surface px-4 text-sm text-ink-soft outline-none transition focus:ring-2 focus:ring-ink'

export default function Drivers() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [drivers, setDrivers] = useState(DRIVERS)

  const rows = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesQuery =
        !query.trim() ||
        driver.name.toLowerCase().includes(query.toLowerCase()) ||
        driver.vehicle.number.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && driver.verification === 'pending') ||
        (filter === 'verified' && driver.verification === 'verified') ||
        driver.status === filter
      return matchesQuery && matchesFilter
    })
  }, [drivers, query, filter])

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  const visible = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function verify(driver) {
    setDrivers((prev) => prev.map((item) => (item.id === driver.id ? { ...item, verification: 'verified' } : item)))
    toast('Driver verified')
  }

  function toggleStatus(driver) {
    setDrivers((prev) =>
      prev.map((item) =>
        item.id === driver.id ? { ...item, status: item.status === 'suspended' ? 'active' : 'suspended' } : item,
      ),
    )
    toast(driver.status === 'suspended' ? 'Driver activated' : 'Driver suspended')
  }

  const columns = [
    {
      key: 'name',
      label: 'Driver',
      render: (row) => (
        <span className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{row.name}</span>
            <span className="block truncate text-[13px] text-muted">{row.phone}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (row) => (
        <span className="text-muted-strong">
          {row.vehicle.brand} {row.vehicle.model}
          <span className="mt-0.5 block font-mono text-[13px] tracking-[0.08em] text-muted">{row.vehicle.number}</span>
        </span>
      ),
    },
    {
      key: 'verification',
      label: 'Verification',
      render: (row) =>
        row.verification === 'verified' ? (
          <StatusBadge status="verified" label="Verified" />
        ) : (
          <span className="flex items-center gap-2">
            <StatusBadge status="pending" label="Pending" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                verify(row)
              }}
              className="h-8 rounded-full bg-ink px-3.5 text-[13px] font-medium text-on-ink transition hover:bg-ink/90"
            >
              Verify
            </button>
          </span>
        ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status} /> },
    {
      key: 'rating',
      label: 'Rating',
      align: 'right',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-ink">
          <Star className="h-3.5 w-3.5 fill-ink" aria-hidden="true" />
          {row.rating}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <span className="flex justify-end gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/admin/drivers/${row.id}`)
            }}
            className="h-9 rounded-full border border-line px-4 text-[13px] text-ink-soft transition hover:bg-surface-soft"
          >
            View
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              toggleStatus(row)
            }}
            className={`h-9 rounded-full border border-line px-4 text-[13px] transition ${
              row.status === 'suspended' ? 'text-live-ink hover:bg-live-tint' : 'text-[rgb(var(--color-status-cancelled))] hover:bg-pin-tint'
            }`}
          >
            {row.status === 'suspended' ? 'Activate' : 'Suspend'}
          </button>
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Drivers" description="Verify, monitor, and manage your driver fleet." />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:flex-none">
          <span className="sr-only">Search drivers</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search by name or plate"
            className={searchClass}
          />
        </label>
        <select
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value)
            setPage(1)
          }}
          aria-label="Filter drivers"
          className={selectClass}
        >
          <option value="all">All drivers</option>
          <option value="pending">Pending verification</option>
          <option value="verified">Verified</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="mt-5">
        {rows.length === 0 ? (
          <EmptyState icon={Car} title="No drivers found" description="Try a different search or filter." />
        ) : (
          <>
            <DataTable columns={columns} rows={visible} onRowClick={(row) => navigate(`/admin/drivers/${row.id}`)} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

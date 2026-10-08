import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Search } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import StatCard from '../../components/common/StatCard'
import EmptyState from '../../components/common/EmptyState'
import { PAYMENTS } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

const PER_PAGE = 7

const searchClass =
  'h-11 w-full rounded-full bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface-soft focus:ring-2 focus:ring-ink sm:w-72'

const selectClass =
  'h-11 rounded-full border border-line bg-surface px-4 text-sm text-ink-soft outline-none transition focus:ring-2 focus:ring-ink'

export default function Payments() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const rows = useMemo(
    () =>
      PAYMENTS.filter((payment) => {
        const haystack = `${payment.id} ${payment.rideId} ${payment.passenger} ${payment.method}`.toLowerCase()
        const matchesQuery = !query.trim() || haystack.includes(query.toLowerCase())
        const matchesStatus = status === 'all' || payment.status === status
        return matchesQuery && matchesStatus
      }),
    [query, status],
  )

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  const visible = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const captured = PAYMENTS.filter((payment) => payment.status === 'captured').reduce((sum, payment) => sum + payment.amount, 0)
  const pending = PAYMENTS.filter((payment) => payment.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0)
  const refunded = PAYMENTS.filter((payment) => payment.status === 'refunded').reduce((sum, payment) => sum + payment.amount, 0)

  const columns = [
    { key: 'id', label: 'Transaction', render: (row) => <span className="text-muted">{row.id}</span> },
    {
      key: 'rideId',
      label: 'Ride',
      render: (row) => (
        <Link to={`/admin/rides/${row.rideId}`} className="text-ink underline-offset-4 hover:underline" onClick={(event) => event.stopPropagation()}>
          {row.rideId}
        </Link>
      ),
    },
    { key: 'passenger', label: 'Passenger' },
    { key: 'amount', label: 'Amount', align: 'right', render: (row) => <span className="font-medium text-ink">{formatINR(row.amount)}</span> },
    { key: 'method', label: 'Method', render: (row) => <span className="text-muted-strong">{row.method}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status} /> },
    { key: 'date', label: 'Date', render: (row) => <span className="text-muted-strong">{formatDate(row.date)}</span> },
  ]

  return (
    <div>
      <PageHeader title="Payments" description="Every transaction across RideX." />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Captured" value={formatINR(captured)} hint={`${PAYMENTS.filter((p) => p.status === 'captured').length} transactions`} />
        <StatCard label="Pending" value={formatINR(pending)} hint="Settles within 24 hours" />
        <StatCard label="Refunded" value={formatINR(refunded)} hint="Returned to passengers" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:flex-none">
          <span className="sr-only">Search payments</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search transaction or ride"
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
          <option value="captured">Captured</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="mt-5">
        {rows.length === 0 ? (
          <EmptyState icon={CreditCard} title="No payments found" description="Try a different search or status filter." />
        ) : (
          <>
            <DataTable columns={columns} rows={visible} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

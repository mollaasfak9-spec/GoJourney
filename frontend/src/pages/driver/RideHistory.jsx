import { useMemo, useState } from 'react'
import { History } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import { RIDES } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

const PER_PAGE = 6

export default function DriverRideHistory() {
  const [page, setPage] = useState(1)

  const rides = useMemo(
    () => RIDES.filter((ride) => ride.driver === 'Rahul Dey' && ride.status === 'completed'),
    [],
  )

  const totalPages = Math.max(1, Math.ceil(rides.length / PER_PAGE))
  const rows = rides.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const columns = [
    { key: 'id', label: 'Ride', render: (row) => <span className="text-muted">{row.id}</span> },
    { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
    {
      key: 'route',
      label: 'Route',
      render: (row) => (
        <span className="text-ink">
          {row.pickup} <span className="text-muted">→</span> {row.destination}
        </span>
      ),
    },
    { key: 'fare', label: 'Fare', align: 'right', render: (row) => formatINR(row.fare) },
    {
      key: 'earning',
      label: 'You earned',
      align: 'right',
      render: (row) => <span className="font-medium text-ink">{formatINR(Math.round(row.fare * 0.85))}</span>,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Ride history"
        description="Completed rides and what you earned from each."
      />

      <div className="mt-6">
        {rows.length === 0 ? (
          <EmptyState icon={History} title="No rides yet" description="Completed rides will show up here." />
        ) : (
          <>
            <DataTable columns={columns} rows={rows} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}

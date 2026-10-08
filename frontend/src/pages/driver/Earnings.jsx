import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import BarChart from '../../components/common/BarChart'
import DataTable from '../../components/common/DataTable'
import { EARNINGS } from '../../constants/mockData'
import { formatDate, formatINR } from '../../utils/format'

export default function Earnings() {
  const columns = [
    { key: 'id', label: 'Ride', render: (row) => <span className="text-muted">{row.id}</span> },
    { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
    { key: 'route', label: 'Route' },
    { key: 'fare', label: 'Fare', align: 'right', render: (row) => formatINR(row.fare) },
    { key: 'earning', label: 'You earned', align: 'right', render: (row) => <span className="font-medium text-ink">{formatINR(row.earning)}</span> },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Earnings" description="How much you've made, and where it came from." />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today" value={formatINR(EARNINGS.today)} hint="7 rides completed" />
        <StatCard label="This week" value={formatINR(EARNINGS.week)} delta="+12%" hint="Mon – Sun" />
        <StatCard label="This month" value={formatINR(EARNINGS.month)} delta="+4%" hint="Since 1 Oct" />
        <StatCard label="Completed rides" value={String(EARNINGS.completedRides)} hint="Lifetime" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-ink">This week</h2>
            <span className="text-[13px] text-muted">Peak day in black</span>
          </div>
          <BarChart className="mt-5" data={EARNINGS.bars} />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-medium text-ink">Payout summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Gross fares</dt>
              <dd className="tabular-nums text-ink-soft">{formatINR(6120)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Platform fee (15%)</dt>
              <dd className="tabular-nums text-ink-soft">−{formatINR(920)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="font-medium text-ink">Net payout</dt>
              <dd className="text-lg font-medium tabular-nums text-ink">{formatINR(EARNINGS.week)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] text-muted">Paid every Monday to your registered bank account.</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-medium text-ink">Recent earnings</h2>
      <DataTable className="mt-3" columns={columns} rows={EARNINGS.recent} />
    </div>
  )
}

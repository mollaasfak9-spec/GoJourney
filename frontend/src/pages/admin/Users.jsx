import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users as UsersIcon } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import Avatar from '../../components/common/Avatar'
import { USERS } from '../../constants/mockData'
import { formatDate } from '../../utils/format'
import { useToast } from '../../context/toast'

const PER_PAGE = 6

const searchClass =
  'h-11 w-full rounded-full bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface-soft focus:ring-2 focus:ring-ink sm:w-72'

const selectClass =
  'h-11 rounded-full border border-line bg-surface px-4 text-sm text-ink-soft outline-none transition focus:ring-2 focus:ring-ink'

export default function Users() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [statuses, setStatuses] = useState({})
  const [suspendTarget, setSuspendTarget] = useState(null)

  const rows = useMemo(() => {
    return USERS.filter((user) => {
      const matchesQuery =
        !query.trim() ||
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      const matchesRole = role === 'all' || user.role === role
      return matchesQuery && matchesRole
    }).map((user) => ({ ...user, status: statuses[user.id] || user.status }))
  }, [query, role, statuses])

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  const visible = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function confirmSuspend() {
    const target = suspendTarget
    setStatuses((prev) => ({ ...prev, [target.id]: prev[target.id] === 'suspended' ? 'active' : 'suspended' }))
    setSuspendTarget(null)
    toast(target.status === 'suspended' ? 'User activated' : 'User suspended')
  }

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <span className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{row.name}</span>
            <span className="block truncate text-[13px] text-muted">{row.email}</span>
          </span>
        </span>
      ),
    },
    { key: 'phone', label: 'Phone', render: (row) => <span className="text-muted-strong">{row.phone}</span> },
    { key: 'role', label: 'Role', render: (row) => <span className="capitalize text-muted-strong">{row.role}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status} /> },
    { key: 'createdAt', label: 'Joined', render: (row) => <span className="text-muted-strong">{formatDate(row.createdAt)}</span> },
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
              navigate(`/admin/users/${row.id}`)
            }}
            className="h-9 rounded-full border border-line px-4 text-[13px] text-ink-soft transition hover:bg-surface-soft"
          >
            View
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setSuspendTarget(row)
            }}
            className={`h-9 rounded-full border px-4 text-[13px] transition ${
              row.status === 'suspended'
                ? 'border-line bg-surface text-live-ink hover:bg-live-tint'
                : 'border-line bg-surface text-[rgb(var(--color-status-cancelled))] hover:bg-pin-tint'
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
      <PageHeader title="Users" description="Everyone who has joined RideX." />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:flex-none">
          <span className="sr-only">Search users</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search by name or email"
            className={searchClass}
          />
        </label>
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value)
            setPage(1)
          }}
          aria-label="Filter by role"
          className={selectClass}
        >
          <option value="all">All roles</option>
          <option value="passenger">Passengers</option>
          <option value="driver">Drivers</option>
        </select>
      </div>

      <div className="mt-5">
        {rows.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" description="Try a different search or filter." />
        ) : (
          <>
            <DataTable columns={columns} rows={visible} onRowClick={(row) => navigate(`/admin/users/${row.id}`)} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={Boolean(suspendTarget)} onClose={() => setSuspendTarget(null)}>
        {suspendTarget && (
          <div className="flex flex-col gap-4">
            <div className="pr-8">
              <h3 className="text-lg font-medium text-ink">
                {suspendTarget.status === 'suspended' ? 'Activate this user?' : 'Suspend this user?'}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {suspendTarget.status === 'suspended'
                  ? `${suspendTarget.name} will be able to book and drive again.`
                  : `${suspendTarget.name} will lose access until an admin reactivates the account.`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSuspendTarget(null)}
                className="h-11 flex-1 rounded-full border border-line bg-surface text-sm font-medium text-ink-soft transition hover:bg-surface-soft"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSuspend}
                className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-on-ink transition hover:bg-ink/90"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

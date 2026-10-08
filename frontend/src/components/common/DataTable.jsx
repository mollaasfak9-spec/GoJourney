export default function DataTable({ columns = [], rows = [], rowKey = (row) => row.id, onRowClick, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-surface ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-paper">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-5 py-3 text-[13px] font-normal text-muted ${column.align === 'right' ? 'text-right' : ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-t border-line transition-colors hover:bg-surface-soft ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-5 py-4 text-sm align-middle text-ink-soft ${column.align === 'right' ? 'text-right tabular-nums' : ''}`}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

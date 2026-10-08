export default function BarChart({ data = [], height = 160, className = '' }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={className}>
      <div className="flex items-end gap-3 sm:gap-4" style={{ height }}>
        {data.map((item) => {
          const pct = Math.max(6, Math.round((item.value / max) * 100))
          const isPeak = item.value === max
          return (
            <div key={item.label} className="group relative flex flex-1 flex-col items-center justify-end gap-2">
              <span className="pointer-events-none absolute -top-1 hidden -translate-y-full rounded-full bg-ink px-2 py-1 text-xs text-on-ink group-hover:block">
                {item.value}
              </span>
              <div
                className={`w-full rounded-t-md transition-opacity hover:opacity-80 ${
                  isPeak ? 'bg-ink' : 'bg-line'
                }`}
                style={{ height: `${pct}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 border-t border-line pt-2">
        <div className="flex gap-3 sm:gap-4">
          {data.map((item) => (
            <span key={item.label} className="flex-1 text-center text-[13px] text-muted">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

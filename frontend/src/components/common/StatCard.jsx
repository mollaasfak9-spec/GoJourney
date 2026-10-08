export default function StatCard({ label, value, delta, hint, className = '' }) {
  const positive = delta && delta.startsWith('+')
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 sm:p-6 ${className}`}>
      <p className="text-[13px] text-muted">{label}</p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-3xl sm:text-4xl font-medium tracking-tight tabular-nums">{value}</p>
        {delta && (
          <span
            className={`mb-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              positive ? 'bg-live-tint text-live-ink' : 'bg-pin-tint text-pin'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[13px] text-muted">{hint}</p>}
    </div>
  )
}

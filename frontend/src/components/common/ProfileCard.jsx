import Avatar from './Avatar'

export default function ProfileCard({ name, subtitle, chip, stats = [], actions, children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-line bg-surface ${className}`}>
      <div className="h-24 bg-[linear-gradient(180deg,rgb(var(--color-surface-soft))_0%,rgb(var(--color-paper))_100%)] sm:h-32" />
      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar name={name} size="lg" className="ring-4 ring-surface" />
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-medium tracking-tight text-ink">{name}</h2>
                {chip}
              </div>
              {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap gap-2 pb-1">{actions}</div>}
        </div>

        {stats.length > 0 && (
          <div className="mt-6 grid grid-cols-3 divide-x divide-line rounded-2xl bg-surface-soft">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 text-center">
                <p className="text-xl font-medium tabular-nums text-ink">{stat.value}</p>
                <p className="mt-0.5 text-[13px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}

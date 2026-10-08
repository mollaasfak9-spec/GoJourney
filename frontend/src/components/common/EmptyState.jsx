export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-12 text-center ${className}`}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft">
          <Icon className="h-6 w-6 text-muted" aria-hidden="true" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-strong">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

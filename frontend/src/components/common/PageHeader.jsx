export default function PageHeader({ title, description, actions, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-strong">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

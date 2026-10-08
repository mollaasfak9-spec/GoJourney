export default function FilterTabs({ tabs = [], value, onChange, className = '' }) {
  return (
    <div
      role="tablist"
      aria-label="Filters"
      className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface-soft p-1.5 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft ${
              isActive ? 'bg-surface font-medium text-ink shadow-flat' : 'text-muted hover:text-ink-soft'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange?.(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors ${
            n === page ? 'bg-ink text-on-ink' : 'border border-line bg-surface text-ink-soft hover:bg-surface-soft'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange?.(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

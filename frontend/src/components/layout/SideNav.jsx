import { NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'

export default function SideNav({ brand, items = [], top, footer, open, onClose }) {
  const body = (
    <>
      <div className="flex h-16 items-center justify-between px-5">
        {brand}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-soft lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {top && <div className="px-5 pb-4">{top}</div>}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Main">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center gap-3 rounded-full px-4 text-sm transition-colors ${
                  isActive
                    ? 'bg-ink font-medium text-on-ink'
                    : 'text-muted-strong hover:bg-surface-soft hover:text-ink'
                }`
              }
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {footer && <div className="border-t border-line p-4">{footer}</div>}
    </>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-surface lg:flex">
        {body}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/35" onClick={onClose} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-surface shadow-float">
            {body}
          </div>
        </div>
      )}
    </>
  )
}

export function SideNavLogout({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm text-muted-strong transition-colors hover:bg-surface-soft hover:text-ink"
    >
      <LogOut className="h-5 w-5" aria-hidden="true" />
      Log out
    </button>
  )
}

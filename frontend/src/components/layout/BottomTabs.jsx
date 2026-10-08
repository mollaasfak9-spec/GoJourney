import { NavLink } from 'react-router-dom'

export default function BottomTabs({ items = [], className = '' }) {
  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-around rounded-full border border-line bg-surface px-2 py-2 shadow-float lg:hidden ${className}`}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-h-[44px] flex-1 flex-col items-center gap-1 rounded-full px-1 py-1 text-[11px] transition-colors ${
                isActive ? 'text-ink' : 'text-muted hover:text-ink-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-ink text-on-ink' : 'text-muted-strong'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

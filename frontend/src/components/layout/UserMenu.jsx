import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../../context/auth'
import Avatar from '../common/Avatar'

export default function UserMenu({ profileTo }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        <Avatar name={user.name} size="sm" />
        <span className="hidden text-sm font-medium text-ink sm:block">{user.name.split(' ')[0]}</span>
        <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-line bg-surface p-2 shadow-float">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-[13px] text-muted">{user.email}</p>
            <span className="mt-1.5 inline-flex rounded-full bg-surface-soft px-2 py-0.5 text-[13px] capitalize text-muted-strong">
              {user.role}
            </span>
          </div>
          <div className="my-1 h-px bg-line" />
          {profileTo && (
            <Link
              to={profileTo}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-surface-soft"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Profile
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-surface-soft"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

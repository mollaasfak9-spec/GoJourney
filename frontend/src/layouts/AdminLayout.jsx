import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Car, CreditCard, LayoutDashboard, Menu, Route, Search, Users } from 'lucide-react'
import Brand from '../components/layout/Brand'
import SideNav, { SideNavLogout } from '../components/layout/SideNav'
import UserMenu from '../components/layout/UserMenu'
import { useAuth } from '../context/auth'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/drivers', label: 'Drivers', icon: Car },
  { to: '/admin/rides', label: 'Rides', icon: Route },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
]

const breadcrumbs = {
  '/admin': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/drivers': 'Drivers',
  '/admin/rides': 'Rides',
  '/admin/payments': 'Payments',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  const base = '/' + location.pathname.split('/').filter(Boolean).slice(0, 2).join('/')
  const title = breadcrumbs[base] || 'Dashboard'

  return (
    <div className="min-h-screen bg-paper">
      <SideNav
        items={items}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        brand={<Brand to="/admin" />}
        footer={<SideNavLogout onClick={logout} />}
      />

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                aria-label="Open navigation"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <p className="text-sm text-muted">
                Admin <span className="mx-1 text-line">/</span>
                <span className="font-medium text-ink">{title}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <label className="relative hidden md:block">
                <span className="sr-only">Search</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search users, rides..."
                  className="h-10 w-56 rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink"
                />
              </label>
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  )
}

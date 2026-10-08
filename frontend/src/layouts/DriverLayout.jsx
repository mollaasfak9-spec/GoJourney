import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CarFront, ClipboardList, History, LayoutDashboard, Menu, UserRound, Wallet } from 'lucide-react'
import Brand from '../components/layout/Brand'
import BottomTabs from '../components/layout/BottomTabs'
import SideNav, { SideNavLogout } from '../components/layout/SideNav'
import UserMenu from '../components/layout/UserMenu'
import { useAuth } from '../context/auth'

const items = [
  { to: '/driver', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/driver/rides', label: 'Ride requests', icon: ClipboardList },
  { to: '/driver/earnings', label: 'Earnings', icon: Wallet },
  { to: '/driver/rides/history', label: 'Ride history', icon: History },
  { to: '/driver/vehicle', label: 'Vehicle', icon: CarFront },
  { to: '/driver/profile', label: 'Profile', icon: UserRound },
]

const tabs = [
  { to: '/driver', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/driver/rides', label: 'Requests', icon: ClipboardList },
  { to: '/driver/earnings', label: 'Earnings', icon: Wallet },
  { to: '/driver/vehicle', label: 'Vehicle', icon: CarFront },
  { to: '/driver/profile', label: 'Profile', icon: UserRound },
]

function OnlineToggle({ online, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={online}
      onClick={onToggle}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
        online ? 'border-live/40 bg-live-tint text-live-ink' : 'border-line bg-surface text-muted-strong'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${online ? 'animate-pulse bg-live' : 'bg-muted'}`} aria-hidden="true" />
      {online ? 'Online' : 'Offline'}
    </button>
  )
}

export default function DriverLayout() {
  const { user, logout } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const [online, setOnline] = useState(true)
  const location = useLocation()

  const pageTitle = (() => {
    if (/^\/driver\/rides\/(?!history$)[^/]+$/.test(location.pathname)) return 'Active ride'
    const exact = items.find((item) => item.to === location.pathname)
    if (exact) return exact.label
    return items.find((item) => !item.end && location.pathname.startsWith(item.to))?.label || 'Dashboard'
  })()

  return (
    <div className="min-h-screen bg-paper">
      <SideNav
        items={items}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        brand={<Brand to="/driver" />}
        footer={<SideNavLogout onClick={logout} />}
      />

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                aria-label="Open navigation"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="hidden text-sm font-medium text-ink lg:block">{pageTitle}</span>
              <span className="text-sm font-medium text-ink lg:hidden">{pageTitle}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <OnlineToggle online={online} onToggle={() => setOnline((prev) => !prev)} />
              <UserMenu profileTo="/driver/profile" />
            </div>
          </div>
        </header>

        <main className="pb-28 lg:pb-10">
          <Outlet context={{ user, online, setOnline }} />
        </main>
      </div>

      <BottomTabs items={tabs} />
    </div>
  )
}

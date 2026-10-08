import { NavLink, Outlet } from 'react-router-dom'
import { Car, History, House, UserRound } from 'lucide-react'
import Brand from '../components/layout/Brand'
import BottomTabs from '../components/layout/BottomTabs'
import UserMenu from '../components/layout/UserMenu'
import { useAuth } from '../context/auth'

const links = [
  { to: '/passenger', label: 'Home', end: true },
  { to: '/passenger/book', label: 'Book' },
  { to: '/passenger/rides', label: 'Rides' },
  { to: '/passenger/profile', label: 'Profile' },
]

const tabs = [
  { to: '/passenger', label: 'Home', icon: House, end: true },
  { to: '/passenger/book', label: 'Book', icon: Car },
  { to: '/passenger/rides', label: 'Rides', icon: History },
  { to: '/passenger/profile', label: 'Profile', icon: UserRound },
]

export default function PassengerLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Brand to="/passenger" />
            <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Passenger">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'font-medium text-ink' : 'text-muted-strong hover:text-ink'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <UserMenu profileTo="/passenger/profile" />
        </div>
      </header>

      <main className="pb-28 lg:pb-10">
        <Outlet context={{ user }} />
      </main>

      <BottomTabs items={tabs} />
    </div>
  )
}

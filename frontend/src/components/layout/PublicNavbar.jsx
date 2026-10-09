import { Link, NavLink } from 'react-router-dom'
import { Menu, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import ThemeToggle from '../common/ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`sticky top-0 z-40 w-full transition-[padding] duration-300 ${scrolled ? 'pt-4' : 'pt-0'}`}>
      <div className={`mx-auto transition-all duration-300 ${scrolled ? 'max-w-5xl px-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        <div
          className={`flex h-[72px] items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'rounded-full border border-line bg-surface/90 px-6 shadow-float backdrop-blur'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <div className="flex flex-1 items-center">
            <Link to="/" className="text-[22px] font-medium tracking-tight text-ink" aria-label="RideX home">
              RideX
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `whitespace-nowrap transition-colors ${isActive ? 'font-medium text-ink' : 'text-muted-strong hover:text-ink'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-on-ink shadow-button transition-colors hover:bg-ink/90"
            >
              Register <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2 text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `whitespace-nowrap py-2 transition-colors ${isActive ? 'font-medium text-ink' : 'text-muted-strong hover:text-ink'}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-line px-4 py-3 text-sm font-medium text-ink-soft"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-3 text-sm font-medium text-on-ink shadow-button"
              >
                Register <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

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

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

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
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-1 text-[15px] transition-colors ${
                    active ? 'text-ink' : 'text-muted-strong hover:text-ink'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </nav>

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
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/35 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col bg-surface px-6 pb-8 pt-4" role="dialog" aria-modal="true" aria-label="Navigation">
            <div className="flex h-[72px] items-center justify-between">
              <Link to="/" className="text-[22px] font-medium tracking-tight text-ink" onClick={() => setOpen(false)}>
                RideX
              </Link>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-5">
              {navLinks.map((link) => {
                const active = isActive(link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`text-[28px] font-medium tracking-tight transition-colors ${
                      active ? 'text-ink' : 'text-muted-strong hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
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

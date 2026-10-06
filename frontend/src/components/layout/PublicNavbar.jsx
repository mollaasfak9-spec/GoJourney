import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import ThemeToggle from '../common/ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-ink"></span>
              <span className="text-lg font-medium tracking-tight">RideX</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-muted-strong hover:text-ink transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border border-line text-ink-soft hover:bg-surface-soft transition-colors">
              Login
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-ink text-on-ink hover:bg-ink/90 transition-colors shadow-button">
              Register
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2 text-sm">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="py-2 text-muted-strong hover:text-ink" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border border-line text-ink-soft" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full bg-ink text-on-ink" onClick={() => setOpen(false)}>
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
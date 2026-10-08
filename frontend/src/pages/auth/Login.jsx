import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, TriangleAlert } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import PasswordField from '../../components/common/PasswordField'
import { roleHome, useAuth } from '../../context/auth'

const inputClass =
  'h-[52px] w-full rounded-[14px] bg-surface-soft px-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink'

const DEMO_ACCOUNTS = [
  { label: 'Passenger', email: 'akash@example.com' },
  { label: 'Driver', email: 'driver@ridex.com' },
  { label: 'Admin', email: 'admin@ridex.com' },
]

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={roleHome(user.role)} replace />

  function validate() {
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    if (password.length < 4) next.password = 'Password must be at least 4 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      const role = await login({ email, password })
      navigate(from || roleHome(role), { replace: true })
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your RideX dashboard."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-ink underline underline-offset-4">
            Create account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[13px] text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => email && setErrors((prev) => ({ ...prev, email: undefined }))}
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : undefined}
            className={`${inputClass} ${errors.email ? 'ring-2 ring-[rgb(var(--color-status-cancelled))]' : ''}`}
          />
          {errors.email && <p className="text-[13px] text-[rgb(var(--color-status-cancelled))]">{errors.email}</p>}
        </div>

        <PasswordField
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => {
                setEmail(account.email)
                setPassword('ridex1234')
                setErrors({})
                setFormError('')
              }}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] text-muted-strong transition-colors hover:bg-surface-soft hover:text-ink"
            >
              {account.label} demo
            </button>
          ))}
        </div>

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-pin-tint px-4 py-3 text-sm text-[rgb(var(--color-status-cancelled))]"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  )
}

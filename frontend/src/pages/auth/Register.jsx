import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Car, Check, Loader2, TriangleAlert, UserRound } from 'lucide-react'
import AuthShell from '../../components/auth/AuthShell'
import PasswordField from '../../components/common/PasswordField'
import { roleHome, useAuth } from '../../context/auth'

const inputClass =
  'h-[52px] w-full rounded-[14px] bg-surface-soft px-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink'

const ROLES = [
  { id: 'passenger', label: 'Passenger', description: 'Book rides and track them in real time.', icon: UserRound },
  { id: 'driver', label: 'Driver', description: 'Accept requests and earn on your schedule.', icon: Car },
]

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [role, setRole] = useState('passenger')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={roleHome(user.role)} replace />

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (form.phone.trim() && form.phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a 10-digit phone number.'
    if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      const nextRole = await register({ ...form, role })
      navigate(roleHome(nextRole), { replace: true })
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, props = {}) => (
    <div className="space-y-2">
      <label htmlFor={key} className="block text-[13px] text-muted">
        {label}
      </label>
      <input
        id={key}
        value={form[key]}
        onChange={(event) => update(key, event.target.value)}
        aria-invalid={errors[key] ? 'true' : undefined}
        className={`${inputClass} ${errors[key] ? 'ring-2 ring-[rgb(var(--color-status-cancelled))]' : ''}`}
        {...props}
      />
      {errors[key] && <p className="text-[13px] text-[rgb(var(--color-status-cancelled))]">{errors[key]}</p>}
    </div>
  )

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join RideX in a few seconds."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-3">
          {ROLES.map((option) => {
            const Icon = option.icon
            const isSelected = role === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setRole(option.id)}
                className={`relative rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                  isSelected ? 'border-ink bg-surface' : 'border-line bg-surface hover:bg-surface-soft/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-on-ink">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                )}
                <Icon className="h-5 w-5 text-ink-soft" aria-hidden="true" />
                <span className="mt-2 block text-sm font-medium text-ink">{option.label}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted">{option.description}</span>
              </button>
            )
          })}
        </div>

        {field('name', 'Full name', { type: 'text', autoComplete: 'name', placeholder: 'Akash Das' })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' })}
        {field('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel', placeholder: '+91 98301 11223' })}

        <PasswordField
          id="password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          error={errors.password}
          hint="At least 6 characters."
        />
        <PasswordField
          id="confirm"
          label="Confirm password"
          value={form.confirm}
          onChange={(event) => update('confirm', event.target.value)}
          error={errors.confirm}
        />

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
              Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  )
}

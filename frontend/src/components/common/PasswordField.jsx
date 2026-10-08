import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ id, label = 'Password', value, onChange, placeholder = '••••••••', error, hint }) {
  const [visible, setVisible] = useState(false)
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[13px] text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`h-[52px] w-full rounded-[14px] bg-surface-soft px-4 pr-12 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink ${
            error ? 'ring-2 ring-[rgb(var(--color-status-cancelled))]' : ''
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] text-[rgb(var(--color-status-cancelled))]">
          {error}
        </p>
      )}
    </div>
  )
}

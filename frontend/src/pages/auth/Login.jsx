import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-button">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">Sign in to RideX</h1>
        <p className="mt-2 text-sm text-muted-strong">Welcome back. Continue to your dashboard.</p>
        <form className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" placeholder="you@example.com" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-ink-soft transition-colors" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input id="password" type="password" placeholder="••••••••" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-ink-soft transition-colors" />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink hover:bg-ink/90 transition-colors">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-ink-soft hover:text-ink">Register</Link>
        </p>
      </div>
    </div>
  )
}
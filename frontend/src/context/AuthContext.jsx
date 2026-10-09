import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import { authApi } from '../services/endpoints'
import { getToken, setToken, clearToken } from '../services/token'
import { USERS } from '../constants/mockData'

/**
 * Auth provider wired to the real backend.
 *
 * The backend is the source of truth: login/register persist a JWT (httpOnly
 * cookie + localStorage bearer) and the session is restored from `GET /auth/me`.
 *
 * When the API is unreachable (backend not running, network failure) the app
 * degrades to the original local-only demo accounts so the UI stays usable.
 * That fallback is deliberately gated on transport-level failures — a real
 * rejection like "invalid credentials" (401) is always surfaced to the user and
 * never faked into a successful login.
 */

const STORAGE_KEY = 'ridex.auth.user'

const DEMO_ACCOUNTS = {
  'passenger@ridex.com': { name: 'Demo Passenger', phone: '9000000001' },
  'driver@ridex.com': { name: 'Demo Driver', phone: '9000000002' },
  'admin@ridex.com': { name: 'Demo Admin', phone: '9000000003' },
}

function identityFor(email) {
  const key = email.trim().toLowerCase()
  const known = USERS.find((item) => item.email.toLowerCase() === key) || DEMO_ACCOUNTS[key]
  if (known) return { name: known.name, phone: known.phone }
  const derived = key.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { name: derived, phone: undefined }
}

function roleFromEmail(email = '') {
  const local = email.trim().toLowerCase()
  if (local.startsWith('admin')) return 'admin'
  if (local.startsWith('driver')) return 'driver'
  return 'passenger'
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Backend user document -> the shape the UI renders.
function normalizeUser(user) {
  if (!user) return null
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage ?? null,
  }
}

// True only for transport-level failures where the API could not be reached.
// A missing status (no HTTP response) or a 5xx from the dev proxy both mean the
// backend is unavailable, so we may safely fall back to local demo behaviour.
function isBackendUnreachable(error) {
  if (!error) return false
  const status = error.status
  return status === undefined || status === null || status >= 500
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Restore / refresh the session from the backend on first load.
  useEffect(() => {
    let cancelled = false

    const stored = readStoredUser()

    if (!stored && !getToken()) return undefined

    authApi
      .me()
      .then((res) => {
        if (cancelled) return
        const next = normalizeUser(res?.data?.user)
        if (next) setUser(next)
      })
      .catch((error) => {
        if (cancelled) return
        // Session genuinely rejected → clear it. Transport failure → keep the
        // stored user so the app still works offline.
        if (!isBackendUnreachable(error)) {
          clearToken()
          setUser(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  // The axios interceptor fires this when a token is rejected mid-session.
  useEffect(() => {
    function handleExpired() {
      setUser(null)
    }
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await authApi.login({ email: email.trim(), password })
      const { user: backendUser, token } = res?.data || {}
      setToken(token)
      const next = normalizeUser(backendUser)
      if (!next) throw new Error('Login failed. Please try again.')
      setUser(next)
      return next.role
    } catch (error) {
      if (!isBackendUnreachable(error)) throw error

      // Offline demo fallback
      if (!email.trim() || password.length < 4) {
        throw new Error('Invalid email or password. Check your details and try again.', { cause: error })
      }
      const nextRole = roleFromEmail(email)
      const { name, phone } = identityFor(email)
      setUser({ name, phone, email: email.trim(), role: nextRole })
      return nextRole
    }
  }, [])

  const register = useCallback(async ({ name, email, phone, password, role }) => {
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: role || 'passenger',
    }

    // Backend expects a bare 10 digit phone when provided.
    const digits = (phone || '').replace(/\D/g, '')
    if (digits) payload.phone = digits.slice(-10)

    try {
      const res = await authApi.register(payload)
      const { user: backendUser, token } = res?.data || {}
      setToken(token)
      const next = normalizeUser(backendUser)
      if (!next) throw new Error('Registration failed. Please try again.')
      setUser(next)
      return next.role
    } catch (error) {
      if (!isBackendUnreachable(error)) throw error

      // Offline demo fallback
      if (!name.trim() || !email.trim() || password.length < 6) {
        throw new Error('Fill in your name, email, and a password of at least 6 characters.', { cause: error })
      }
      const nextRole = role || 'passenger'
      setUser({ name: name.trim(), email: email.trim(), phone: phone?.trim(), role: nextRole })
      return nextRole
    }
  }, [])

  const logout = useCallback(() => {
    authApi.logout().catch(() => {})
    clearToken()
    setUser(null)
  }, [])

  const updateProfile = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

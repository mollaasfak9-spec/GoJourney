import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import { USERS } from '../constants/mockData'

const STORAGE_KEY = 'ridex.auth.user'

const DEMO_ACCOUNTS = {
  'driver@ridex.com': { name: 'Rahul Dey', phone: '+91 90073 88121' },
  'admin@ridex.com': { name: 'Priya Admin', phone: '+91 98745 55412' },
}

function identityFor(email) {
  const key = email.trim().toLowerCase()
  const known = USERS.find((item) => item.email.toLowerCase() === key) || DEMO_ACCOUNTS[key]
  if (known) return { name: known.name, phone: known.phone }
  const derived = key.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { name: derived, phone: undefined }
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function roleFromEmail(email = '') {
  const local = email.trim().toLowerCase()
  if (local.startsWith('admin')) return 'admin'
  if (local.startsWith('driver')) return 'driver'
  return 'passenger'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login = useCallback(async ({ email, password, role }) => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (!email.trim() || password.length < 4) {
      throw new Error('Invalid email or password. Check your details and try again.')
    }
    const nextRole = role || roleFromEmail(email)
    const { name, phone } = identityFor(email)
    setUser({ name, phone, email: email.trim(), role: nextRole })
    return nextRole
  }, [])

  const register = useCallback(async ({ name, email, phone, password, role }) => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    if (!name.trim() || !email.trim() || password.length < 6) {
      throw new Error('Fill in your name, email, and a password of at least 6 characters.')
    }
    const nextRole = role || 'passenger'
    setUser({ name: name.trim(), email: email.trim(), phone: phone?.trim(), role: nextRole })
    return nextRole
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const updateProfile = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

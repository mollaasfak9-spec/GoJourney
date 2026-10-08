import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

export function roleHome(role) {
  if (role === 'admin') return '/admin'
  if (role === 'driver') return '/driver'
  return '/passenger'
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

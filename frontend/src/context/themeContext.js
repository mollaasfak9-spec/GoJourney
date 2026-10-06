import { createContext } from 'react'

export const THEME_STORAGE_KEY = 'ridex-theme'

export const ThemeContext = createContext(null)

export function readStoredTheme() {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can throw when blocked, so fall through to the system value.
  }

  return null
}

export function readSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
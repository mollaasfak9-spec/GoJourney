import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  readStoredTheme,
  readSystemTheme,
} from './themeContext'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStoredTheme() ?? readSystemTheme())

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // The choice simply will not persist across reloads.
    }
  }, [theme])

  // Only track the OS preference while there is no explicit choice saved.
  useEffect(() => {
    if (readStoredTheme()) return
    if (typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setThemeState(event.matches ? 'dark' : 'light')

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((next) => {
    if (next === 'light' || next === 'dark') setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
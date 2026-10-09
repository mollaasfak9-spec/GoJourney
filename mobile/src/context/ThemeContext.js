import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, fonts, lightColors, radii, spacing, typography } from '../theme/tokens';

const STORAGE_KEY = 'ridex.themeMode';

const ThemeContext = createContext(null);

/**
 * Provides the active theme to the whole app.
 * mode is one of 'system' | 'light' | 'dark' (DESIGN.md 16) and is persisted.
 * `initialMode` exists so tests can render a theme without AsyncStorage.
 */
export function ThemeProvider({ children, initialMode = 'system' }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState(initialMode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && (saved === 'system' || saved === 'light' || saved === 'dark')) {
          setModeState(saved);
        }
      } catch {
        // Persistence failure only loses the preference; stay on the default.
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback((next) => {
    if (next !== 'system' && next !== 'light' && next !== 'dark') return;
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const isDark = (mode === 'system' ? systemScheme : mode) === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({ mode, setMode, isDark, colors, fonts, spacing, radii, typography, hydrated }),
    [mode, setMode, isDark, colors, hydrated],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the theme for the current tree. Throws when used outside ThemeProvider. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a <ThemeProvider>.');
  }
  return context;
}

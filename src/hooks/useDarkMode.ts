import { useEffect, useState } from 'react'
import { load, save } from '../lib/storage'
import { STORAGE_KEYS } from '../constants'

export type Theme = 'light' | 'dark'

/**
 * Pure theme resolution, tested in useDarkMode.test.ts.
 * A stored choice always wins. Otherwise the operating system
 * preference decides. Anything else falls back to light.
 */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'dark' || stored === 'light') return stored
  return prefersDark ? 'dark' : 'light'
}

function readStoredTheme(): Theme {
  const stored = load<string | null>(STORAGE_KEYS.theme, null)
  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches === true
  return resolveTheme(stored, prefersDark)
}

/** Dark mode state, persisted in localStorage and applied as data-theme on <html>. */
export function useDarkMode(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save(STORAGE_KEYS.theme, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggleTheme]
}

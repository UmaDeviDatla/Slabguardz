import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './themeContext'

const THEME_STORAGE_KEY = 'slabguardz-theme'


export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('day')

  useEffect(() => {
    document.documentElement.dataset.theme = 'day'
    window.localStorage.setItem(THEME_STORAGE_KEY, 'day')
  }, [])

  const toggleTheme = useCallback(() => {
    // Kept for backward compatibility, preserves pure white
    setTheme('day')
  }, [])
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
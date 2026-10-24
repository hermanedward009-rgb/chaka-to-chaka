import { useEffect, useMemo, useState } from 'react'
import { applyTheme, readTheme, THEME_KEY, ThemeContext } from '../theme.js'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme)
  applyTheme(theme)

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* The chosen mode still applies for this visit. */
    }
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

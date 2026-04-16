"use client"

import * as React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme =
  | "theme-clubspark-admin"
  | "theme-clubspark-public"
  | "theme-ecb-admin"
  | "theme-ecb-public"
  | "theme-club-website"
  | "theme-test-public"
  | "theme-test-admin-1"

export type ThemeContextValue = {
  theme:     Theme
  setTheme:  (theme: Theme) => void
  isDark:    boolean
  setIsDark: (dark: boolean) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = React.createContext<ThemeContextValue>({
  theme:     "theme-clubspark-admin",
  setTheme:  () => {},
  isDark:    false,
  setIsDark: () => {},
})

export function useTheme() {
  return React.useContext(ThemeContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export type ThemeProviderProps = {
  children:      React.ReactNode
  defaultTheme?: Theme
  defaultDark?:  boolean
}

export function ThemeProvider({
  children,
  defaultTheme = "theme-clubspark-admin",
  defaultDark  = false,
}: ThemeProviderProps) {
  const [theme,  setThemeState]  = React.useState<Theme>(defaultTheme)
  const [isDark, setIsDarkState] = React.useState(defaultDark)

  React.useEffect(() => {
    const html = document.documentElement

    html.classList.remove(
      "theme-clubspark-admin",
      "theme-clubspark-public",
      "theme-ecb-admin",
      "theme-ecb-public",
      "theme-club-website",
      "theme-test-public",
      "theme-test-admin-1",
    )

    html.classList.add(theme)
    html.classList.toggle("dark", isDark)
  }, [theme, isDark])

  function setTheme(next: Theme) { setThemeState(next) }
  function setIsDark(dark: boolean) { setIsDarkState(dark) }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

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
  theme:      Theme
  setTheme:   (theme: Theme) => void
  isDark:     boolean
  setIsDark:  (dark: boolean) => void
  logoLight:  string
  logoDark:   string
}

// ─── Logo paths per theme ─────────────────────────────────────────────────────

const logoMap: Record<Theme, { light: string; dark: string }> = {
  "theme-clubspark-admin":  { light: "/logos/clubspark-light.svg", dark: "/logos/clubspark-dark.svg" },
  "theme-clubspark-public": { light: "/logos/clubspark-light.svg", dark: "/logos/clubspark-dark.svg" },
  "theme-ecb-admin":        { light: "/logos/ECB-logo-light.svg",  dark: "/logos/ECB-logo-dark.svg"  },
  "theme-ecb-public":       { light: "/logos/ECB-logo-light.svg",  dark: "/logos/ECB-logo-dark.svg"  },
  "theme-club-website":     { light: "/logos/clubspark-light.svg", dark: "/logos/clubspark-dark.svg" },
  "theme-test-public":      { light: "/logos/ef-logo-light.svg",   dark: "/logos/ef-logo-dark.svg"   },
  "theme-test-admin-1":     { light: "/logos/clubspark-light.svg", dark: "/logos/clubspark-dark.svg" },
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = React.createContext<ThemeContextValue>({
  theme:     "theme-clubspark-admin",
  setTheme:  () => {},
  isDark:    false,
  setIsDark: () => {},
  logoLight: "/logos/clubspark-light.svg",
  logoDark:  "/logos/clubspark-dark.svg",
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

  const logos = logoMap[theme]

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      isDark, setIsDark,
      logoLight: logos.light,
      logoDark:  logos.dark,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

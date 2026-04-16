"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0)
    // Override any autofocus scroll that fires after mount
    const t = setTimeout(() => window.scrollTo(0, 0), 50)
    return () => clearTimeout(t)
  }, [pathname])
  return null
}

export default ScrollToTop

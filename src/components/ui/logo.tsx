"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme-provider"

const sizeMap = {
  sm:    "h-6",
  md:    "h-8",
  lg:    "h-10",
  xl:    "h-12",
  "2xl": "h-16",
}

export interface LogoProps {
  src?:       string
  srcDark?:   string
  alt?:       string
  href?:      string
  newWindow?: boolean
  size?:      keyof typeof sizeMap
  className?: string
  forceDark?: boolean
}

export function Logo({
  src,
  srcDark,
  alt       = "Logo",
  href,
  newWindow = false,
  size      = "md",
  className,
  forceDark = false,
}: LogoProps) {
  const { isDark, logoLight, logoDark } = useTheme()
  const useDark = forceDark || isDark

  // Explicit props override theme logos
  const resolvedSrc = src || srcDark
    ? useDark ? (srcDark ?? src ?? "") : (src ?? "")
    : useDark ? logoDark : logoLight

  const img = (
    <img
      src={resolvedSrc}
      alt={alt}
      className={cn("w-auto", sizeMap[size], className)}
    />
  )

  if (href) {
    return (
      <a
        href={href}
        target={newWindow ? "_blank" : undefined}
        rel={newWindow ? "noopener noreferrer" : undefined}
        className="inline-flex items-center"
      >
        {img}
      </a>
    )
  }

  return img
}

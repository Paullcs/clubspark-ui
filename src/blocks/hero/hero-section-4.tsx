"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroSection4Props {
  className?: string
  heading?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  imageSrc?: string
  imageAlt?: string
  overlayOpacity?: number
}

export function HeroSection4({
  className,
  heading = "The smarter way to manage your club",
  description = "Clubspark gives you everything you need to run bookings, memberships and payments — all in one place.",
  primaryButtonText = "Get started",
  primaryButtonHref = "#",
  imageSrc = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1400&q=80",
  imageAlt = "Tennis court",
  overlayOpacity = 0.4,
}: HeroSection4Props) {
  return (
    <section
      className={cn("relative flex items-center justify-center min-h-[600px] py-24 overflow-hidden", className)}
    >
      {/* Background image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white lg:text-7xl">
          {heading}
        </h1>
        <p className="mt-6 text-lg text-white/80 max-w-xl">
          {description}
        </p>
        <div className="mt-10">
          <Button shape="pill" size="lg" variant="negative" asChild>
            <a href={primaryButtonHref}>
              {primaryButtonText}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

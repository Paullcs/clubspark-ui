"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroSection3Props {
  className?: string
  heading?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryLinkText?: string
  secondaryLinkHref?: string
  imageSrc?: string
  imageAlt?: string
}

export function HeroSection3({
  className,
  heading = "The smarter way to manage your club",
  description = "Clubspark gives you everything you need to run bookings, memberships and payments — all in one place.",
  primaryButtonText = "Get started free",
  primaryButtonHref = "#",
  secondaryLinkText = "Learn more",
  secondaryLinkHref = "#",
  imageSrc = "https://images.unsplash.com/photo-1614395066414-010e6a50adfe?w=1400&q=80",
  imageAlt = "Tennis court",
}: HeroSection3Props) {
  return (
    <section className={cn("py-24", className)}>
      <div className="max-w-[1440px] mx-auto px-8">

        {/* Centred content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
            {heading}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {description}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Button shape="pill" size="lg" asChild>
              <a href={primaryButtonHref}>{primaryButtonText}</a>
            </Button>
            <a
              href={secondaryLinkHref}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {secondaryLinkText}
            </a>
          </div>
        </div>

        {/* Wide image */}
        <div className="relative w-full aspect-[16/7] overflow-hidden rounded-2xl bg-muted">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

      </div>
    </section>
  )
}

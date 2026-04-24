"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroSection1Props {
  className?: string
  heading?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  imageSrc?: string
  imageAlt?: string
}

export function HeroSection1({
  className,
  heading = "The smarter way to manage your club",
  description = "Clubspark gives you everything you need to run bookings, memberships and payments — all in one place.",
  primaryButtonText = "Get started",
  primaryButtonHref = "#",
  secondaryButtonText = "Learn more",
  secondaryButtonHref = "#",
  imageSrc = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
  imageAlt = "Tennis court",
}: HeroSection1Props) {
  return (
    <section className={cn("py-24", className)}>
      <div className="max-w-[1440px] mx-auto px-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[3/2] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted order-last lg:order-first">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start order-first lg:order-last">
          <h1 className="text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
            {heading}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            {description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button shape="pill" size="lg" asChild>
              <a href={primaryButtonHref}>{primaryButtonText}</a>
            </Button>
            <Button shape="pill" size="lg" variant="outline" asChild>
              <a href={secondaryButtonHref}>
                {secondaryButtonText}
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

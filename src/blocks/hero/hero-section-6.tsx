"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroSection6Props {
  className?: string
  heading?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  imageSrc?: string
  imageAlt?: string
}

export function HeroSection6({
  className,
  heading = "The smarter way to manage your club",
  description = "Clubspark gives you everything you need to run bookings, memberships and payments — all in one place.",
  primaryButtonText = "Get started free",
  primaryButtonHref = "#",
  imageSrc = "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80",
  imageAlt = "Tennis court",
}: HeroSection6Props) {
  return (
    <section
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% 85%, var(--background) 0%, transparent 100%),
          radial-gradient(ellipse at top left, color-mix(in srgb, var(--primary) 25%, transparent) 0%, transparent 60%),
          radial-gradient(ellipse at top right, color-mix(in srgb, var(--accent-500, var(--primary)) 20%, transparent) 0%, transparent 60%),
          var(--background)
        `,
        boxShadow: `inset 0 20px 60px -12px color-mix(in srgb, var(--primary) 25%, transparent), inset 0 -20px 60px -12px color-mix(in srgb, var(--accent-500, var(--primary)) 25%, transparent)`,
      }}
    >
      {/* Centred content */}
      <div className="max-w-3xl mx-auto px-8 pt-32 pb-16 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
          {heading}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          {description}
        </p>
        <div className="mt-10">
          <Button shape="pill" size="lg" asChild>
            <a href={primaryButtonHref}>{primaryButtonText}</a>
          </Button>
        </div>
      </div>

      {/* Wide image overlapping the gradient */}
      <div className="max-w-[1440px] mx-auto px-8 pb-16">
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

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroSection5Props {
  className?: string
  heading?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
}

export function HeroSection5({
  className,
  heading = "The smarter way to manage your club",
  description = "Clubspark gives you everything you need to run bookings, memberships and payments — all in one place.",
  primaryButtonText = "Get started free",
  primaryButtonHref = "#",
}: HeroSection5Props) {
  return (
    <section
      className={cn("relative py-32 overflow-hidden", className)}
      style={{
        background: `
          radial-gradient(ellipse 30% 80% at 50% 85%, var(--background) 60%, transparent 100%),
          radial-gradient(ellipse at top left, color-mix(in srgb, var(--primary) 25%, transparent) 0%, transparent 60%),
          radial-gradient(ellipse at top right, color-mix(in srgb, var(--accent-500, var(--primary)) 20%, transparent) 0%, transparent 60%),
          var(--background)
        `,
        boxShadow: `inset 0 20px 60px -12px color-mix(in srgb, var(--primary) 25%, transparent), inset 0 -20px 60px -12px color-mix(in srgb, var(--accent-500, var(--primary)) 25%, transparent)`,
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-8 flex flex-col items-center text-center">
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
    </section>
  )
}

"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { HeroSection1, HeroSection2, HeroSection3, HeroSection4, HeroSection5, HeroSection6 } from "@/blocks/hero"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="mb-6 border-b border-border pb-3 px-8">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default function BlocksHeroPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="hero" />
      <div className="py-10">
        <Section title="Hero Section 1" description="Two column — image left, content right. Image drops below on mobile.">
          <HeroSection1
            heading="The smarter way to manage your club"
            description="Clubspark gives you everything you need to run bookings, memberships and payments — all in one place."
            primaryButtonText="Get started"
            primaryButtonHref="#"
            secondaryButtonText="Learn more"
            secondaryButtonHref="#"
            imageSrc="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80"
            imageAlt="Tennis court"
          />
        </Section>
        <Section title="Hero Section 2" description="Two column — content left, image right. Image drops below on mobile.">
          <HeroSection2
            heading="The smarter way to manage your club"
            description="Clubspark gives you everything you need to run bookings, memberships and payments — all in one place."
            primaryButtonText="Get started"
            primaryButtonHref="#"
            secondaryButtonText="Learn more"
            secondaryButtonHref="#"
            imageSrc="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80"
            imageAlt="Tennis player"
          />
        </Section>
        <Section title="Hero Section 3" description="Centred content with primary button, secondary text link and wide image below.">
          <HeroSection3
            heading="The smarter way to manage your club"
            description="Clubspark gives you everything you need to run bookings, memberships and payments — all in one place."
            primaryButtonText="Get started free"
            primaryButtonHref="#"
            secondaryLinkText="Learn more"
            secondaryLinkHref="#"
            imageSrc="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80"
            imageAlt="Tennis court wide"
          />
        </Section>
        <Section title="Hero Section 4" description="Full background image with adjustable overlay. Min height 600px, grows with content.">
          <HeroSection4
            heading="The smarter way to manage your club"
            description="Clubspark gives you everything you need to run bookings, memberships and payments — all in one place."
            primaryButtonText="Get started"
            primaryButtonHref="#"
            imageSrc="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1400&q=80"
            imageAlt="Tennis court"
            overlayOpacity={0.4}
          />
        </Section>
        <Section title="Hero Section 5" description="Centred content with theme-aware gradient background and oval glow.">
          <HeroSection5
            heading="The smarter way to manage your club"
            description="Clubspark gives you everything you need to run bookings, memberships and payments — all in one place."
            primaryButtonText="Get started free"
            primaryButtonHref="#"
          />
        </Section>
        <Section title="Hero Section 6" description="Gradient background with centred content and wide image below overlapping the gradient.">
          <HeroSection6
            heading="The smarter way to manage your club"
            description="Clubspark gives you everything you need to run bookings, memberships and payments — all in one place."
            primaryButtonText="Get started free"
            primaryButtonHref="#"
            imageSrc="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80"
            imageAlt="Tennis court"
          />
        </Section>
      </div>
    </div>
  )
}

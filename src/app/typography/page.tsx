"use client"

import { useEffect, useState } from "react"
import { PreviewBar } from "@/components/ui/preview-bar"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-lg text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function TypeRow({ label, className, style, children }: { label: React.ReactNode; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-6 py-3 border-b border-border last:border-0">
      <span className="text-xs font-mono text-muted-foreground w-48 shrink-0">{label}</span>
      <span className={className} style={style}>{children}</span>
    </div>
  )
}

function useCssVar(variable: string) {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  const [value, setValue] = useState(() => typeof window !== 'undefined' ? read() : '')
  useEffect(() => {
    setValue(read())
    const observer = new MutationObserver(() => setValue(read()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [variable])
  return value
}

export default function TypographyPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const fontBody    = useCssVar('--font-body')
  const fontHeading = useCssVar('--font-heading')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="typography" />
      <div className="max-w-5xl mx-auto px-8 py-10">

        <Section title="Font family" description="Font families are set per theme via --font-body and --font-heading tokens. Switch theme in the preview bar to see them update.">
          <div className="flex gap-8 mb-6 p-4 rounded-lg bg-muted/40 border border-border">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-0.5">--font-body</p>
              <p className="text-base font-medium text-foreground">{fontBody || '—'}</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-0.5">--font-heading</p>
              <p className="text-base font-medium text-foreground">{fontHeading || '—'}</p>
            </div>
          </div>
          <TypeRow label="--font-body" style={{ fontFamily: 'var(--font-body)' }}>The quick brown fox jumps over the lazy dog</TypeRow>
          <TypeRow label="--font-heading" style={{ fontFamily: 'var(--font-heading)' }}>The quick brown fox jumps over the lazy dog</TypeRow>
        </Section>

        <Section title="Heading convention" description="Headings get font-weight: 600 and line-height: 1.25 from @layer components automatically. The size varies by page and context. The semantic element (h1–h6) is chosen for document structure and screen readers — never to imply a visual size.">
          <div className="rounded-lg border border-border bg-muted/40 p-6 mb-6 space-y-3">
            <p className="text-sm font-medium text-foreground">The rule</p>
            <p className="text-sm text-muted-foreground leading-relaxed">Headings are always semibold with tight leading — this comes from the base layer automatically. The size is chosen based on the page hierarchy, not the element. A page title on a dense admin page might be <span className="font-mono bg-muted px-1 rounded text-xs">text-xl</span> while the same title on a landing page might be <span className="font-mono bg-muted px-1 rounded text-xs">text-3xl</span>. The semantic element (<span className="font-mono bg-muted px-1 rounded text-xs">h1</span>, <span className="font-mono bg-muted px-1 rounded text-xs">h2</span> etc) is chosen for document structure and screen readers — never to imply a visual size.</p>
          </div>
          <div className="space-y-0">
            {[
              { size: "4xl" as const, as: "h1" as const, label: "Display — marketing hero" },
              { size: "3xl" as const, as: "h1" as const, label: "Page title — wide layout" },
              { size: "2xl" as const, as: "h1" as const, label: "Page title — admin panel" },
              { size: "xl"  as const, as: "h2" as const, label: "Section heading — top level" },
              { size: "lg"  as const, as: "h2" as const, label: "Section heading — compact" },
              { size: "base" as const, as: "h3" as const, label: "Card title / sub-section" },
              { size: "sm"  as const, as: "h4" as const, label: "Label heading / group title" },
            ].map(({ size, as: Tag, label }) => (
              <div key={size} className="flex items-baseline gap-6 py-3 border-b border-border last:border-0">
                <span className="text-xs font-mono text-muted-foreground w-56 shrink-0">
                  {`<${Tag} class="text-${size}">`}<br />
                  <span className="text-muted-foreground/60">{label}</span>
                </span>
                <Tag className={`text-${size} text-foreground`}>Bookings</Tag>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Size scale" description="Raw size utilities — weight and line-height for headings come from the base layer automatically.">
          <TypeRow label="text-9xl · 8rem · 128px" className="text-9xl">Hero</TypeRow>
          <TypeRow label="text-8xl · 6rem · 96px" className="text-8xl">Hero</TypeRow>
          <TypeRow label="text-7xl · 4.5rem · 72px" className="text-7xl">Display</TypeRow>
          <TypeRow label="text-6xl · 3.75rem · 60px" className="text-6xl">Display</TypeRow>
          <TypeRow label="text-5xl · 3rem · 48px" className="text-5xl">Display heading</TypeRow>
          <TypeRow label="text-4xl · 2.25rem · 36px" className="text-4xl">Display heading</TypeRow>
          <TypeRow label="text-3xl · 1.875rem · 30px" className="text-3xl">Hero heading · Large stat value</TypeRow>
          <TypeRow label="text-2xl · 1.5rem · 24px" className="text-2xl">Page title · Dashboard heading</TypeRow>
          <TypeRow label="text-xl · 1.25rem · 20px" className="text-xl">Page sub-title · Modal heading</TypeRow>
          <TypeRow label="text-lg · 1.125rem · 18px" className="text-lg">Section heading · Card title</TypeRow>
          <TypeRow label="text-base · 1rem · 16px" className="text-base">Default body · Longer-form copy</TypeRow>
          <TypeRow label="text-sm · 0.875rem · 14px" className="text-sm">Body text · Form labels · Card content</TypeRow>
          <TypeRow label="text-xs · 0.75rem · 12px" className="text-xs">Table header · Caption · Helper text</TypeRow>
          <TypeRow label="text-2xs · 0.6875rem · 11px" className="text-2xs">Supplementary label or micro caption</TypeRow>
          <TypeRow label="text-3xs · 0.625rem · 10px" className="text-3xs font-medium tracking-wide uppercase">Booking reference · BK-3E83</TypeRow>
        </Section>

        <Section title="Font weight" description="Weights used across the system.">
          <TypeRow label="font-normal · 400" className="text-base font-normal">The quick brown fox jumps over the lazy dog</TypeRow>
          <TypeRow label="font-medium · 500" className="text-base font-medium">The quick brown fox jumps over the lazy dog</TypeRow>
          <TypeRow label="font-semibold · 600" className="text-base font-semibold">The quick brown fox jumps over the lazy dog</TypeRow>
          <TypeRow label="font-bold · 700" className="text-base font-bold">The quick brown fox jumps over the lazy dog</TypeRow>
        </Section>

        <Section title="Line height" description="Leading utilities for different contexts.">
          <div className="space-y-6 max-w-lg">
            <div className="space-y-1">
              <p className="text-xs font-mono text-muted-foreground">leading-tight</p>
              <p className="text-base leading-tight">Court bookings are managed through the admin portal. Members can view availability and make reservations online.</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-mono text-muted-foreground">leading-normal</p>
              <p className="text-base leading-normal">Court bookings are managed through the admin portal. Members can view availability and make reservations online.</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-mono text-muted-foreground">leading-relaxed</p>
              <p className="text-base leading-relaxed">Court bookings are managed through the admin portal. Members can view availability and make reservations online.</p>
            </div>
          </div>
        </Section>

        <Section title="Monospace" description="Used for references, codes and technical values.">
          <TypeRow label="font-mono · text-xs" className="text-xs font-mono">BK-3E83 · MBR-00124 · #FF5733</TypeRow>
          <TypeRow label="font-mono · text-sm" className="text-sm font-mono">--primary: hsl(227 100% 34%)</TypeRow>
          <TypeRow label="font-mono · text-base" className="text-base font-mono">£1,240.00 · 13:00–14:00</TypeRow>
        </Section>

        <Section title="In-product examples" description="How size and leading combine in real UI patterns. Weight and line-height come from the base layer automatically.">
          <div className="space-y-8 max-w-lg">

            <div className="space-y-0.5">
              <p className="text-xs font-mono text-muted-foreground mb-3">Page title + subtitle</p>
              <h1 className="text-2xl text-foreground">Bookings</h1>
              <p className="text-sm text-muted-foreground">Manage court reservations across all venues</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-mono text-muted-foreground mb-3">Section heading</p>
              <h2 className="text-lg text-foreground">Recent activity</h2>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-mono text-muted-foreground mb-3">Card title + description</p>
              <h3 className="text-base text-foreground">Court 1 — Full Court</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Available 06:00–22:00 · Hard surface · Max 4 players</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-mono text-muted-foreground mb-3">Body copy</p>
              <p className="text-sm text-foreground leading-relaxed">Recurring bookings use iCal RRULE format — set a frequency, count or end date and the system handles the rest automatically. Members receive a confirmation email for each occurrence.</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-mono text-muted-foreground mb-3">Stat value</p>
              <h2 className="text-3xl text-foreground">£6,200</h2>
              <p className="text-sm text-muted-foreground">Revenue this month</p>
            </div>

          </div>
        </Section>

      </div>
    </div>
  )
}

"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { PricingTable } from "@/blocks/pricing"

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

export default function BlocksPricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="pricing" />
      <div className="py-10">
        <Section title="Pricing Table 1" description="Three tier pricing with monthly/yearly toggle and popular badge.">
          <PricingTable />
        </Section>
      </div>
    </div>
  )
}

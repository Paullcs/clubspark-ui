"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { Sidebar1 } from "@/components/ui/sidebar-1"
import { Sidebar2 } from "@/components/ui/sidebar-2"
import { TopBar } from "@/components/ui/top-bar"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default function NavigationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="navigation" />
      <div className="max-w-5xl mx-auto px-8 py-10">

        <Section title="Sidebar — Text" description="Grouped nav with collapsible sub-sections, badges and user footer. Dark neutral shell, brand colour on active state only.">
          <div className="h-[600px] rounded-lg overflow-hidden border border-border flex">
            <Sidebar1 />
          </div>
        </Section>

        <Section title="Sidebar — Icon rail" description="Collapsed icon rail with slide-in secondary panel and tooltips on hover.">
          <div className="h-[600px] rounded-lg overflow-hidden border border-border flex flex-col">
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar2 />
              <div className="flex-1 bg-background" />
            </div>
          </div>
        </Section>

      </div>
    </div>
  )
}

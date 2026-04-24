"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { FooterPublic1 } from "@/blocks/footer"

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

export default function BlocksFooterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="footer" />
      <div className="py-10">
        <Section title="Footer Public 1" description="Full width public footer with logo, nav columns, social icons and bottom bar.">
          <FooterPublic1
            brandName="Clubspark"
            tagline="The smarter way to manage your club."
            menuItems={[
              {
                title: "Product",
                links: [
                  { text: "Overview",     url: "#" },
                  { text: "Pricing",      url: "#" },
                  { text: "Features",     url: "#" },
                  { text: "Integrations", url: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { text: "About",   url: "#" },
                  { text: "Team",    url: "#" },
                  { text: "Blog",    url: "#" },
                  { text: "Careers", url: "#" },
                  { text: "Contact", url: "#" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { text: "Help",      url: "#" },
                  { text: "Sales",     url: "#" },
                  { text: "Advertise", url: "#" },
                ],
              },
            ]}
            socialLinks={[
              { platform: "x",         url: "#" },
              { platform: "instagram", url: "#" },
              { platform: "linkedin",  url: "#" },
              { platform: "facebook",  url: "#" },
            ]}
            copyright="© 2024 Clubspark. All rights reserved."
            bottomLinks={[
              { text: "Terms and Conditions", url: "#" },
              { text: "Privacy Policy",       url: "#" },
            ]}
          />
        </Section>
      </div>
    </div>
  )
}

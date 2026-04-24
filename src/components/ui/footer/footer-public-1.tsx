"use client"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

interface MenuItem {
  title: string
  links: { text: string; url: string }[]
}

export interface FooterPublic1Props {
  logo?: string
  brandName?: string
  tagline?: string
  menuItems?: MenuItem[]
  copyright?: string
  bottomLinks?: { text: string; url: string }[]
  className?: string
}

const defaultMenuItems: MenuItem[] = [
  {
    title: "Product",
    links: [
      { text: "Overview", url: "#" },
      { text: "Pricing", url: "#" },
      { text: "Features", url: "#" },
      { text: "Integrations", url: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About", url: "#" },
      { text: "Team", url: "#" },
      { text: "Blog", url: "#" },
      { text: "Careers", url: "#" },
      { text: "Contact", url: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { text: "Help", url: "#" },
      { text: "Sales", url: "#" },
      { text: "Advertise", url: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { text: "Twitter", url: "#" },
      { text: "Instagram", url: "#" },
      { text: "LinkedIn", url: "#" },
    ],
  },
]

export function FooterPublic1({
  logo = "/logos/clubspark-light.svg",
  brandName = "Clubspark",
  tagline = "Components made easy.",
  menuItems = defaultMenuItems,
  copyright = "© 2024 Clubspark. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
  className,
}: FooterPublic1Props) {
  return (
    <section className={cn("py-16 bg-background border-t border-border", className)}>
      <div className="max-w-[1440px] mx-auto px-8">
        <footer className="footer">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2">
                <Logo size="xl" alt={brandName} />
              </div>
              <p className="mt-4 font-medium text-muted-foreground">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-foreground">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium">
                      <a href={link.url} className="footer-link">{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-border pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a href={link.url} className="footer-link">{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  )
}

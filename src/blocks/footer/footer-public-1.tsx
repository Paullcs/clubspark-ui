"use client"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { XIcon, InstagramIcon, LinkedInIcon, FacebookIcon, YouTubeIcon, GitHubIcon, TikTokIcon } from "@/lib/social-icons"

interface MenuItem {
  title: string
  links: { text: string; url: string }[]
}

interface SocialLink {
  platform: "x" | "instagram" | "linkedin" | "youtube" | "facebook" | "github" | "tiktok"
  url: string
}

export interface FooterPublic1Props {
  brandName?: string
  tagline?: string
  menuItems?: MenuItem[]
  socialLinks?: SocialLink[]
  copyright?: string
  bottomLinks?: { text: string; url: string }[]
  className?: string
}

const socialIcons: Record<SocialLink["platform"], React.ElementType> = {
  x:         XIcon,
  instagram: InstagramIcon,
  linkedin:  LinkedInIcon,
  youtube:   YouTubeIcon,
  facebook:  FacebookIcon,
  github:    GitHubIcon,
  tiktok:    TikTokIcon,
}

const defaultMenuItems: MenuItem[] = [
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
]

const defaultSocialLinks: SocialLink[] = [
  { platform: "x",         url: "#" },
  { platform: "instagram", url: "#" },
  { platform: "linkedin",  url: "#" },
]

export function FooterPublic1({
  brandName    = "Clubspark",
  tagline      = "Components made easy.",
  menuItems    = defaultMenuItems,
  socialLinks  = defaultSocialLinks,
  copyright    = "© 2024 Clubspark. All rights reserved.",
  bottomLinks  = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy",       url: "#" },
  ],
  className,
}: FooterPublic1Props) {
  return (
    <section className={cn("py-16 bg-background border-t border-border", className)}>
      <div className="max-w-[1440px] mx-auto px-8">
        <footer className="footer">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">

            {/* Brand */}
            <div className="col-span-2 mb-8 lg:mb-0">
              <Logo size="xl" alt={brandName} />
              <p className="mt-4 font-medium text-muted-foreground">{tagline}</p>
            </div>

            {/* Nav columns */}
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

            {/* Social column */}
            {socialLinks.length > 0 && (
              <div>
                <h3 className="mb-4 font-bold text-foreground">Social</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, i) => {
                    const Icon = socialIcons[social.platform]
                    return (
                      <a key={i} href={social.url} className="footer-link" aria-label={social.platform}>
                        <Icon size={20} />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Bottom bar */}
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

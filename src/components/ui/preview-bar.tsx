"use client"

import * as React from "react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme, type Theme } from "@/lib/theme-provider"
import { MonitorIcon, GlobeIcon, ChevronDownIcon } from "lucide-react"

const themes: { value: Theme; label: string; icon: "monitor" | "globe" }[] = [
  { value: "theme-clubspark-admin",  label: "Clubspark Admin",  icon: "monitor" },
  { value: "theme-clubspark-public", label: "Clubspark Public", icon: "globe"   },
  { value: "theme-ecb-admin",        label: "ECB Admin",        icon: "monitor" },
  { value: "theme-ecb-public",       label: "ECB Public",       icon: "globe"   },
  { value: "theme-test-public",      label: "Test Public",      icon: "globe"   },
  { value: "theme-test-admin-1",     label: "Test Admin 1",     icon: "monitor" },
]

const kitPages = [
  { href: "/components", label: "Components" },
  { href: "/forms",      label: "Forms"       },
  { href: "/tables",     label: "Tables"      },
  { href: "/charts",     label: "Charts"      },
  { href: "/navigation", label: "Navigation"  },
  { href: "/typography", label: "Typography"  },
]

const blockPages = [
  { href: "/blocks/hero",    label: "Hero"    },
  { href: "/blocks/pricing", label: "Pricing" },
  { href: "/blocks/footer",  label: "Footer"  },
  { href: "/blocks/faq", label: "FAQ" },
]

const kitPageIds = ["components", "forms", "tables", "charts", "navigation", "typography"]
const blockPageIds = ["hero", "pricing", "footer", "faq"]

const navLink   = "px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
const navActive = "px-3 py-1.5 text-sm font-medium rounded-md bg-accent text-accent-foreground"

type PreviewBarProps = {
  activePage: "components" | "forms" | "tables" | "charts" | "navigation" | "demos" | "typography" | "public" | "hero" | "pricing" | "footer" | "faq"
}

export function PreviewBar({ activePage }: PreviewBarProps) {
  const { theme, setTheme, isDark, setIsDark } = useTheme()
  const isKitPage   = kitPageIds.includes(activePage)
  const isBlockPage = blockPageIds.includes(activePage)
  const activeKitLabel   = kitPages.find(p => p.href === `/${activePage}`)?.label
  const activeBlockLabel = blockPages.find(p => p.href === `/blocks/${activePage}`)?.label

  return (
    <div className="border-b border-border bg-card px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Clubspark UI</h1>
        <p className="text-sm text-muted-foreground">Component library preview</p>
      </div>
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className={isKitPage ? navActive : navLink}>
              <span className="flex items-center gap-1.5">
                {isKitPage ? activeKitLabel : "Kit"}
                <ChevronDownIcon className="size-3.5" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {kitPages.map((p) => (
                <DropdownMenuItem key={p.href} asChild>
                  <Link href={p.href} className={activePage === p.href.slice(1) ? "font-medium text-foreground" : ""}>
                    {p.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className={isBlockPage ? navActive : navLink}>
              <span className="flex items-center gap-1.5">
                {isBlockPage ? activeBlockLabel : "Blocks"}
                <ChevronDownIcon className="size-3.5" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {blockPages.map((p) => (
                <DropdownMenuItem key={p.href} asChild>
                  <Link href={p.href} className={activePage === p.href.split("/").pop() ? "font-medium text-foreground" : ""}>
                    {p.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/demos/admin" scroll={true} className={activePage === "demos" ? navActive : navLink}>Demos</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
            <SelectTrigger size="sm" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <div className="flex items-center gap-2">
                    {t.icon === "monitor" ? <MonitorIcon className="size-3.5" /> : <GlobeIcon className="size-3.5" />}
                    {t.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Label htmlFor="preview-dark" className="text-sm">Dark</Label>
            <Switch id="preview-dark" checked={isDark} onCheckedChange={(checked) => setIsDark(checked)} />
          </div>
        </div>
      </div>
    </div>
  )
}

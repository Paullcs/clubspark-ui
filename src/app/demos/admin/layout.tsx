"use client"

import * as React from "react"
import { Sidebar1 } from "@/components/ui/sidebar-1"
import { useTheme, type Theme } from "@/lib/theme-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MonitorIcon, GlobeIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import Link from "next/link"

const themes: { value: Theme; label: string; icon: "monitor" | "globe" }[] = [
  { value: "theme-clubspark-admin",  label: "Clubspark Admin",  icon: "monitor" },
  { value: "theme-clubspark-public", label: "Clubspark Public", icon: "globe"   },
  { value: "theme-ecb-admin",        label: "ECB Admin",        icon: "monitor" },
  { value: "theme-ecb-public",       label: "ECB Public",       icon: "globe"   },
  { value: "theme-test-public",      label: "Test Public",      icon: "globe"   },
  { value: "theme-test-admin-1",     label: "Test Admin 1",     icon: "monitor" },
]

function DevBar() {
  const { theme, setTheme, isDark, setIsDark } = useTheme()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="shrink-0 bg-neutral-900 border-b border-neutral-700 text-neutral-100">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="w-full flex items-center justify-center gap-2 py-1 text-xs text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <ChevronDownIcon className="size-3" />
          <span>Dev tools</span>
        </button>
      ) : (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Dev</span>
            <Link href="/components" className="text-xs text-neutral-400 hover:text-neutral-100 transition-colors">
              ← Component library
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger size="sm" className="w-48 bg-neutral-800 border-neutral-700 text-neutral-100 h-7 text-xs">
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
              <Label htmlFor="demo-dark" className="text-xs text-neutral-400">Dark</Label>
              <Switch id="demo-dark" checked={isDark} onCheckedChange={setIsDark} />
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-neutral-500 hover:text-neutral-100 transition-colors"
            >
              <ChevronUpIcon className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DevBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar1 />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon, CalendarIcon, UsersIcon, ClubIcon,
  BarChart2Icon, SettingsIcon, HelpCircleIcon, BuildingIcon,
  FileTextIcon, ShieldIcon, ChevronLeftIcon,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type IconNavItem = {
  label:     string
  icon:      React.ElementType
  children?: { label: string }[]
}

// ─── Default config ───────────────────────────────────────────────────────────

const defaultItems: IconNavItem[] = [
  { label: "Dashboard",  icon: LayoutDashboardIcon },
  { label: "Bookings",   icon: CalendarIcon, children: [
    { label: "All bookings"      },
    { label: "Recurring"         },
    { label: "Awaiting approval" },
  ]},
  { label: "Members",    icon: UsersIcon, children: [
    { label: "All members"  },
    { label: "Memberships"  },
    { label: "Renewals"     },
  ]},
  { label: "Courts",     icon: ClubIcon },
  { label: "Reports",    icon: BarChart2Icon },
  { label: "Venues",     icon: BuildingIcon },
  { label: "Staff",      icon: ShieldIcon },
  { label: "Documents",  icon: FileTextIcon },
  { label: "Settings",   icon: SettingsIcon },
  { label: "Help",       icon: HelpCircleIcon },
]

// ─── Sidebar 2 ────────────────────────────────────────────────────────────────

// No logo prop — the logo belongs in the TopBar that sits above this rail.
// See Sidebar 1 if you need a self-contained sidebar with a logo.

type Sidebar2Props = {
  items?:     IconNavItem[]
  className?: string
}

export function Sidebar2({
  items     = defaultItems,
  className,
}: Sidebar2Props) {
  const [activeItem,  setActiveItem]  = React.useState<string>("Dashboard")
  const [activePanel, setActivePanel] = React.useState<string | null>(null)
  const [tooltip,     setTooltip]     = React.useState<string | null>(null)

  const panelItem = items.find(i => i.label === activePanel)

  function handleClick(item: IconNavItem) {
    setActiveItem(item.label)
    if (item.children?.length) {
      setActivePanel(p => p === item.label ? null : item.label)
    } else {
      setActivePanel(null)
    }
  }

  return (
    <div className={cn("flex h-full", className)}>

      {/* Icon rail */}
      <div className="flex flex-col w-18 bg-neutral-900 border-r border-neutral-800 shrink-0">

        {/* Nav icons */}
        <div className="flex-1 flex flex-col items-center py-3 gap-2 overflow-y-auto">
          {items.map(item => {
            const isActive = activeItem === item.label
            return (
              <div key={item.label} className="relative w-full flex justify-center">
                <button
                  onClick={() => handleClick(item)}
                  onMouseEnter={() => setTooltip(item.label)}
                  onMouseLeave={() => setTooltip(null)}
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100",
                  )}
                >
                  <item.icon className="size-5" />
                </button>

                {/* Tooltip */}
                {tooltip === item.label && activePanel !== item.label && (
                  <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-foreground text-background text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-md">
                      {item.label}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>

      {/* Secondary panel — light background */}
      <div
        className={cn(
          "flex flex-col bg-background border-r border-border overflow-hidden transition-all duration-250 ease-in-out",
          activePanel && panelItem?.children ? "w-52 opacity-100" : "w-0 opacity-0"
        )}
      >
        {panelItem?.children && (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                {panelItem.icon && <panelItem.icon className="size-4 text-muted-foreground" />}
                <span className="text-sm font-semibold text-foreground">{panelItem.label}</span>
              </div>
              <button
                onClick={() => setActivePanel(null)}
                className="size-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ChevronLeftIcon className="size-3.5" />
              </button>
            </div>

            {/* Panel items */}
            <div className="flex-1 py-3 px-4 space-y-0.5 overflow-y-auto">
              {panelItem.children.map(child => (
                <button
                  key={child.label}
                  className="w-full flex items-center px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                >
                  {child.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

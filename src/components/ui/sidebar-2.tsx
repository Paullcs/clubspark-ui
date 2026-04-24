"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon, CalendarIcon, UsersIcon, ClubIcon,
  BarChart2Icon, SettingsIcon, HelpCircleIcon, BuildingIcon,
  FileTextIcon, ShieldIcon, ChevronLeftIcon,
} from "lucide-react"

type IconNavItem = {
  label:     string
  icon:      React.ElementType
  children?: { label: string }[]
}

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

type TooltipState = { label: string; x: number; y: number } | null

type Sidebar2Props = {
  items?:       IconNavItem[]
  className?:   string
  tooltipSize?: "sm" | "default" | "lg"
}

export function Sidebar2({
  items       = defaultItems,
  className,
  tooltipSize = "lg",
}: Sidebar2Props) {
  const [activeItem,  setActiveItem]  = React.useState<string>("Dashboard")
  const [activePanel, setActivePanel] = React.useState<string | null>(null)
  const [tooltip,     setTooltip]     = React.useState<TooltipState>(null)
  const [mounted,     setMounted]     = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const tooltipClass = {
    sm:      "text-xs px-2 py-1",
    default: "text-xs px-2.5 py-1.5",
    lg:      "text-sm px-3 py-2",
  }[tooltipSize]

  const panelItem = items.find(i => i.label === activePanel)

  function handleClick(item: IconNavItem) {
    setActiveItem(item.label)
    if (item.children?.length) {
      setActivePanel(p => p === item.label ? null : item.label)
    } else {
      setActivePanel(null)
    }
  }

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>, label: string) {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ label, x: rect.right + 24, y: rect.top + rect.height / 2 })
  }

  return (
    <div className={cn("flex h-full", className)}>

      {/* Icon rail */}
      <div className="flex flex-col w-18 bg-neutral-900 border-r border-neutral-800 shrink-0">
        <div className="flex-1 flex flex-col items-center py-3 gap-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map(item => {
            const isActive = activeItem === item.label
            return (
              <div key={item.label} className="relative w-full flex justify-center">
                <button
                  onClick={() => handleClick(item)}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label)}
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
              </div>
            )
          })}
        </div>
      </div>

      {/* Tooltip portal */}
      {mounted && tooltip && activePanel !== tooltip.label && ReactDOM.createPortal(
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateY(-50%)" }}
        >
          <div className={cn("bg-foreground text-background font-medium rounded-md whitespace-nowrap shadow-md", tooltipClass)}>
            {tooltip.label}
          </div>
        </div>,
        document.body
      )}

      {/* Secondary panel */}
      <div
        className={cn(
          "flex flex-col bg-background border-r border-border overflow-hidden transition-all duration-250 ease-in-out",
          activePanel && panelItem?.children ? "w-52 opacity-100" : "w-0 opacity-0"
        )}
      >
        {panelItem?.children && (
          <>
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

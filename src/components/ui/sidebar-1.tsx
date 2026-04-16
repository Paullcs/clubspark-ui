"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboardIcon, CalendarIcon, UsersIcon, ClubIcon,
  BarChart2Icon, BuildingIcon, CreditCardIcon, FileTextIcon,
  BellIcon, ShieldIcon, ChevronRightIcon, ArrowLeftIcon,
  MoreHorizontalIcon,
} from "lucide-react"

type NavItem = {
  label:     string
  icon:      React.ElementType
  active?:   boolean
  badge?:    number
  children?: { label: string }[]
}

type NavGroup = {
  label?: string
  items:  NavItem[]
}

const defaultNav: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboardIcon, active: true },
      { label: "Bookings",  icon: CalendarIcon, badge: 3, children: [
        { label: "All bookings"       },
        { label: "Recurring"          },
        { label: "Awaiting approval"  },
      ]},
      { label: "Members",   icon: UsersIcon, children: [
        { label: "All members"  },
        { label: "Memberships"  },
        { label: "Renewals"     },
      ]},
      { label: "Courts",    icon: ClubIcon },
      { label: "Reports",   icon: BarChart2Icon },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Venues",     icon: BuildingIcon },
      { label: "Staff",      icon: ShieldIcon   },
      { label: "Financials", icon: CreditCardIcon, children: [
        { label: "Revenue"      },
        { label: "Transactions" },
        { label: "Invoices"     },
      ]},
      { label: "Documents",  icon: FileTextIcon },
    ],
  },
]

type Sidebar1Props = {
  nav?:        NavGroup[]
  brandName?:  string
  logo?:       string   // light/white SVG — shell is always dark so one version is enough
  userName?:   string
  userEmail?:  string
  userAvatar?: string
  className?:  string
}

export function Sidebar1({
  nav        = defaultNav,
  brandName  = "Clubspark",
  logo = "/logos/clubspark-light.svg",
  userName   = "Paul Lyons",
  userEmail  = "paul@clubspark.co.uk",
  userAvatar,
  className,
}: Sidebar1Props) {
  const [panel, setPanel] = React.useState<NavItem | null>(null)
  const [visible, setVisible] = React.useState(false)

  function openPanel(item: NavItem) {
    setPanel(item)
    requestAnimationFrame(() => setVisible(true))
  }

  function closePanel() {
    setVisible(false)
    setTimeout(() => setPanel(null), 220)
  }

  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2)

  return (
    <div className={cn("relative flex flex-col h-full w-64 bg-neutral-900 text-neutral-100 border-r border-neutral-800 overflow-hidden", className)}>

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-neutral-800 shrink-0">
        {logo ? (
          <img src={logo} alt={brandName} className="h-10 w-auto object-contain" />
        ) : (
          <>
            <div className="size-7 rounded-md bg-primary flex items-center justify-center shrink-0">
              <ClubIcon className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">{brandName}</span>
          </>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {nav.map((group, gi) => (
          <div key={gi} className="space-y-0.5">
            {group.label && (
              <p className="px-3 mb-1.5 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            {group.items.map(item => {
              const hasChildren = item.children && item.children.length > 0
              return (
                <button
                  key={item.label}
                  onClick={() => hasChildren ? openPanel(item) : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                    "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800",
                    item.active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && !hasChildren && (
                    <span className="text-xs bg-neutral-700 text-neutral-300 rounded-full px-1.5 py-0.5 leading-none min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <ChevronRightIcon className="size-3.5 shrink-0 opacity-40" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-neutral-800 shrink-0">
        <button className="w-full flex items-center gap-2.5 rounded-md p-1.5 hover:bg-neutral-800 transition-colors group">
          <Avatar size="sm">
            {userAvatar && <AvatarImage src={userAvatar} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-medium text-neutral-200 truncate">{userName}</p>
            <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
          </div>
          <MoreHorizontalIcon className="size-4 shrink-0 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Secondary panel — slides in over the top */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col bg-neutral-900 transition-transform duration-200 ease-in-out",
          visible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel header */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-neutral-800 shrink-0">
          <button
            onClick={closePanel}
            className="size-7 rounded flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          {panel?.icon && <panel.icon className="size-4 text-neutral-400" />}
          <span className="text-sm font-semibold text-neutral-100">{panel?.label}</span>
        </div>

        {/* Panel items — no icons */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {panel?.children?.map(child => (
            <button
              key={child.label}
              className="w-full flex items-center px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors text-left"
            >
              {child.label}
            </button>
          ))}
        </div>

        {/* User at bottom of panel */}
        <div className="px-3 py-3 border-t border-neutral-800 shrink-0">
          <button className="w-full flex items-center gap-2.5 rounded-md p-1.5 hover:bg-neutral-800 transition-colors group">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-neutral-200 truncate">{userName}</p>
              <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  )
}

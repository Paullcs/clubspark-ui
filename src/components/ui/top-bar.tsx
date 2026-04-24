"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { BellIcon, SearchIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"

type TopBarProps = {
  brandName?:  string
  userName?:   string
  userAvatar?: string
  className?:  string
}

export function TopBar({
  brandName  = "Clubspark",
  userName   = "Paul Lyons",
  userAvatar,
  className,
}: TopBarProps) {
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2)

  return (
    <div className={cn(
      "flex items-center justify-between px-5 py-2 h-18 border-b border-border bg-card shrink-0",
      className
    )}>

      {/* Logo */}
      <div className="flex items-center">
        <Logo alt={brandName} size="lg" />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1">

        {/* Search */}
        <button className="size-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <SearchIcon className="size-4" />
        </button>

        {/* Notifications */}
        <button className="relative size-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <BellIcon className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </button>

        {/* User avatar */}
        <div className="ml-1">
          <Avatar size="sm" className="cursor-pointer">
            {userAvatar && <AvatarImage src={userAvatar} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>

      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyStateAction {
  label: string
  onClick?: () => void
  href?: string
  variant?: "default" | "outline" | "ghost" | "link"
  icon?: React.ElementType
}

export interface EmptyStateProps {
  icon?: React.ElementType
  iconStyle?: "none" | "bare" | "contained"
  iconSize?: "sm" | "default" | "lg" | "xl"
  heading: string
  description?: string
  actions?: EmptyStateAction[]
  className?: string
  size?: "sm" | "default" | "lg"
}

const iconSizeMap = {
  sm:      "size-4",
  default: "size-6",
  lg:      "size-10",
  xl:      "size-14",
}

const sizeConfig = {
  sm:      { icon: "size-5",  container: "size-10", heading: "text-sm font-semibold",  description: "text-xs",  padding: "py-8"  },
  default: { icon: "size-6",  container: "size-12", heading: "text-base font-semibold", description: "text-sm", padding: "py-12" },
  lg:      { icon: "size-8",  container: "size-16", heading: "text-lg font-semibold",  description: "text-base", padding: "py-16" },
}

export function EmptyState({
  icon: Icon,
  iconStyle = "contained",
  iconSize,
  heading,
  description,
  actions,
  className,
  size = "default",
}: EmptyStateProps) {
  const s = sizeConfig[size]
  const resolvedIconSize = iconSize
    ? iconSizeMap[iconSize]
    : iconStyle === "bare"
      ? iconSizeMap["lg"]
      : s.icon

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", s.padding, className)}>
      {Icon && (
        <div className="mb-4">
          {iconStyle === "contained" ? (
            <div className={cn("flex items-center justify-center rounded-[var(--radius)] bg-muted", s.container)}>
              <Icon className={cn(resolvedIconSize, "text-foreground")} />
            </div>
          ) : (
            <Icon className={cn(resolvedIconSize, "text-muted-foreground/50")} />
          )}
        </div>
      )}
      <h3 className={cn(s.heading, "text-foreground")}>{heading}</h3>
      {description && (
        <p className={cn(s.description, "mt-1.5 text-muted-foreground max-w-xs")}>{description}</p>
      )}
      {actions && actions.length > 0 && (
        <div className={cn("mt-6 flex flex-col gap-2 w-full max-w-[200px]")}>
          {actions.map((action, i) => {
            const ActionIcon = action.icon
            const buttonProps = action.href
              ? { asChild: true }
              : { onClick: action.onClick }
            return (
              <Button
                key={i}
                variant={action.variant ?? (i === 0 ? "default" : "outline")}
                size="default"
                className="w-full"
                {...buttonProps}
              >
                {action.href ? (
                  <a href={action.href} className="flex items-center gap-2">
                    {ActionIcon && <ActionIcon className="size-4" />}
                    {action.label}
                  </a>
                ) : (
                  <>
                    {ActionIcon && <ActionIcon className="size-4" />}
                    {action.label}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

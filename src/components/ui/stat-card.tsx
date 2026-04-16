"use client"

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
//
// A reusable stat card component with trend indicator.
//
// Usage:
//   <StatCard
//     title="Total Revenue"
//     value="£4,280.00"
//     description="Trending up this month"
//     trend={{ value: "+12.5%", direction: "up" }}
//   />
//
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatCardTrend = {
  value: string       // e.g. "+12.5%" or "+3" or "-2.1%"
  direction: "up" | "down" | "neutral"
}

export type StatCardProps = {
  title: string
  value: string
  description?: string
  trend?: StatCardTrend
  className?: string
}

// ─── TrendBadge ───────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: StatCardTrend }) {
  const isUp      = trend.direction === "up"
  const isDown    = trend.direction === "down"
  const isNeutral = trend.direction === "neutral"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isUp      && "bg-success-subtle text-success-text",
        isDown    && "bg-destructive-subtle text-destructive-text",
        isNeutral && "bg-muted text-muted-foreground",
      )}
    >
      {isUp   && <TrendingUpIcon   className="size-3 shrink-0" />}
      {isDown && <TrendingDownIcon className="size-3 shrink-0" />}
      {trend.value}
    </span>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({
  title,
  value,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="pt-5 pb-5 px-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-sm text-muted-foreground leading-snug">
            {title}
          </span>
          {trend && <TrendBadge trend={trend} />}
        </div>

        {/* Value */}
        <p className="text-3xl font-bold text-foreground tracking-tight mb-1.5">
          {value}
        </p>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

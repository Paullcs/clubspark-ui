"use client"

// ─────────────────────────────────────────────────────────────────────────────
// StickyTableHeader
//
// Wrap a DataTableFixed (without maxHeight) to make its header stick to the
// top of the page as you scroll, for as long as the table is in view.
//
// How it works:
//   - DataTableFixed WITHOUT maxHeight lets the page scroll naturally
//   - sticky top-0 on <th> elements sticks to the viewport as you scroll
//   - StickyTableHeader adds a topOffset for when you have a fixed nav bar
//
// Usage — no fixed nav:
//
//   <StickyTableHeader>
//     <DataTableFixed data={...} columns={...} stickyHeader />
//   </StickyTableHeader>
//
// Usage — with a 64px fixed nav bar:
//
//   <StickyTableHeader topOffset="64px">
//     <DataTableFixed data={...} columns={...} stickyHeader />
//   </StickyTableHeader>
//
// Important: do NOT pass maxHeight to DataTableFixed when using this wrapper.
// maxHeight creates an internal scroll container which prevents page-level sticky.
//
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { cn } from "@/lib/utils"

type StickyTableHeaderProps = {
  children: React.ReactNode
  // Distance from top of viewport to pin the header.
  // Match this to your nav bar height. Default is 0px (no nav bar).
  topOffset?: string
  className?: string
}

export function StickyTableHeader({
  children,
  topOffset = "0px",
  className,
}: StickyTableHeaderProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ "--sticky-top": topOffset } as React.CSSProperties}
    >
      {/*
        The CSS variable --sticky-top is picked up by the th elements inside
        DataTableFixed via a Tailwind arbitrary value. If you need a custom
        top offset, pass topOffset="64px" to match your nav height.

        Alternatively, set it globally in your layout:
          <div style={{ "--sticky-top": "64px" }}>
            <DataTableFixed stickyHeader ... />
          </div>
      */}
      {children}
    </div>
  )
}

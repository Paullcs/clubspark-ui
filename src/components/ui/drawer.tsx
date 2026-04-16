"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─── Root ─────────────────────────────────────────────────────────────────────

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────
//
// direction defaults to "right" to match the old Sheet default, but accepts
// all four sides. The drag handle is shown for bottom/top drawers only —
// side drawers use the close button instead.

function DrawerContent({
  className,
  children,
  direction = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  direction?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const isVertical = direction === "top" || direction === "bottom"

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        data-direction={direction}
        className={cn(
          // Base
          "fixed z-50 flex flex-col bg-popover text-sm text-popover-foreground shadow-lg",
          // Vertical (bottom/top)
          direction === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t border-border",
          direction === "top"    && "inset-x-0 top-0 max-h-[85vh] rounded-b-2xl border-b border-border",
          // Horizontal (left/right)
          direction === "right"  && "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border",
          direction === "left"   && "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border",
          className
        )}
        {...props}
      >
        {/* Drag handle — only for bottom/top */}
        {isVertical && (
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/25 shrink-0" />
        )}

        {children}

        {/* Close button — always shown on side drawers, optional on vertical */}
        {showCloseButton && (
          <DrawerPrimitive.Close data-slot="drawer-close" asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 right-3"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerPrimitive.Close>
        )}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

// ─── Layout slots ─────────────────────────────────────────────────────────────

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-0.5 px-6 pt-6 pb-4", className)}
      {...props}
    />
  )
}

// DrawerBody: the scrollable middle zone between header and footer.
// Always wrap your form fields / lists here.
function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("flex-1 overflow-y-auto px-6 flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 px-6 pb-6 pt-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

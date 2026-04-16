"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/50 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

// ─── Size scale ───────────────────────────────────────────────────────────────
// Sizes pull from CSS tokens defined in globals.css so they can be overridden
// per-brand without touching this file:
//   --dialog-sm  --dialog-md  --dialog-lg  --dialog-xl  --dialog-top-offset
//
// Usage: <DialogContent size="lg"> — defaults to "md" if omitted.

type DialogSize = "sm" | "md" | "lg" | "xl"

const dialogSizeTokens: Record<DialogSize, string> = {
  sm: "var(--dialog-sm)",
  md: "var(--dialog-md)",
  lg: "var(--dialog-lg)",
  xl: "var(--dialog-xl)",
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "md",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  size?: DialogSize
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Centred horizontally, anchored to top (not vertically centred)
          // so the modal stays in a predictable position as content grows.
          // On mobile: 1rem from top. On desktop: --dialog-top-offset (50px).
          "fixed top-4 left-1/2 z-50 -translate-x-1/2",
          "w-full max-w-[calc(100%-2rem)]",
          // Surface
          "grid gap-0 rounded-xl bg-popover text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none",
          // Animation
          "duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        style={{
          // Apply token-driven max-width and top offset at sm breakpoint and up.
          // Using CSS custom properties directly so brand overrides in globals.css
          // are respected without needing to touch this component file.
          ["--_dialog-max-w" as string]: dialogSizeTokens[size],
        } as React.CSSProperties}
        {...props}
      >
        {/*
          Inner wrapper applies the responsive top offset and max-width.
          We use a style tag trick: CSS vars set on the element are consumed
          by a style block so we get responsive behaviour without JS breakpoints.
        */}
        <style>{`
          @media (min-width: 640px) {
            [data-slot="dialog-content"] {
              top: var(--dialog-top-offset, 50px);
              max-width: var(--_dialog-max-w);
            }
          }
        `}</style>

        {children}

        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 px-4 pb-4 pt-2 sm:flex-row sm:justify-end sm:px-6 sm:pb-6",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

// text-lg / font-semibold — clearly a heading without competing with
// page-level h1/h2. One clear step above body text (text-base).
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-lg font-semibold leading-snug", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

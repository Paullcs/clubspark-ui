import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-[var(--btn-font-weight)] whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {

        /* ── shadcn defaults ── */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        "secondary-outline":
          "border-secondary text-secondary-foreground bg-transparent hover:bg-secondary/10",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        link:
          "text-primary underline-offset-4 hover:underline",

        /* ── Destructive ── */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        "destructive-outline":
          "border-destructive text-destructive bg-transparent hover:bg-destructive/10",

        /* ── Success ── */
        success:
          "bg-success text-success-foreground hover:bg-success/90",
        "success-outline":
          "border-success text-success-text bg-transparent hover:bg-success-subtle",

        /* ── Active/Live ── */
        active:
          "bg-active text-active-foreground hover:bg-active/90",
        "active-outline":
          "border-active text-active-text bg-transparent hover:bg-active-subtle",

        /* ── Warning ── */
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90",
        "warning-outline":
          "border-warning text-warning-text bg-transparent hover:bg-warning-subtle",

        /* ── Pending ── */
        pending:
          "bg-pending text-pending-foreground hover:bg-pending/90",
        "pending-outline":
          "border-pending text-pending-text bg-transparent hover:bg-pending-subtle",

        /* ── Info ── */
        info:
          "bg-info text-info-foreground hover:bg-info/90",
        "info-outline":
          "border-info text-info-text bg-transparent hover:bg-info-subtle",

        /* ── Highlight ── */
        highlight:
          "bg-highlight text-highlight-foreground hover:bg-highlight/90",
        "highlight-outline":
          "border-highlight text-highlight-text bg-transparent hover:bg-highlight-subtle",

        /* ── Neutral — black button, inverts in dark mode ── */
        neutral:
          "bg-neutral-btn text-neutral-btn-foreground hover:bg-neutral-btn/90",
        "neutral-outline":
          "border-neutral-btn text-neutral-btn bg-transparent hover:bg-neutral-btn/10",

        /* ── Negative — white button for use on dark surfaces ── */
        negative:
          "bg-background text-foreground border-border hover:bg-muted",

        /* ── Accent — vivid green, use sparingly on public/promo ── */
        accent:
          "bg-accent-500 text-accent-900 hover:bg-accent-400",

      },

      size: {
        sm:      "h-8 gap-1.5 px-3 text-xs",
        default: "h-10 gap-1.5 px-4 text-sm",
        lg:      "h-12 gap-1.5 px-6 text-base",
        xl:      "h-14 gap-2 px-8 text-base",
        icon:    "size-10",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)]",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

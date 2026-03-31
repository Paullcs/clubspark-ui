import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all",
  {
    variants: {
      variant: {

        /* ── shadcn defaults ── */
        default:
          "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",

        /* ── Destructive ── */
        destructive:
          "bg-destructive-subtle text-destructive-text border-destructive-border",
        "destructive-solid":
          "bg-destructive text-destructive-foreground",

        /* ── Success ── */
        success:
          "bg-success-subtle text-success-text border-success-border",
        "success-solid":
          "bg-success text-success-foreground",

        /* ── Active/Live ── */
        active:
          "bg-active-subtle text-active-text border-active-border",
        "active-solid":
          "bg-active text-active-foreground",

        /* ── Warning ── */
        warning:
          "bg-warning-subtle text-warning-text border-warning-border",
        "warning-solid":
          "bg-warning text-warning-foreground",

        /* ── Pending ── */
        pending:
          "bg-pending-subtle text-pending-text border-pending-border",
        "pending-solid":
          "bg-pending text-pending-foreground",

        /* ── Info ── */
        info:
          "bg-info-subtle text-info-text border-info-border",
        "info-solid":
          "bg-info text-info-foreground",

        /* ── Highlight ── */
        highlight:
          "bg-highlight-subtle text-highlight-text border-highlight-border",
        "highlight-solid":
          "bg-highlight text-highlight-foreground",

        /* ── Neutral ── */
        neutral:
          "bg-neutral-btn text-neutral-btn-foreground",
        "neutral-solid":
          "bg-neutral-btn text-neutral-btn-foreground",
        "neutral-subtle":
          "bg-muted text-muted-foreground border-border",

      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

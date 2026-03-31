import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-sm has-[data-slot=alert-action]:pr-18 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {

        /* ── Default — neutral informational ── */
        default:
          "bg-card text-card-foreground border-border",

        /* ── Filled variants — coloured background ── */
        destructive:
          "bg-destructive text-destructive-foreground border-destructive [&>svg]:text-destructive-foreground",
        success:
          "bg-success text-success-foreground border-success [&>svg]:text-success-foreground",
        active:
          "bg-active text-active-foreground border-active [&>svg]:text-active-foreground",
        warning:
          "bg-warning text-warning-foreground border-warning [&>svg]:text-warning-foreground",
        pending:
          "bg-pending text-pending-foreground border-pending [&>svg]:text-pending-foreground",
        info:
          "bg-info text-info-foreground border-info [&>svg]:text-info-foreground",
        highlight:
          "bg-highlight text-highlight-foreground border-highlight [&>svg]:text-highlight-foreground",
        neutral:
          "bg-neutral-btn text-neutral-btn-foreground border-neutral-btn [&>svg]:text-neutral-btn-foreground",

        /* ── Outline variants — subtle tinted background with coloured border ── */
        "destructive-outline":
          "bg-destructive-subtle text-destructive-text border-destructive-border [&>svg]:text-destructive",
        "success-outline":
          "bg-success-subtle text-success-text border-success-border [&>svg]:text-success",
        "active-outline":
          "bg-active-subtle text-active-text border-active-border [&>svg]:text-active",
        "warning-outline":
          "bg-warning-subtle text-warning-text border-warning-border [&>svg]:text-warning",
        "pending-outline":
          "bg-pending-subtle text-pending-text border-pending-border [&>svg]:text-pending",
        "info-outline":
          "bg-info-subtle text-info-text border-info-border [&>svg]:text-info",
        "highlight-outline":
          "bg-highlight-subtle text-highlight-text border-highlight-border [&>svg]:text-highlight",
        "neutral-outline":
          "bg-muted text-muted-foreground border-border [&>svg]:text-muted-foreground",

      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium leading-none tracking-tight col-start-2 [&+[data-slot=alert-description]]:mt-1",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm col-start-2 opacity-90 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "absolute right-3 top-3",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }

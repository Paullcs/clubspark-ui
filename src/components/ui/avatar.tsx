import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ─── Avatar size/variant variants ────────────────────────────────────────────

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full ring-1",
  {
    variants: {
      size: {
        "2xs":   "size-6",
        xs:      "size-7",
        sm:      "size-8",
        default: "size-10",
        lg:      "size-12",
        xl:      "size-16",
        "2xl":   "size-20",
        "3xl":   "size-24",
      },
      variant: {
        neutral: "bg-muted ring-border",
        info:    "bg-info/10 ring-info/30",
      },
    },
    defaultVariants: {
      size:    "default",
      variant: "neutral",
    },
  }
)

const fallbackVariants = cva(
  "flex size-full items-center justify-center rounded-full",
  {
    variants: {
      size: {
        "2xs":   "text-xs   font-medium",
        xs:      "text-xs   font-medium",
        sm:      "text-sm   font-medium",
        default: "text-sm   font-semibold",
        lg:      "text-base font-semibold",
        xl:      "text-lg   font-semibold",
        "2xl":   "text-xl   font-semibold",
        "3xl":   "text-2xl  font-semibold",
      },
      variant: {
        neutral: "bg-muted text-muted-foreground",
        info:    "bg-info/10 text-info",
      },
    },
    defaultVariants: {
      size:    "default",
      variant: "neutral",
    },
  }
)

// ─── Status dot sizing (scales with avatar) ───────────────────────────────────

const statusDotSize: Record<string, string> = {
  "2xs":   "size-1.5",
  xs:      "size-2",
  sm:      "size-2",
  default: "size-2.5",
  lg:      "size-3",
  xl:      "size-3.5",
  "2xl":   "size-4",
  "3xl":   "size-4",
}

// ─── Counter badge sizing (scales with avatar) ────────────────────────────────

const counterBadgeSize: Record<string, string> = {
  "2xs":   "size-3   text-[8px]",
  xs:      "size-3.5 text-[9px]",
  sm:      "size-4   text-[9px]",
  default: "size-5   text-xs",
  lg:      "size-5   text-xs",
  xl:      "size-6   text-xs",
  "2xl":   "size-6   text-sm",
  "3xl":   "size-7   text-sm",
}

// ─── Status colours ───────────────────────────────────────────────────────────

const statusColour: Record<string, string> = {
  online:  "bg-green-500",
  offline: "bg-muted-foreground",
  busy:    "bg-destructive",
  away:    "bg-warning",
}

// ─── Context ──────────────────────────────────────────────────────────────────

type AvatarSize    = VariantProps<typeof avatarVariants>["size"]
type AvatarVariant = VariantProps<typeof avatarVariants>["variant"]
type AvatarContextValue = { size: AvatarSize; variant: AvatarVariant }

const AvatarContext = React.createContext<AvatarContextValue>({
  size:    "default",
  variant: "neutral",
})

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  className,
  size    = "default",
  variant = "neutral",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarContext.Provider value={{ size, variant }}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(avatarVariants({ size, variant }), className)}
        {...props}
      />
    </AvatarContext.Provider>
  )
}

// ─── AvatarImage ──────────────────────────────────────────────────────────────

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

// ─── AvatarFallback ───────────────────────────────────────────────────────────

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const { size, variant } = React.useContext(AvatarContext)
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(fallbackVariants({ size, variant }), className)}
      {...props}
    />
  )
}

// ─── AvatarWrapper ────────────────────────────────────────────────────────────
// Wraps Avatar with optional status dot and/or counter badge.
//
// Usage:
//   <AvatarWrapper status="online">
//     <Avatar><AvatarFallback>RT</AvatarFallback></Avatar>
//   </AvatarWrapper>
//
//   <AvatarWrapper status="busy" count={3}>
//     <Avatar size="lg"><AvatarImage src="..." /><AvatarFallback>RT</AvatarFallback></Avatar>
//   </AvatarWrapper>

type AvatarStatus = "online" | "offline" | "busy" | "away"

type AvatarWrapperProps = {
  children:   React.ReactNode
  status?:    AvatarStatus
  count?:     number
  className?: string
}

function AvatarWrapper({ children, status, count, className }: AvatarWrapperProps) {
  // Extract size from the Avatar child's props so dots/badges scale correctly
  const size = React.useMemo(() => {
    const child = React.Children.toArray(children).find(
      (c) => React.isValidElement(c) && (c.type as any).name === "Avatar"
    )
    if (React.isValidElement(child)) {
      return (child.props as any).size ?? "default"
    }
    return "default"
  }, [children])

  const sizeKey = (size as string) ?? "default"

  return (
    <div className={cn("relative w-fit", className)}>
      {children}

      {/* Status dot — bottom right */}
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background",
            statusDotSize[sizeKey] ?? statusDotSize.default,
            statusColour[status]
          )}
        />
      )}

      {/* Counter badge — top right */}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center rounded-full border-2 border-background bg-destructive font-semibold text-white",
            counterBadgeSize[sizeKey] ?? counterBadgeSize.default
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarWrapper }
export type { AvatarStatus }
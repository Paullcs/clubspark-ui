"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// ─────────────────────────────────────────────────────────────────────────────
// InputGroup
//
// A wrapper that combines an input with a prefix or suffix text label.
// The text label has a dividing border between it and the input.
// The input has square corners on the side touching the label.
//
// Usage:
//   <InputGroup>
//     <InputGroupText position="start">£</InputGroupText>
//     <InputGroupInput placeholder="0.00" type="number" />
//   </InputGroup>
//
//   <InputGroup>
//     <InputGroupInput placeholder="Duration" type="number" />
//     <InputGroupText position="end">mins</InputGroupText>
//   </InputGroup>
//
// Sizes match input.tsx exactly: sm | default | lg | xl
// Pass size on InputGroup and it flows to all children via context.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Variants ─────────────────────────────────────────────────────────────────

const inputGroupVariants = cva(
  [
    "group/input-group relative flex w-full min-w-0 items-center",
    "rounded-lg border border-input bg-background transition-colors",
    "overflow-hidden", // clips child border-radius correctly
    // Focus ring on wrapper when inner input is focused
    "has-[[data-slot=input-group-control]:focus-visible]:border-ring",
    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
    "has-[[data-slot=input-group-control]:focus-visible]:ring-ring/20",
    // Error state
    "has-[[data-slot][aria-invalid=true]]:border-destructive",
    "has-[[data-slot][aria-invalid=true]]:ring-2",
    "has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
    // Disabled
    "has-disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        sm:      "h-8  text-xs",
        default: "h-10 text-sm",
        lg:      "h-12 text-base",
        xl:      "h-14 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// ─── Context ──────────────────────────────────────────────────────────────────

type InputGroupSize = "sm" | "default" | "lg" | "xl"

type InputGroupContextValue = {
  size:     InputGroupSize
  hasStart: boolean  // whether there's a prefix text label
  hasEnd:   boolean  // whether there's a suffix text label
}

const InputGroupContext = React.createContext<InputGroupContextValue>({
  size:     "default",
  hasStart: false,
  hasEnd:   false,
})

// ─── InputGroup ───────────────────────────────────────────────────────────────

function InputGroup({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {

  // Detect whether prefix/suffix text is present so the input can adjust corners
  const childArray = React.Children.toArray(children)
  const hasStart = childArray.some(
    (c) => React.isValidElement(c) && (c.props as any).position === "start"
  )
  const hasEnd = childArray.some(
    (c) => React.isValidElement(c) && (c.props as any).position === "end"
  )

  return (
    <InputGroupContext.Provider value={{ size: size as InputGroupSize, hasStart, hasEnd }}>
      <div
        data-slot="input-group"
        role="group"
        className={cn(inputGroupVariants({ size }), className)}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  )
}

// ─── InputGroupText ───────────────────────────────────────────────────────────

const textPadding: Record<InputGroupSize, string> = {
  sm:      "px-3",
  default: "px-3",
  lg:      "px-4",
  xl:      "px-4",
}

function InputGroupText({
  className,
  position = "start",
  ...props
}: React.ComponentProps<"span"> & { position?: "start" | "end" }) {
  const { size } = React.useContext(InputGroupContext)
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "flex h-full shrink-0 items-center text-muted-foreground select-none whitespace-nowrap bg-muted/40",
        textPadding[size],
        position === "start" && "border-r border-input",
        position === "end"   && "border-l border-input",
        className
      )}
      {...props}
    />
  )
}

// ─── InputGroupInput ──────────────────────────────────────────────────────────
// Uses a raw <input> so we can control rounding precisely.
// Square corners on the side(s) touching a text label.

const inputPadding: Record<InputGroupSize, string> = {
  sm:      "px-3 text-xs",
  default: "px-3 text-sm",
  lg:      "px-4 text-base",
  xl:      "px-4 text-base",
}

type InputGroupInputProps = Omit<React.ComponentProps<"input">, "size">

function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  const { size, hasStart, hasEnd } = React.useContext(InputGroupContext)
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        // Base — fill height and space
        "flex-1 min-w-0 h-full w-full bg-transparent",
        "text-foreground placeholder:text-muted-foreground",
        "outline-none border-0 ring-0",
        "focus-visible:outline-none focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:text-disabled-text",
        // Rounding — square the corners that touch a label
        !hasStart && !hasEnd && "rounded-lg",
        hasStart  && !hasEnd && "rounded-l-none rounded-r-lg",
        !hasStart && hasEnd  && "rounded-l-lg rounded-r-none",
        hasStart  && hasEnd  && "rounded-none",
        inputPadding[size],
        className
      )}
      {...props}
    />
  )
}

// ─── InputGroupTextarea ───────────────────────────────────────────────────────

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2",
        "shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  )
}

// ─── InputGroupButton ─────────────────────────────────────────────────────────

const inputGroupButtonVariants = cva(
  "flex shrink-0 items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs:        "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm:        "",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: { size: "xs" },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

// ─── InputGroupAddon (legacy block-level) ────────────────────────────────────

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2",
        "inline-end":   "order-last pr-2",
        "block-start":  "order-first w-full justify-start px-2.5 pt-2",
        "block-end":    "order-last w-full justify-start px-2.5 pb-2",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupButton,
  InputGroupAddon,
}

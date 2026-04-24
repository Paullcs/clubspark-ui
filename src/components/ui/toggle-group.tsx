"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Variant  = "default" | "outline" | "primary"
type Size     = "sm" | "default" | "lg"
type TypeSingle   = { type: "single";   value?: string;   defaultValue?: string;   onValueChange?: (v: string) => void }
type TypeMultiple = { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void }

type ToggleGroupProps = (TypeSingle | TypeMultiple) & {
  variant?:   Variant
  size?:      Size
  className?: string
  children?:  React.ReactNode
}

type ToggleGroupItemProps = {
  value:         string
  disabled?:     boolean
  className?:    string
  children?:     React.ReactNode
  "aria-label"?: string
}

type CtxValue = {
  selected: (v: string) => boolean
  toggle:   (v: string) => void
  variant:  Variant
  size:     Size
}

const Ctx = React.createContext<CtxValue>({
  selected: () => false,
  toggle:   () => {},
  variant:  "default",
  size:     "default",
})

const sizeMap: Record<Size, string> = {
  sm:      "h-8 px-2.5 text-xs",
  default: "h-9 px-3 text-sm",
  lg:      "h-10 px-5 text-sm",
}

function ToggleGroup({ variant = "default", size = "default", className, children, ...props }: ToggleGroupProps) {
  if (props.type === "single") {
    const { value: ctrl, defaultValue, onValueChange } = props
    const [internal, setInternal] = React.useState<string>(defaultValue ?? "")
    const value = ctrl !== undefined ? ctrl : internal
    return (
      <Ctx.Provider value={{ selected: (v) => v === value, toggle: (v) => { const n = value === v ? "" : v; setInternal(n); onValueChange?.(n) }, variant, size }}>
        <div className={cn("inline-flex items-center rounded-md border border-input", className)}>{children}</div>
      </Ctx.Provider>
    )
  }
  const { value: ctrl, defaultValue, onValueChange } = props
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const value = ctrl !== undefined ? ctrl : internal
  return (
    <Ctx.Provider value={{ selected: (v) => value.includes(v), toggle: (v) => { const n = value.includes(v) ? value.filter(x => x !== v) : [...value, v]; setInternal(n); onValueChange?.(n) }, variant, size }}>
      <div className={cn("inline-flex items-center rounded-md border border-input", className)}>{children}</div>
    </Ctx.Provider>
  )
}

function ToggleGroupItem({ value, disabled, className, children, ...props }: ToggleGroupItemProps) {
  const { selected, toggle, variant, size } = React.useContext(Ctx)
  const isOn = selected(value)

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isOn}
      onClick={() => !disabled && toggle(value)}
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "first:rounded-l-md last:rounded-r-md",
        "border-r border-input last:border-r-0",
        sizeMap[size],
        isOn && variant === "primary" ? "bg-primary text-primary-foreground" : isOn ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { ToggleGroup, ToggleGroupItem }
  
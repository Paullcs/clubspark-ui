import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base
        "peer size-4 shrink-0 rounded-full border border-input bg-background transition-colors outline-none",
        // Focus
        "focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/20",
        // Selected
        "data-[state=checked]:border-primary data-[state=checked]:bg-background",
        // Disabled unselected
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled-bg disabled:border-disabled-border",
        // Disabled selected
        "disabled:data-[state=checked]:border-disabled-border disabled:data-[state=checked]:bg-disabled-bg",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className={cn(
          "size-2 rounded-full bg-primary transition-colors",
          "peer-disabled:bg-disabled-text"
        )} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }

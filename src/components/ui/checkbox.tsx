import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base
        "peer size-4 shrink-0 rounded-[4px] border border-input bg-background transition-colors outline-none",
        // Focus
        "focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/20",
        // Checked
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        // Indeterminate
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled-bg disabled:border-disabled-border",
        // Disabled checked
        "disabled:data-[state=checked]:bg-disabled-bg disabled:data-[state=checked]:border-disabled-border disabled:data-[state=checked]:text-disabled-text",
        // Disabled indeterminate
        "disabled:data-[state=indeterminate]:bg-disabled-bg disabled:data-[state=indeterminate]:border-disabled-border disabled:data-[state=indeterminate]:text-disabled-text",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === "indeterminate" ? (
          <MinusIcon className="size-3" strokeWidth={3} />
        ) : (
          <CheckIcon className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

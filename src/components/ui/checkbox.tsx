import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  variant?: "default" | "info"
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base
        "peer size-4 shrink-0 rounded-[4px] border border-input bg-background transition-colors outline-none",
        // Focus
        "focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/20",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled-bg disabled:border-disabled-border",
        // Default variant — primary colour
        variant === "default" && [
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
          "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
          "disabled:data-[state=checked]:bg-disabled-bg disabled:data-[state=checked]:border-disabled-border disabled:data-[state=checked]:text-disabled-text",
          "disabled:data-[state=indeterminate]:bg-disabled-bg disabled:data-[state=indeterminate]:border-disabled-border disabled:data-[state=indeterminate]:text-disabled-text",
        ],
        // Info variant — for table row selection
        variant === "info" && [
          "data-[state=checked]:bg-[var(--info)] data-[state=checked]:border-[var(--info)] data-[state=checked]:text-[var(--info-foreground)]",
          "data-[state=indeterminate]:bg-[var(--info)] data-[state=indeterminate]:border-[var(--info)] data-[state=indeterminate]:text-[var(--info-foreground)]",
          "disabled:data-[state=checked]:bg-disabled-bg disabled:data-[state=checked]:border-disabled-border disabled:data-[state=checked]:text-disabled-text",
          "disabled:data-[state=indeterminate]:bg-disabled-bg disabled:data-[state=indeterminate]:border-disabled-border disabled:data-[state=indeterminate]:text-disabled-text",
        ],
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

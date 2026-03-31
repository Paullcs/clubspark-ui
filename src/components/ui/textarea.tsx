import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-background text-foreground transition-colors outline-none placeholder:text-placeholder focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/20 disabled:pointer-events-none disabled:bg-disabled-bg disabled:text-disabled-text disabled:border-disabled-border aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 resize-y",
  {
    variants: {
      size: {
        sm:      "min-h-16 px-3 py-2 text-xs",
        default: "min-h-20 px-3 py-2.5 text-sm",
        lg:      "min-h-28 px-4 py-3 text-base",
        xl:      "min-h-36 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Textarea({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }

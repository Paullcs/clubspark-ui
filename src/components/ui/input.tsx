import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-background text-foreground transition-colors outline-none placeholder:text-placeholder focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/20 disabled:pointer-events-none disabled:bg-disabled-bg disabled:text-disabled-text disabled:border-disabled-border aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 file:inline-flex file:h-full file:border-0 file:bg-transparent file:font-medium",
  {
    variants: {
      size: {
        sm:      "h-8  px-3 text-xs",
        default: "h-10 px-3 text-sm",
        lg:      "h-12 px-4 text-base",
        xl:      "h-14 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }

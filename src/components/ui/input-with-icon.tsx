import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputWithIconVariants = cva(
  "relative flex items-center w-full",
  {
    variants: {
      size: {
        sm:      "h-8",
        default: "h-10",
        lg:      "h-12",
        xl:      "h-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const inputInnerVariants = cva(
  "w-full rounded-lg border border-input bg-background text-foreground transition-colors outline-none placeholder:text-placeholder focus-visible:border-focus-ring focus-visible:ring-2 focus-visible:ring-focus-ring/20 disabled:pointer-events-none disabled:bg-disabled-bg disabled:text-disabled-text disabled:border-disabled-border aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
  {
    variants: {
      size: {
        sm:      "h-8  text-xs",
        default: "h-10 text-sm",
        lg:      "h-12 text-base",
        xl:      "h-14 text-base",
      },
      hasLeadingIcon:  { true: "", false: "" },
      hasTrailingIcon: { true: "", false: "" },
    },
    compoundVariants: [
      { size: "sm",      hasLeadingIcon: true,  className: "pl-8"  },
      { size: "default", hasLeadingIcon: true,  className: "pl-10" },
      { size: "lg",      hasLeadingIcon: true,  className: "pl-11" },
      { size: "xl",      hasLeadingIcon: true,  className: "pl-12" },
      { size: "sm",      hasLeadingIcon: false, className: "pl-3"  },
      { size: "default", hasLeadingIcon: false, className: "pl-3"  },
      { size: "lg",      hasLeadingIcon: false, className: "pl-4"  },
      { size: "xl",      hasLeadingIcon: false, className: "pl-4"  },
      { size: "sm",      hasTrailingIcon: true,  className: "pr-8"  },
      { size: "default", hasTrailingIcon: true,  className: "pr-10" },
      { size: "lg",      hasTrailingIcon: true,  className: "pr-11" },
      { size: "xl",      hasTrailingIcon: true,  className: "pr-12" },
      { size: "sm",      hasTrailingIcon: false, className: "pr-3"  },
      { size: "default", hasTrailingIcon: false, className: "pr-3"  },
      { size: "lg",      hasTrailingIcon: false, className: "pr-4"  },
      { size: "xl",      hasTrailingIcon: false, className: "pr-4"  },
    ],
    defaultVariants: {
      size: "default",
      hasLeadingIcon: false,
      hasTrailingIcon: false,
    },
  }
)

const iconPositionVariants = cva(
  "absolute flex items-center justify-center pointer-events-none text-placeholder",
  {
    variants: {
      size: {
        sm:      "size-8",
        default: "size-10",
        lg:      "size-11",
        xl:      "size-12",
      },
      position: {
        leading:  "left-0",
        trailing: "right-0",
      },
    },
    defaultVariants: {
      size: "default",
      position: "leading",
    },
  }
)

interface InputWithIconProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputWithIconVariants> {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

function InputWithIcon({
  className,
  type,
  size = "default",
  leadingIcon,
  trailingIcon,
  ...props
}: InputWithIconProps) {
  return (
    <div className={cn(inputWithIconVariants({ size }), className)}>
      {leadingIcon && (
        <span className={cn(iconPositionVariants({ size, position: "leading" }))}>
          {leadingIcon}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputInnerVariants({
            size,
            hasLeadingIcon: !!leadingIcon,
            hasTrailingIcon: !!trailingIcon,
          })
        )}
        {...props}
      />
      {trailingIcon && (
        <span className={cn(iconPositionVariants({ size, position: "trailing" }))}>
          {trailingIcon}
        </span>
      )}
    </div>
  )
}

export { InputWithIcon }

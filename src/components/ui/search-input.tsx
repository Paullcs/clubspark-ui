import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { InputWithIcon } from "@/components/ui/input-with-icon"

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "size" | "type"> {
  size?: "sm" | "default" | "lg" | "xl"
  onClear?: () => void
  value?: string
}

function SearchInput({
  className,
  size = "default",
  onClear,
  value,
  ...props
}: SearchInputProps) {
  const iconSizeMap = {
    sm:      "size-3.5",
    default: "size-4",
    lg:      "size-4",
    xl:      "size-5",
  }

  const iconSize = iconSizeMap[size ?? "default"]

  return (
    <InputWithIcon
      type="search"
      size={size}
      value={value}
      className={className}
      leadingIcon={
        <SearchIcon className={cn(iconSize, "text-placeholder")} />
      }
      trailingIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="pointer-events-auto flex items-center justify-center text-placeholder hover:text-foreground transition-colors"
          >
            <XIcon className={iconSize} />
          </button>
        ) : undefined
      }
      {...props}
    />
  )
}

export { SearchInput }

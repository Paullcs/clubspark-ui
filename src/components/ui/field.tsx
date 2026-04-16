"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldProps = {
  label?:       string
  hint?:        string
  error?:       string
  required?:    boolean
  disabled?:    boolean
  htmlFor?:     string        // links label to a specific input id
  className?:   string
  children?:    React.ReactNode
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  required,
  disabled,
  htmlFor,
  className,
  children,
}: FieldProps) {
  // Auto-generate an id if label is present but no htmlFor provided,
  // so the label click focuses the input correctly
  const autoId = React.useId()
  const inputId = htmlFor ?? (label ? autoId : undefined)

  // Clone the first direct child input and inject id + disabled + aria-invalid
  const enhancedChildren = React.Children.map(children, (child, i) => {
    if (i === 0 && React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        id:            (child.props as any).id ?? inputId,
        disabled:      (child.props as any).disabled ?? disabled,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": [
          hint  ? `${inputId}-hint`  : undefined,
          error ? `${inputId}-error` : undefined,
        ].filter(Boolean).join(" ") || undefined,
      })
    }
    return child
  })

  return (
    <div
      data-slot="field"
      data-disabled={disabled || undefined}
      className={cn("flex flex-col gap-1.5", disabled && "opacity-50", className)}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground leading-none"
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-hidden>*</span>
          )}
        </label>
      )}

      {/* Input slot */}
      {enhancedChildren}

      {/* Hint — shown when no error */}
      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className="text-xs text-muted-foreground"
        >
          {hint}
        </p>
      )}

      {/* Error — replaces hint */}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { Field }

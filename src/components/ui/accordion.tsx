"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type AccordionVariant = "default" | "plus" | "connected"

const AccordionContext = React.createContext<AccordionVariant>("default")

function Accordion({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { variant?: AccordionVariant }) {
  return (
    <AccordionContext.Provider value={variant}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        className={cn(
          "flex w-full flex-col",
          variant === "plus" && "gap-2",
          variant === "connected" && "-space-y-px",
          className
        )}
        {...props}
      />
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const variant = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        variant === "default" && "not-last:border-b",
        variant === "plus" && "overflow-hidden rounded-[var(--radius)] border border-border bg-background px-4",
        variant === "connected" && "overflow-hidden border border-border bg-background px-4 first:rounded-t-[var(--radius)] last:rounded-b-[var(--radius)] last:border-b",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const variant = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-5 text-left text-lg font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "hover:underline **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-5 items-center **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          (variant === "plus" || variant === "connected") && "hover:no-underline items-center",
          className
        )}
        {...props}
      >
        {variant === "default" ? (
          <>
            {children}
            <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
            <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
          </>
        ) : (
          <div className="flex w-full items-center gap-3">
            <div className="relative size-4 shrink-0">
              <PlusIcon className="absolute inset-0 size-4 text-muted-foreground transition-opacity duration-200 group-aria-expanded/accordion-trigger:opacity-0" />
              <MinusIcon className="absolute inset-0 size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-aria-expanded/accordion-trigger:opacity-100" />
            </div>
            <span className="flex-1 text-left">{children}</span>
          </div>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const variant = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-md data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          (variant === "plus" || variant === "connected") && "ps-7",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

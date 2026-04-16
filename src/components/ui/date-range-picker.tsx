"use client"

import * as React from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type DateRange = {
  from:    Date
  to:      Date
  preset?: string
}

export type DateRangePickerProps = {
  value?:       DateRange
  onChange?:    (range: DateRange) => void
  className?:   string
  placeholder?: string
}

type Preset = { label: string; getRange: () => { from: Date; to: Date } }

function getPresets(): Preset[] {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysAgo      = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d }
  const endOfDay     = (d: Date)   => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
  const startOfWeek  = (d: Date)   => { const day = d.getDay(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day + (day === 0 ? -6 : 1)) }
  const startOfMonth = (d: Date)   => new Date(d.getFullYear(), d.getMonth(), 1)
  const startOfQtr   = (d: Date)   => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1)
  const startOfYear  = (d: Date)   => new Date(d.getFullYear(), 0, 1)
  return [
    { label: "Today",           getRange: () => ({ from: today,               to: endOfDay(today) }) },
    { label: "Yesterday",       getRange: () => ({ from: daysAgo(1),          to: endOfDay(daysAgo(1)) }) },
    { label: "Week to date",    getRange: () => ({ from: startOfWeek(today),  to: endOfDay(today) }) },
    { label: "Last 7 days",     getRange: () => ({ from: daysAgo(6),          to: endOfDay(today) }) },
    { label: "Last week",       getRange: () => { const s = startOfWeek(daysAgo(7)); const e = new Date(s); e.setDate(e.getDate() + 6); return { from: s, to: endOfDay(e) } } },
    { label: "Month to date",   getRange: () => ({ from: startOfMonth(today), to: endOfDay(today) }) },
    { label: "Last 30 days",    getRange: () => ({ from: daysAgo(29),         to: endOfDay(today) }) },
    { label: "Last month",      getRange: () => { const s = new Date(today.getFullYear(), today.getMonth() - 1, 1); const e = new Date(today.getFullYear(), today.getMonth(), 0); return { from: s, to: endOfDay(e) } } },
    { label: "Quarter to date", getRange: () => ({ from: startOfQtr(today),   to: endOfDay(today) }) },
    { label: "Last 90 days",    getRange: () => ({ from: daysAgo(89),         to: endOfDay(today) }) },
    { label: "Last 3 months",   getRange: () => { const s = new Date(today.getFullYear(), today.getMonth() - 3, 1); const e = new Date(today.getFullYear(), today.getMonth(), 0); return { from: s, to: endOfDay(e) } } },
    { label: "Last 6 months",   getRange: () => { const s = new Date(today.getFullYear(), today.getMonth() - 6, 1); const e = new Date(today.getFullYear(), today.getMonth(), 0); return { from: s, to: endOfDay(e) } } },
    { label: "Year to date",    getRange: () => ({ from: startOfYear(today),  to: endOfDay(today) }) },
    { label: "Last year",       getRange: () => { const s = new Date(today.getFullYear() - 1, 0, 1); const e = new Date(today.getFullYear() - 1, 11, 31); return { from: s, to: endOfDay(e) } } },
    { label: "All time",        getRange: () => ({ from: new Date(2000, 0, 1),to: endOfDay(today) }) },
  ]
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function DateRangePicker({ value, onChange, className, placeholder = "Select date range" }: DateRangePickerProps) {
  const [open, setOpen]       = React.useState(false)
  const [from, setFrom]       = React.useState<Date | undefined>()
  const [to, setTo]           = React.useState<Date | undefined>()
  const [step, setStep]       = React.useState<"from" | "to">("from")
  const presets               = React.useMemo(() => getPresets(), [])

  // Sync display range from value when opening
  function handleOpenChange(o: boolean) {
    if (o) {
      setFrom(value?.from)
      setTo(value?.to)
      setStep("from") // always reset to first click on open
    } else {
      // Dismissed mid-selection — revert
      setFrom(value?.from)
      setTo(value?.to)
      setStep("from")
    }
    setOpen(o)
  }

  function handleDayClick(day: Date) {
    if (step === "from") {
      // First click — set start, clear end, wait for second click
      setFrom(day)
      setTo(undefined)
      setStep("to")
    } else {
      // Second click — set end
      if (day < from!) {
        // Clicked before start — swap them
        setTo(from)
        setFrom(day)
        onChange?.({ from: day, to: from!, preset: undefined })
      } else if (day.toDateString() === from!.toDateString()) {
        // Same day — reset and start again
        setFrom(day)
        setTo(undefined)
        setStep("to")
        return
      } else {
        setTo(day)
        onChange?.({ from: from!, to: day, preset: undefined })
      }
      setStep("from")
      setOpen(false)
    }
  }

  function selectPreset(preset: Preset) {
    const range = preset.getRange()
    setFrom(range.from)
    setTo(range.to)
    setStep("from")
    onChange?.({ from: range.from, to: range.to, preset: preset.label })
    setOpen(false)
  }

  // Build modifiers to highlight the in-progress or completed range
  const modifiers = React.useMemo(() => {
    if (from && to) {
      return {
        range_start:  [from],
        range_end:    [to],
        range_middle: { after: from, before: to },
      }
    }
    if (from) {
      return { range_start: [from] }
    }
    return {}
  }, [from, to])

  const activePreset = value?.preset

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2 font-normal min-w-56", !value && "text-muted-foreground", className)}
        >
          <CalendarIcon className="size-4 shrink-0" />
          <span className="flex-1 text-left truncate">
            {value ? `${fmt(value.from)} – ${fmt(value.to)}` : placeholder}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: "var(--z-dropdown)" }}>
        <div className="flex divide-x divide-border">

          {/* Preset list */}
          <div className="flex flex-col py-2 w-40 shrink-0 overflow-y-auto max-h-[420px]">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => selectPreset(preset)}
                className={cn(
                  "px-3 py-1.5 text-sm text-left transition-colors whitespace-nowrap",
                  "hover:bg-accent hover:text-accent-foreground",
                  activePreset === preset.label
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar — mode single so WE control the two-click logic */}
          <div className="p-3">
            <Calendar
              mode="single"
              selected={to ?? from}
              onSelect={(day) => { if (day) handleDayClick(day) }}
              numberOfMonths={2}
              defaultMonth={from ?? new Date()}
              showOutsideDays={false}
              modifiers={modifiers as any}
              modifiersClassNames={{
                range_start:  "bg-primary text-primary-foreground rounded-md",
                range_end:    "bg-primary text-primary-foreground rounded-md",
                range_middle: "!bg-accent rounded-none",
                today:        "rdp-today",
              }}
            />
          </div>

        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

// ─────────────────────────────────────────────────────────────────────────────
// data-table-core.tsx
//
// Shared internals used by DataTableFixed and DataTableFluid.
// Not intended to be used directly in your app —
// import DataTableFixed or DataTableFluid instead.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { Row, ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  AlignJustifyIcon,
  AlignCenterIcon,
  StretchHorizontalIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type DensityOption = "compact" | "default" | "comfortable"

export type BulkAction<TData> = {
  label: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  onClick: (rows: TData[]) => void
}

export type RowAction<TData> = {
  label: string
  variant?: "default" | "destructive"
  onClick: (row: TData) => void
}

// ─── Density Config ───────────────────────────────────────────────────────────

export const densityConfig: Record<DensityOption, { cell: string; icon: React.ReactNode; label: string }> = {
  compact:     { cell: "py-1.5", icon: <AlignJustifyIcon    className="size-4" />, label: "Compact"     },
  default:     { cell: "py-3",   icon: <AlignCenterIcon     className="size-4" />, label: "Default"     },
  comfortable: { cell: "py-4",   icon: <StretchHorizontalIcon className="size-4" />, label: "Comfortable" },
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

export function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUpIcon   className="size-3.5 ml-1.5 shrink-0" />
  if (direction === "desc") return <ArrowDownIcon  className="size-3.5 ml-1.5 shrink-0" />
  return <ArrowUpDownIcon className="size-3.5 ml-1.5 shrink-0 opacity-40" />
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCsv<TData>(
  rows: Row<TData>[],
  columns: ColumnDef<TData, any>[],
  filename: string
) {
  const headers = columns
    .filter((col) => "accessorKey" in col && col.accessorKey)
    .map((col) => String((col as any).accessorKey))

  const csvRows = rows.map((row) =>
    headers.map((key) => {
      const val = (row.original as any)[key]
      if (val === null || val === undefined) return ""
      const str = String(val)
      return str.includes(",") || str.includes('"')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(",")
  )

  const csv  = [headers.join(","), ...csvRows].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Density Toggle ───────────────────────────────────────────────────────────

export function DensityToggle({
  value,
  onChange,
}: {
  value: DensityOption
  onChange: (d: DensityOption) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {densityConfig[value].icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Row density</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(densityConfig) as DensityOption[]).map((d) => (
          <DropdownMenuItem
            key={d}
            onClick={() => onChange(d)}
            className={cn("gap-2", value === d && "font-medium text-primary")}
          >
            {densityConfig[d].icon}
            {densityConfig[d].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────

export function BulkActionBar<TData>({
  selectedCount,
  selectedRows,
  actions,
  onClear,
}: {
  selectedCount: number
  selectedRows: TData[]
  actions: BulkAction<TData>[]
  onClear: () => void
}) {
  if (selectedCount === 0) return null
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-table-bulk-bar-bg px-4 py-2.5 flex-wrap">
      <span className="text-sm font-medium text-foreground">
        {selectedCount} row{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((action, i) => (
          <Button
            key={i}
            size="sm"
            variant={action.variant ?? "outline"}
            onClick={() => action.onClick(selectedRows)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <Button size="sm" variant="ghost" className="ml-auto" onClick={onClear}>
        Clear selection
      </Button>
    </div>
  )
}

// ─── Pagination Bar ───────────────────────────────────────────────────────────

export function PaginationBar({
  pageIndex,
  pageCount,
  totalCount,
  pageSize,
  pageSizeOptions,
  canPrevious,
  canNext,
  onFirst,
  onPrevious,
  onNext,
  onLast,
  onPageSizeChange,
}: {
  pageIndex: number
  pageCount: number
  totalCount: number
  pageSize: number
  pageSizeOptions: number[]
  canPrevious: boolean
  canNext: boolean
  onFirst: () => void
  onPrevious: () => void
  onNext: () => void
  onLast: () => void
  onPageSizeChange: (n: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rows per page</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger size="sm" className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-xs text-muted-foreground">
        Page {pageIndex + 1} of {pageCount} · {totalCount} rows
      </span>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onFirst}    disabled={!canPrevious}><ChevronsLeftIcon  className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={onPrevious} disabled={!canPrevious}><ChevronLeftIcon   className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={onNext}     disabled={!canNext}    ><ChevronRightIcon  className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={onLast}     disabled={!canNext}    ><ChevronsRightIcon className="size-4" /></Button>
      </div>
    </div>
  )
}

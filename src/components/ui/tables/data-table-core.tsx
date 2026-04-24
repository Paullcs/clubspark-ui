"use client"

// ─────────────────────────────────────────────────────────────────────────────
// data-table-core
//
// Shared building blocks for admin data tables:
//   - DataTableShell        — bordered wrapper (single point of edit for border)
//   - DataTableColumnHeader — ONE header component for every data table
//   - SortIcon              — sort arrows
//   - TableAvatarCell       — avatar + name cell
//   - BulkActionBar         — bulk actions above the table
//   - PaginationBar         — pagination controls below the table
//   - DensityToggle         — row density dropdown
//   - createSelectColumn    — select-all checkbox column
//   - exportToCsv           — CSV export utility
//
// Meta pattern:
//   Column defs pass `meta` (DataTableColumnMeta) only — never className.
//   Table components read meta via getCellClasses / getHeaderClasses.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { Row, Column, ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  AlignJustifyIcon,
  AlignCenterIcon,
  StretchHorizontalIcon,
} from "lucide-react"

// Library components — composed, never bypassed.
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type DensityOption = "compact" | "default" | "comfortable"

export type BulkAction<TData> = {
  label:    string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  onClick:  (rows: TData[]) => void
}

export type RowAction<TData> = {
  label:    string
  variant?: "default" | "destructive"
  onClick:  (row: TData) => void
}

export type ColumnEditorConfig =
  | { type: "text" }
  | { type: "number" }
  | { type: "select"; options: { label: string; value: string }[] }
  | { type: "date" }

export type DataTableColumnMeta = {
  /** Human-readable column name. Used in the column visibility dropdown
   *  and anywhere else a display label is needed. Falls back to column id. */
  title?:           string
  cellVariant?:     "primary" | "secondary"
  align?:           "left" | "center" | "right"
  tabularNums?:     boolean
  width?:           number | string
  minWidth?:        number | string
  maxWidth?:        number | string
  /** Prevent ellipsis truncation. Use for numbers, dates, IDs — any content
   *  where clipping would be misleading. Auto-applied when `tabularNums` is true. */
  noTruncate?:      boolean
  /** Applies to both header and cell. Escape hatch — use sparingly. */
  className?:       string
  headerClassName?: string
  cellClassName?:   string
  editor?:          ColumnEditorConfig
}

// ─── Meta → class helpers ────────────────────────────────────────────────────

export function getCellClasses(meta: DataTableColumnMeta | undefined): string {
  // Truncation rule: truncate text cells by default.
  // Never truncate when:
  //   - meta.noTruncate is explicitly set (consumer opt-out)
  //   - meta.tabularNums is true (numbers must render fully — truncating a
  //     currency value or ID would mislead)
  const shouldNotTruncate = meta?.noTruncate || meta?.tabularNums

  return cn(
    "text-sm",
    meta?.cellVariant === "secondary" ? "text-muted-foreground" : "text-foreground",
    meta?.align === "right"  && "text-right",
    meta?.align === "center" && "text-center",
    meta?.tabularNums        && "tabular-nums",
    shouldNotTruncate ? "whitespace-nowrap" : "truncate",
    meta?.className,
    meta?.cellClassName,
  )
}

export function getHeaderClasses(meta: DataTableColumnMeta | undefined): string {
  return cn(
    meta?.align === "right"  && "text-right",
    meta?.align === "center" && "text-center",
    meta?.className,
    meta?.headerClassName,
  )
}

// ─── Data table shell (bordered wrapper) ─────────────────────────────────────

/**
 * Shared bordered wrapper for all admin data tables. Every data table variant
 * wraps its <Table> in this shell so border treatment is defined in one place.
 * Change the border once here — every data table inherits.
 *
 * The Table primitive itself stays neutral so raw <Table> usage (content
 * tables, embedded tables) doesn't get a forced border.
 */
export function DataTableShell({
  children,
  className,
}: {
  children:   React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      {children}
    </div>
  )
}

// ─── Pinned column layout helper ─────────────────────────────────────────────
//
// Used by DataTableFixed (and any future variant with pinned columns). Reads
// width + alignment from meta, reads pin state from the TanStack column, and
// returns the style object + data attributes to apply to <TableHead>/<TableCell>.
//
// The returned `pinned` and `lastPinned` values drive the data-pinned /
// data-last-col attributes which in turn drive the CSS divider between the
// pinned zone and the scrolling zone.

type TanstackPinColumn = {
  getIsPinned?:     () => "left" | "right" | false
  getIsLastColumn?: (position: "left" | "right") => boolean
  getIsFirstColumn?:(position: "left" | "right") => boolean
  getStart?:        (position: "left" | "right") => number
  getAfter?:        (position: "left" | "right") => number
  getSize?:         () => number
}

export function getPinnedColumnStyles(
  meta:   DataTableColumnMeta | undefined,
  column: TanstackPinColumn,
): {
  style:      React.CSSProperties
  pinned:     "left" | "right" | false
  lastPinned: "left" | "right" | undefined
} {
  const style: React.CSSProperties = {}

  if (meta?.width    !== undefined) style.width    = typeof meta.width    === "number" ? `${meta.width}px`    : meta.width
  if (meta?.minWidth !== undefined) style.minWidth = typeof meta.minWidth === "number" ? `${meta.minWidth}px` : meta.minWidth
  if (meta?.maxWidth !== undefined) style.maxWidth = typeof meta.maxWidth === "number" ? `${meta.maxWidth}px` : meta.maxWidth

  if (style.width === undefined && typeof column.getSize === "function") {
    const w = column.getSize()
    if (typeof w === "number" && Number.isFinite(w)) style.width = `${w}px`
  }

  const pinned = column.getIsPinned?.() ?? false
  let lastPinned: "left" | "right" | undefined

  if (pinned) {
    style.position = "sticky"
    style.zIndex   = 1

    if (pinned === "left") {
      style.left = `${column.getStart?.("left") ?? 0}px`
      if (column.getIsLastColumn?.("left")) lastPinned = "left"
    }
    if (pinned === "right") {
      style.right = `${column.getAfter?.("right") ?? 0}px`
      if (column.getIsFirstColumn?.("right")) lastPinned = "right"
    }
  }

  return { style, pinned, lastPinned }
}

// ─── Select column ────────────────────────────────────────────────────────────

export function createSelectColumn<TData>(): ColumnDef<TData, any> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        variant="info"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        variant="info"
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding:  false,
    meta: { title: "Select", width: 44, align: "center" },
  }
}

// ─── Density config ───────────────────────────────────────────────────────────

export const densityConfig: Record<DensityOption, { cell: string; icon: React.ReactNode; label: string }> = {
  compact:     { cell: "py-1.5", icon: <AlignJustifyIcon      className="size-4" />, label: "Compact"     },
  default:     { cell: "py-3",   icon: <AlignCenterIcon       className="size-4" />, label: "Default"     },
  comfortable: { cell: "py-4",   icon: <StretchHorizontalIcon className="size-4" />, label: "Comfortable" },
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

export function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUpIcon     className="size-3.5 ml-1.5 shrink-0" />
  if (direction === "desc") return <ArrowDownIcon   className="size-3.5 ml-1.5 shrink-0" />
  return                       <ArrowUpDownIcon className="size-3.5 ml-1.5 shrink-0 opacity-40" />
}

// ─── Column header (shared across every data table) ──────────────────────────

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: {
  column: Column<TData, TValue>
  title:  string
}) {
  if (!column.getCanSort()) {
    return <span className="text-sm font-medium text-foreground">{title}</span>
  }
  return (
    <button
      type="button"
      className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <SortIcon direction={column.getIsSorted()} />
    </button>
  )
}

// ─── Avatar cell ──────────────────────────────────────────────────────────────

export function TableAvatarCell({
  initials,
  name,
}: {
  initials: string
  name:     string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar size="xs">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  )
}

// ─── CSV export ───────────────────────────────────────────────────────────────

export function exportToCsv<TData>(
  rows: Row<TData>[],
  columns: ColumnDef<TData, any>[],
  filename: string,
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

// ─── Density toggle ───────────────────────────────────────────────────────────

export function DensityToggle({
  value,
  onChange,
}: {
  value:    DensityOption
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

// ─── Bulk action bar ──────────────────────────────────────────────────────────

export function BulkActionBar<TData>({
  selectedCount,
  selectedRows,
  actions,
  onClear,
}: {
  selectedCount: number
  selectedRows:  TData[]
  actions:       BulkAction<TData>[]
  onClear:       () => void
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

// ─── Pagination bar ───────────────────────────────────────────────────────────
// Composed from the library's Pagination primitives. Matches the "Full" demo
// variant on /components: rows-per-page select + "Page X of Y · N rows"
// summary + numbered page links with ellipsis + icon-only prev/next.

/**
 * Shared helper: given current page (1-indexed) + total pages, return the
 * array of page numbers and ellipses to render.
 * Rule: always show first, last, current, and neighbours; collapse the rest.
 */
function paginationRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  if (start > 2) pages.push("ellipsis")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("ellipsis")
  pages.push(total)
  return pages
}

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
  onPageChange,
}: {
  pageIndex:        number
  pageCount:        number
  totalCount:       number
  pageSize:         number
  pageSizeOptions:  number[]
  canPrevious:      boolean
  canNext:          boolean
  onFirst:          () => void
  onPrevious:       () => void
  onNext:           () => void
  onLast:           () => void
  onPageSizeChange: (n: number) => void
  onPageChange?:    (pageIndex: number) => void
}) {
  const currentPage = pageIndex + 1 // convert 0-indexed to 1-indexed for display
  const range       = paginationRange(currentPage, Math.max(pageCount, 1))

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
        Page {currentPage} of {pageCount} · {totalCount} rows
      </span>

      <Pagination className="w-auto mx-0 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!canPrevious}
              className={cn(!canPrevious && "pointer-events-none opacity-50")}
              onClick={(e) => { e.preventDefault(); if (canPrevious) onPrevious() }}
            />
          </PaginationItem>
          {range.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === currentPage}
                  onClick={(e) => { e.preventDefault(); onPageChange?.(p - 1) }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!canNext}
              className={cn(!canNext && "pointer-events-none opacity-50")}
              onClick={(e) => { e.preventDefault(); if (canNext) onNext() }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DataTableFixed
//
// Admin data table with pinned columns + horizontal scroll. Suited to dense
// datasets where the row is wider than the viewport.
//
// Built entirely from library primitives. Column defs pass `meta` only — no
// inline className at call sites.
//
// Styling contract:
//   - Headers use <DataTableColumnHeader>
//   - Cells get classes from density + meta via getCellClasses
//   - Outer border comes from <DataTableShell>
//   - Pinned/scroll divider uses `border-border` token, no drop shadows
//
// Feature flags (all optional):
//   leftPinned / rightPinned → arrays of column ids to pin
//   searchColumn             → toolbar search
//   exportable               → CSV export
//   rowActions               → "..." menu per row (appended to rightPinned)
//   bulkActions              → bulk action bar when rows selected
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Settings2Icon,
  DownloadIcon,
  MoreHorizontalIcon,
  FileTextIcon,
} from "lucide-react"

// Library primitives.
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tables/table"

import { cn } from "@/lib/utils"
import {
  BulkAction,
  BulkActionBar,
  DataTableColumnMeta,
  DataTableShell,
  DensityOption,
  DensityToggle,
  PaginationBar,
  RowAction,
  densityConfig,
  exportToCsv,
  getCellClasses,
  getHeaderClasses,
  getPinnedColumnStyles,
} from "@/components/ui/tables/data-table-core"

// ─── Props ────────────────────────────────────────────────────────────────────

export type DataTableFixedProps<TData> = {
  data:     TData[]
  columns:  ColumnDef<TData, any>[]
  getRowId: (row: TData) => string

  /** Number of leading columns to pin to the left. Follows the order of `columns`. */
  leftPinCount?:  number
  /** Number of trailing columns to pin to the right. Row actions auto-append when `rowActions` is provided. */
  rightPinCount?: number

  searchColumn?:      string
  searchPlaceholder?: string
  toolbarLeft?:       React.ReactNode
  toolbarRight?:      React.ReactNode

  defaultPageSize?: number
  pageSizeOptions?: number[]

  onRowClick?: (row: TData) => void
  rowActions?: RowAction<TData>[]
  bulkActions?: BulkAction<TData>[]

  exportable?:     boolean
  exportFilename?: string
  loading?:        boolean
  loadingRows?:    number

  emptyMessage?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTableFixed<TData>({
  data,
  columns: userColumns,
  getRowId,
  leftPinCount  = 0,
  rightPinCount = 0,
  searchColumn,
  searchPlaceholder = "Search…",
  toolbarLeft,
  toolbarRight,
  defaultPageSize = 8,
  pageSizeOptions = [5, 8, 10, 20],
  onRowClick,
  rowActions,
  bulkActions,
  exportable = false,
  exportFilename = "export",
  loading = false,
  loadingRows = 8,
  emptyMessage = "No results found.",
}: DataTableFixedProps<TData>) {

  const [sorting, setSorting]                   = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]       = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection]         = React.useState({})
  const [pageSize, setPageSize]                 = React.useState(defaultPageSize)
  const [density, setDensity]                   = React.useState<DensityOption>("default")

  // ── Compose columns: user columns + optional row actions ────────────────────
  const columns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    const cols = [...userColumns]
    if (rowActions?.length) {
      cols.push({
        id: "__actions",
        header: () => null,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="size-8 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">Row actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {rowActions.map((action, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={(e) => { e.stopPropagation(); action.onClick(row.original) }}
                    className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
        enableHiding:  false,
        meta: { title: "Actions", width: 56, align: "center" },
      })
    }
    return cols
  }, [userColumns, rowActions])

  // ── Compute final pinning state from counts
  // Takes the first N / last N column ids from the composed column list (after
  // rowActions has been appended). Row actions are always included in the right
  // pin when present — they stay sticky even if rightPinCount is 0.
  const columnPinning = React.useMemo<ColumnPinningState>(() => {
    const ids = columns.map((c) => c.id ?? (c as any).accessorKey).filter(Boolean) as string[]

    const left  = ids.slice(0, Math.max(0, leftPinCount))

    // Right pin: last N columns, PLUS the row actions column if present and not already included.
    // We compute rightIds from the non-left portion so a left pin can never double-count into right.
    const nonLeft = ids.slice(left.length)
    const rightFromCount = rightPinCount > 0
      ? nonLeft.slice(Math.max(0, nonLeft.length - rightPinCount))
      : []
    const right = [...rightFromCount]
    if (rowActions?.length && !right.includes("__actions")) {
      right.push("__actions")
    }

    return { left, right }
  }, [columns, leftPinCount, rightPinCount, rowActions])

  const tableInstance = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection, columnPinning },
    enableRowSelection: true,
    enableMultiSort:    true,
    onRowSelectionChange:     setRowSelection,
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel:          getCoreRowModel(),
    getSortedRowModel:        getSortedRowModel(),
    getFilteredRowModel:      getFilteredRowModel(),
    getPaginationRowModel:    getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  React.useEffect(() => { tableInstance.setPageSize(pageSize) }, [pageSize, tableInstance])

  const selectedRows  = tableInstance.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const totalCount    = tableInstance.getFilteredRowModel().rows.length

  /** Display title from meta.title, falling back to id. */
  const columnTitle = (columnId: string): string => {
    const col  = tableInstance.getColumn(columnId)
    const meta = col?.columnDef.meta as DataTableColumnMeta | undefined
    return meta?.title ?? columnId
  }

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {searchColumn && (
            <SearchInput
              placeholder={searchPlaceholder}
              value={(tableInstance.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
              onChange={(e) => tableInstance.getColumn(searchColumn)?.setFilterValue(e.target.value)}
              onClear={() => tableInstance.getColumn(searchColumn)?.setFilterValue("")}
              size="sm"
              className="w-64"
            />
          )}
          {toolbarLeft}
        </div>
        <div className="flex items-center gap-2">
          {toolbarRight}
          <DensityToggle value={density} onChange={setDensity} />
          {exportable && (
            <Button variant="outline" size="sm" onClick={() => exportToCsv(tableInstance.getFilteredRowModel().rows, userColumns, exportFilename)}>
              <DownloadIcon className="size-4 mr-1.5" />
              Export
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2Icon className="size-4 mr-1.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tableInstance.getAllColumns().filter((c) => c.getCanHide()).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {columnTitle(col.id)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bulk action bar */}
      {bulkActions && (
        <BulkActionBar
          selectedCount={selectedCount}
          selectedRows={selectedRows.map((r) => r.original)}
          actions={bulkActions}
          onClear={() => tableInstance.resetRowSelection()}
        />
      )}

      {/* Table — border-separate required for sticky cells to render borders correctly */}
      <DataTableShell>
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            {tableInstance.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-table-header-bg hover:bg-table-header-bg border-0">
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                  const { style, pinned, lastPinned } = getPinnedColumnStyles(meta, header.column as any)
                  const isInteractive = !header.isPlaceholder
                    && header.column.id !== "__actions"
                    && header.column.getCanSort()
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={style}
                      data-pinned={pinned || undefined}
                      data-last-col={lastPinned || undefined}
                      className={cn(
                        // Base header — every cell gets a bottom border
                        "border-b border-border",
                        // Pinned cells get a solid token background so scrolling content doesn't show through
                        "data-[pinned]:bg-table-header-bg",
                        // Divider between the pinned zone and the scrolling zone
                        "data-[last-col=left]:border-r data-[last-col=left]:border-border",
                        "data-[last-col=right]:border-l data-[last-col=right]:border-border",
                        isInteractive && "hover:bg-table-header-hover transition-colors duration-100",
                        getHeaderClasses(meta),
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, i) => (
                <TableRow key={i} className="border-0">
                  {tableInstance.getVisibleLeafColumns().map((col) => {
                    const meta = col.columnDef.meta as DataTableColumnMeta | undefined
                    const { style, pinned, lastPinned } = getPinnedColumnStyles(meta, col as any)
                    return (
                      <TableCell
                        key={col.id}
                        style={style}
                        data-pinned={pinned || undefined}
                        data-last-col={lastPinned || undefined}
                        className={cn(
                          densityConfig[density].cell,
                          "border-b border-border",
                          "data-[pinned]:bg-background",
                          "data-[last-col=left]:border-r data-[last-col=left]:border-border",
                          "data-[last-col=right]:border-l data-[last-col=right]:border-border",
                        )}
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : tableInstance.getRowModel().rows?.length ? (
              tableInstance.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("border-0", onRowClick && "cursor-pointer")}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
                    const { style, pinned, lastPinned } = getPinnedColumnStyles(meta, cell.column as any)
                    const isSelected = row.getIsSelected()
                    return (
                      <TableCell
                        key={cell.id}
                        style={style}
                        data-pinned={pinned || undefined}
                        data-last-col={lastPinned || undefined}
                        className={cn(
                          densityConfig[density].cell,
                          "border-b border-border",
                          // Pinned cells pick up the row's background so scroll content doesn't bleed through.
                          // Selection tint is applied here too so pinned cells stay in sync.
                          "data-[pinned]:bg-background",
                          isSelected && "bg-table-row-selected data-[pinned]:bg-table-row-selected",
                          "data-[last-col=left]:border-r data-[last-col=left]:border-border",
                          "data-[last-col=right]:border-l data-[last-col=right]:border-border",
                          getCellClasses(meta),
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-0">
                <TableCell colSpan={columns.length} className="p-0 border-b border-border">
                  <EmptyState icon={FileTextIcon} heading="No results" description={emptyMessage} size="sm" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTableShell>

      {/* Pagination — outside the shell, under the table */}
      <PaginationBar
        pageIndex={tableInstance.getState().pagination.pageIndex}
        pageCount={tableInstance.getPageCount()}
        totalCount={totalCount}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        canPrevious={tableInstance.getCanPreviousPage()}
        canNext={tableInstance.getCanNextPage()}
        onFirst={() => tableInstance.setPageIndex(0)}
        onPrevious={() => tableInstance.previousPage()}
        onNext={() => tableInstance.nextPage()}
        onLast={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}
        onPageSizeChange={(n) => setPageSize(n)}
        onPageChange={(i) => tableInstance.setPageIndex(i)}
      />

    </div>
  )
}

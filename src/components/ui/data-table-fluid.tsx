"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DataTableFluid
//
// Use when:
//   - You have a small number of columns (2–6)
//   - The table should fill its container width naturally
//   - Column widths don't need to be exact
//   - Content can wrap if needed
//   - You don't need sticky/pinned columns
//
// Examples: summary tables on dashboards, simple member lists,
// recent activity feeds, order summaries.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Settings2Icon, DownloadIcon, MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  BulkAction,
  BulkActionBar,
  DensityOption,
  DensityToggle,
  PaginationBar,
  RowAction,
  densityConfig,
  exportToCsv,
} from "@/components/ui/data-table-core"
import { useDataTableDefaults } from "@/components/ui/data-table-provider"

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataTableFluidProps<TData> = {
  // Core
  data: TData[]
  columns: ColumnDef<TData, any>[]

  // Search & filters
  searchColumn?: string
  searchPlaceholder?: string
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode

  // Pagination
  defaultPageSize?: number
  pageSizeOptions?: number[]

  // Row interactions
  onRowClick?: (row: TData) => void
  rowActions?: RowAction<TData>[]

  // Bulk actions
  bulkActions?: BulkAction<TData>[]

  // Features
  exportable?: boolean
  exportFilename?: string
  loading?: boolean
  loadingRows?: number

  // Empty state
  emptyMessage?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTableFluid<TData>({
  data,
  columns: userColumns,
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
}: DataTableFluidProps<TData>) {

  // Merge provider defaults with any props passed directly to this table
  const config = useDataTableDefaults({
    defaultPageSize,
    pageSizeOptions,
    exportable,
    exportFilename,
    loading,
    loadingRows,
    emptyMessage,
  })

  defaultPageSize = config.defaultPageSize
  pageSizeOptions = config.pageSizeOptions
  exportable      = config.exportable
  exportFilename  = config.exportFilename
  loading         = config.loading
  loadingRows     = config.loadingRows
  emptyMessage    = config.emptyMessage

  const [sorting, setSorting]                   = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]       = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection]         = React.useState({})
  const [pageSize, setPageSize]                 = React.useState(defaultPageSize)
  const [density, setDensity]                   = React.useState<DensityOption>("default")

  // Append row actions column if provided
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
        enableHiding: false,
      })
    }
    return cols
  }, [userColumns, rowActions])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: true,
    enableMultiSort: true,
    onRowSelectionChange:     setRowSelection,
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel:          getCoreRowModel(),
    getSortedRowModel:        getSortedRowModel(),
    getFilteredRowModel:      getFilteredRowModel(),
    getPaginationRowModel:    getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
      sorting: (() => {
        const firstSortable = columns.find((c) =>
          c.enableSorting !== false && ((c as any).accessorKey || (c as any).id)
        )
        const id = (firstSortable as any)?.accessorKey ?? (firstSortable as any)?.id
        return id ? [{ id, desc: true }] : []
      })(),
    },
  })

  React.useEffect(() => { table.setPageSize(pageSize) }, [pageSize, table])

  const selectedRows  = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const totalCount    = table.getFilteredRowModel().rows.length

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {searchColumn && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
              size="sm"
              className="w-52"
            />
          )}
          {toolbarLeft}
        </div>
        <div className="flex items-center gap-2">
          {toolbarRight}
          <DensityToggle value={density} onChange={setDensity} />
          {exportable && (
            <Button variant="outline" size="sm" onClick={() => exportToCsv(table.getFilteredRowModel().rows, userColumns, exportFilename)}>
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
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns().filter((c) => c.getCanHide()).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {col.id}
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
          onClear={() => table.resetRowSelection()}
        />
      )}

      {/* Table — fluid fills container, no fixed widths.
          Uses raw <table> tag to avoid shadcn Table's overflow-x-auto wrapper
          which breaks page-level sticky headers */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-table-header-bg hover:bg-table-header-bg">
                {hg.headers.map((header) => {
                  const isInteractive = !header.isPlaceholder
                    && header.column.id !== "__actions"
                    && (header.column.getCanSort() || header.column.getCanResize())
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(isInteractive && "hover:bg-table-header-hover transition-colors duration-100")}
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
                <TableRow key={i}>
                  {table.getVisibleLeafColumns().map((col) => (
                    <TableCell key={col.id} className={densityConfig[density].cell}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-table-row-hover",
                    row.getIsSelected() && "bg-table-row-selected",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={densityConfig[density].cell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationBar
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        totalCount={totalCount}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        canPrevious={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        onFirst={() => table.setPageIndex(0)}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
        onLast={() => table.setPageIndex(table.getPageCount() - 1)}
        onPageSizeChange={(n) => setPageSize(n)}
      />

    </div>
  )
}

"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DataTableFixed
//
// Use when:
//   - You have many columns
//   - You need sticky (pinned) columns
//   - You want predictable column widths that never shrink
//   - Content should truncate rather than wrap
//   - You need column resizing
//
// Columns should have explicit `size` values defined.
// The table scrolls horizontally when content exceeds the container width.
// Sticky columns use TanStack's column pinning API (column.getStart / getAfter).
// Column reordering uses @dnd-kit — drag headers left/right to reorder.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnResizeMode,
  ExpandedState,
  Header,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  Settings2Icon,
} from "lucide-react"

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

export type StickyColumns = {
  start?: number  // pin N columns on the left
  end?: number    // pin N columns on the right
}

export type DataTableFixedProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  searchColumn?: string
  searchPlaceholder?: string
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  stickyHeader?: boolean
  stickyColumns?: StickyColumns
  maxHeight?: string
  resizable?: boolean
  reorderable?: boolean
  defaultPageSize?: number
  pageSizeOptions?: number[]
  onRowClick?: (row: TData) => void
  rowActions?: RowAction<TData>[]
  expandedContent?: (row: TData) => React.ReactNode
  bulkActions?: BulkAction<TData>[]
  exportable?: boolean
  exportFilename?: string
  loading?: boolean
  loadingRows?: number
  emptyMessage?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Returns sticky positioning styles for pinned columns using TanStack's API.
// column.getStart() / column.getAfter() calculate the correct pixel offsets.
function getPinnedStyles<TData>(column: Column<TData>): React.CSSProperties {
  const isPinned = column.getIsPinned()
  if (!isPinned) return {}
  return {
    position: "sticky",
    left:  isPinned === "left"  ? `${column.getStart("left")}px`  : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: "var(--z-sticky)",
  }
}

// Extracts a column's ID from its definition (accessorKey takes priority over id)
function getColumnId(col: ColumnDef<any, any>): string {
  return (col as any).accessorKey ?? (col as any).id ?? ""
}

// These columns are never draggable — they always stay in position
const FIXED_COLUMN_IDS = new Set(["select", "__actions"])

// ─── DraggableTableHead ───────────────────────────────────────────────────────
//
// Interaction model (matches HubSpot/Notion pattern):
//   - Hover the cell   → subtle bg highlight shows column boundary
//   - Drag the cell    → reorders the column (8px movement threshold)
//   - Click the cell   → sort (click registers before drag threshold)
//   - Drag right edge  → resizes the column width
//
// No grip icon — the whole header is the drag target.

function DraggableTableHead<TData>({
  header,
  reorderable,
  resizable,
  children,
  className,
  style,
}: {
  header: Header<TData, unknown>
  reorderable: boolean
  resizable: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const isPinned      = header.column.getIsPinned()
  const isFixed       = FIXED_COLUMN_IDS.has(header.id)
  const canDrag       = reorderable && !isPinned && !isFixed
  const canSort       = header.column.getCanSort()
  const canResize     = header.column.getCanResize() && resizable
  const isInteractive = canDrag || canSort || canResize

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: header.id, disabled: !canDrag })

  return (
    <TableHead
      ref={setNodeRef}
      // suppressHydrationWarning — dnd-kit generates unique aria-describedby IDs
      // on the client that differ from the server render. Intentional for dnd-kit in Next.js.
      suppressHydrationWarning
      className={cn(
        className,
        "group/th select-none",
        isInteractive && "hover:bg-table-header-hover transition-colors duration-100",
        isDragging && "opacity-50 bg-table-header-hover",
      )}
      style={{
        ...style,
        transform:  CSS.Transform.toString(transform),
        transition,
        cursor: canDrag
          ? isDragging ? "grabbing" : "grab"
          : undefined,
      }}
      {...(canDrag ? { ...attributes, ...listeners } : {})}
    >
      {/* Column content */}
      <div className="flex items-center gap-1.5 pr-1">
        {children}
      </div>

      {/* Right edge — resizes this column, visible on cell hover or when resizing */}
      {resizable && header.column.getCanResize() && (
        <div
          onMouseDown={(e) => { e.stopPropagation(); header.getResizeHandler()(e) }}
          onTouchStart={(e) => { e.stopPropagation(); header.getResizeHandler()(e) }}
          className={cn(
            "absolute right-0 top-0 h-full w-2",
            "opacity-0 group-hover/th:opacity-100 hover:opacity-100",
            "hover:bg-table-header-resize/70 group-hover/th:bg-table-header-resize/30",
            "cursor-col-resize select-none touch-none transition-opacity duration-150",
            header.column.getIsResizing() && "opacity-100 bg-table-header-resize",
          )}
        />
      )}
    </TableHead>
  )
}

// ─── DataTableFixed ───────────────────────────────────────────────────────────

export function DataTableFixed<TData>({
  data,
  columns: userColumns,
  searchColumn,
  searchPlaceholder = "Search…",
  toolbarLeft,
  toolbarRight,
  stickyHeader = false,
  stickyColumns,
  maxHeight,
  resizable    = false,
  reorderable  = true,
  defaultPageSize = 8,
  pageSizeOptions = [5, 8, 10, 20],
  onRowClick,
  rowActions,
  expandedContent,
  bulkActions,
  exportable     = false,
  exportFilename = "export",
  loading        = false,
  loadingRows    = 8,
  emptyMessage   = "No results found.",
}: DataTableFixedProps<TData>) {

  // Resolve config — props take priority over provider defaults
  const config = useDataTableDefaults({
    stickyHeader, stickyColumns, maxHeight, resizable,
    defaultPageSize, pageSizeOptions, exportable, exportFilename,
    loading, loadingRows, emptyMessage,
  })
  const resolvedStickyHeader  = config.stickyHeader
  const resolvedStickyColumns = config.stickyColumns
  const resolvedMaxHeight     = config.maxHeight
  const resolvedResizable     = config.resizable
  const resolvedPageSize      = config.defaultPageSize
  const resolvedPageSizeOpts  = config.pageSizeOptions
  const resolvedExportable    = config.exportable
  const resolvedExportFile    = config.exportFilename
  const resolvedLoading       = config.loading
  const resolvedLoadingRows   = config.loadingRows
  const resolvedEmptyMessage  = config.emptyMessage

  // ── Column definitions ──────────────────────────────────────────────────────

  // Append row actions column when rowActions are provided
  const columns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (!rowActions?.length) return userColumns
    return [
      ...userColumns,
      {
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
        enableSorting:  false,
        enableHiding:   false,
        enableResizing: false,
        size: 48,
      },
    ]
  }, [userColumns, rowActions])

  // ── Derived state (no side effects) ────────────────────────────────────────

  // Column order — initialised once from column definitions
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => columns.map(getColumnId).filter(Boolean)
  )

  // Column pinning — derived directly from stickyColumns prop, no useEffect needed
  const columnPinning = React.useMemo<ColumnPinningState>(() => {
    if (!resolvedStickyColumns) return {}
    const ids   = columns.map(getColumnId).filter(Boolean)
    const left  = resolvedStickyColumns.start ? ids.slice(0, resolvedStickyColumns.start) : []
    const right = resolvedStickyColumns.end   ? ids.slice(-resolvedStickyColumns.end)      : []
    return { left, right }
  }, [columns, resolvedStickyColumns])

  // ── TanStack table instance ─────────────────────────────────────────────────

  const [sorting, setSorting]                   = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]       = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection]         = React.useState({})
  const [expanded, setExpanded]                 = React.useState<ExpandedState>({})
  const [pageSize, setPageSize]                 = React.useState(resolvedPageSize)
  const [density, setDensity]                   = React.useState<DensityOption>("default")
  const [columnResizeMode]                       = React.useState<ColumnResizeMode>("onChange")

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: resolvedResizable ? columnResizeMode : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,   // derived from props — read-only, no setter needed
      columnOrder,
      rowSelection,
      expanded,
    },
    enableRowSelection: true,
    enableMultiSort:    true,
    onRowSelectionChange:     setRowSelection,
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange:      setColumnOrder,
    onExpandedChange:         setExpanded,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel:   getExpandedRowModel(),
    initialState: {
      pagination: { pageSize: resolvedPageSize },
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

  // ── dnd-kit ─────────────────────────────────────────────────────────────────

  // Distance constraint: 8px move activates drag so clicks still register
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    setColumnOrder((prev) => {
      const from = prev.indexOf(active.id as string)
      const to   = prev.indexOf(over.id   as string)
      return arrayMove(prev, from, to)
    })
  }

  // ── Derived render values ───────────────────────────────────────────────────
  const selectedRows  = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const totalCount    = table.getFilteredRowModel().rows.length
  const allCols       = table.getVisibleLeafColumns()
  const headerIds     = table.getHeaderGroups()[0]?.headers.map((h) => h.id) ?? []

  // ── Render ──────────────────────────────────────────────────────────────────

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
          {resolvedExportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCsv(table.getFilteredRowModel().rows, userColumns, resolvedExportFile)}
            >
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

      {/* Table
          Uses a raw <table> tag rather than shadcn's <Table> wrapper.
          Shadcn's Table adds overflow-x-auto internally which breaks
          position:sticky on header cells. We control overflow here instead. */}
      {/* Table — pure CSS scroll shadows using background-attachment: local/scroll technique.
          The white covers hide the gradient when scrolled to the edge.
          The dark radial gradients create the shadow effect. */}
      <div className="rounded-lg border border-border">
        <div
          className={cn("overflow-x-auto", resolvedMaxHeight && "overflow-y-auto")}
          style={{
            ...(resolvedMaxHeight ? { maxHeight: resolvedMaxHeight } : {}),
            background: `
              linear-gradient(to right, var(--color-card) 20%, transparent) left center / 40px 100%,
              linear-gradient(to left,  var(--color-card) 20%, transparent) right center / 40px 100%,
              radial-gradient(farthest-side at 0 50%, hsl(var(--foreground) / 0.1), transparent) left center / 12px 100%,
              radial-gradient(farthest-side at 100% 50%, hsl(var(--foreground) / 0.1), transparent) right center / 12px 100%
            `,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "local, local, scroll, scroll",
          }}
        >
          {/* DndContext wraps the table element, not thead — dnd-kit renders
              an accessibility announcer <div> which would be invalid inside thead */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table
              className="w-full caption-bottom text-sm"
              style={{ tableLayout: "fixed", width: "100%", minWidth: table.getTotalSize() }}
            >
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="bg-table-header-bg hover:bg-table-header-bg">
                    <SortableContext items={headerIds} strategy={horizontalListSortingStrategy}>

                      {/* Expand toggle column — not draggable */}
                      {expandedContent && (
                        <TableHead
                          className={cn("w-10", resolvedStickyHeader && "sticky")}
                          style={resolvedStickyHeader
                            ? { top: "var(--sticky-top, 0px)", zIndex: "calc(var(--z-sticky) + 1)" }
                            : undefined}
                        />
                      )}

                      {hg.headers.map((header, index) => {
                        const isPinned = header.column.getIsPinned()
                        const isLast   = index === hg.headers.length - 1
                        return (
                          <DraggableTableHead
                            key={header.id}
                            header={header}
                            reorderable={reorderable}
                            resizable={resolvedResizable}
                            className={cn(
                              "relative truncate",
                              resolvedStickyHeader && "sticky",
                              isPinned ? "bg-table-header-sticky-bg" : "bg-table-header-bg"
                            )}
                            style={{
                              width: isLast ? undefined : header.getSize(),
                              top: resolvedStickyHeader ? "var(--sticky-top, 0px)" : undefined,
                              ...getPinnedStyles(header.column),
                              zIndex: resolvedStickyHeader
                                ? isPinned
                                  ? "calc(var(--z-sticky) + 2)"
                                  : "calc(var(--z-sticky) + 1)"
                                : isPinned
                                  ? "var(--z-sticky)"
                                  : undefined,
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </DraggableTableHead>
                        )
                      })}

                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {resolvedLoading ? (
                  Array.from({ length: resolvedLoadingRows }).map((_, i) => (
                    <TableRow key={i}>
                      {expandedContent && <TableCell className="w-10" />}
                      {allCols.map((col) => (
                        <TableCell key={col.id} className={densityConfig[density].cell}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "group hover:bg-table-row-hover",
                          row.getIsSelected() && "bg-table-row-selected",
                          onRowClick && "cursor-pointer"
                        )}
                        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      >
                        {expandedContent && (
                          <TableCell className={cn("w-10", densityConfig[density].cell)}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-6 p-0"
                              onClick={(e) => { e.stopPropagation(); row.toggleExpanded() }}
                            >
                              {row.getIsExpanded()
                                ? <ChevronDownIcon  className="size-3.5" />
                                : <ChevronRightIcon className="size-3.5" />}
                            </Button>
                          </TableCell>
                        )}
                        {row.getVisibleCells().map((cell, index) => {
                          const isPinned = cell.column.getIsPinned()
                          const isLast   = index === row.getVisibleCells().length - 1
                          return (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                "truncate relative",
                                densityConfig[density].cell,
                                isPinned && (row.getIsSelected()
                                ? "bg-table-row-selected"
                                : "bg-card group-hover:bg-table-row-hover"),
                              )}
                              style={{
                                ...getPinnedStyles(cell.column),
                                width: isLast ? undefined : cell.column.getSize(),
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          )
                        })}
                      </TableRow>

                      {expandedContent && row.getIsExpanded() && (
                        <TableRow className="hover:bg-transparent bg-table-row-expanded-bg">
                          <TableCell />
                          <TableCell colSpan={columns.length} className="py-3 px-4">
                            {expandedContent(row.original)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (expandedContent ? 1 : 0)}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {resolvedEmptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </DndContext>
        </div>
      </div>

      {/* Pagination */}
      <PaginationBar
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        totalCount={totalCount}
        pageSize={pageSize}
        pageSizeOptions={resolvedPageSizeOpts}
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

"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DataTableFixed
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
  start?: number
  end?: number
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

function getPinnedStyles<TData>(column: Column<TData>): React.CSSProperties {
  const isPinned = column.getIsPinned()
  if (!isPinned) return {}
  return {
    position: "sticky",
    left:   isPinned === "left"  ? `${column.getStart("left")}px`  : undefined,
    right:  isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: "calc(var(--z-sticky) + 1)",
  }
}

function getColumnId(col: ColumnDef<any, any>): string {
  return (col as any).accessorKey ?? (col as any).id ?? ""
}

const FIXED_COLUMN_IDS = new Set(["select", "__actions"])

// Width of the non-TanStack expand-button column (Tailwind w-10 = 2.5rem = 40px)
const EXPAND_COL_WIDTH = 40

// ─── DraggableTableHead ───────────────────────────────────────────────────────

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
      suppressHydrationWarning
      className={cn(
        className,
        "group/th select-none",
        isInteractive && "hover:bg-table-header-hover transition-colors duration-100",
        isDragging && "opacity-50 bg-table-header-hover",
      )}
      style={{
        ...style,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        transition,
        cursor: canDrag ? (isDragging ? "grabbing" : "grab") : undefined,
      }}
      {...(canDrag ? { ...attributes, ...listeners } : {})}
    >
      <div className="flex items-center gap-1.5 pr-1">
        {children}
      </div>
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
        size: 64,
      },
    ]
  }, [userColumns, rowActions])

  // ── Column order ────────────────────────────────────────────────────────────

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => columns.map(getColumnId).filter(Boolean)
  )

  // ── Column pinning ──────────────────────────────────────────────────────────

  const initialPinning = React.useMemo<ColumnPinningState>(() => {
    if (!resolvedStickyColumns) return {}
    const ids   = columns.map(getColumnId).filter(Boolean)
    const left  = resolvedStickyColumns.start ? ids.slice(0, resolvedStickyColumns.start) : []
    const right = resolvedStickyColumns.end   ? ids.slice(-resolvedStickyColumns.end)      : []
    return { left, right }
  }, [columns, resolvedStickyColumns])

  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(initialPinning)

  // ── TanStack table ──────────────────────────────────────────────────────────

  const [sorting, setSorting]                   = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]       = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection]         = React.useState({})
  const [expanded, setExpanded]                 = React.useState<ExpandedState>({})
  const [pageSize, setPageSize]                 = React.useState(resolvedPageSize)
  const [density, setDensity]                   = React.useState<DensityOption>("default")
  const [columnResizeMode]                       = React.useState<ColumnResizeMode>("onChange")

  const tableInstance = useReactTable({
    data,
    columns,
    columnResizeMode: resolvedResizable ? columnResizeMode : undefined,
    state: { sorting, columnFilters, columnVisibility, columnPinning, columnOrder, rowSelection, expanded },
    enableRowSelection: true,
    enableMultiSort:    true,
    onRowSelectionChange:     setRowSelection,
    onSortingChange:          setSorting,
    onColumnFiltersChange:    setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange:    setColumnPinning,
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

  React.useEffect(() => { tableInstance.setPageSize(pageSize) }, [pageSize, tableInstance])

  // ── dnd-kit ─────────────────────────────────────────────────────────────────

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

  const selectedRows  = tableInstance.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const totalCount    = tableInstance.getFilteredRowModel().rows.length
  const allCols       = tableInstance.getVisibleLeafColumns()
  const headerIds     = tableInstance.getHeaderGroups()[0]?.headers.map((h) => h.id) ?? []

  const hasLeftPin  = !!columnPinning.left?.length
  const hasRightPin = !!columnPinning.right?.length

  const leftShadowOffset  = tableInstance.getLeftTotalSize()  + (expandedContent ? EXPAND_COL_WIDTH : 0)
  const rightShadowOffset = tableInstance.getRightTotalSize()

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {searchColumn && (
            <Input
              placeholder={searchPlaceholder}
              value={(tableInstance.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
              onChange={(e) => tableInstance.getColumn(searchColumn)?.setFilterValue(e.target.value)}
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
              onClick={() => exportToCsv(tableInstance.getFilteredRowModel().rows, userColumns, resolvedExportFile)}
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
              {tableInstance.getAllColumns().filter((c) => c.getCanHide()).map((col) => (
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
          onClear={() => tableInstance.resetRowSelection()}
        />
      )}

      <div className="rounded-lg border border-border relative">

        {hasLeftPin && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 w-4"
            style={{
              left: leftShadowOffset,
              zIndex: 1,
              background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
            }}
          />
        )}

        {hasRightPin && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 w-4"
            style={{
              right: rightShadowOffset,
              zIndex: 1,
              background: "linear-gradient(to right, transparent, rgba(0,0,0,0.15))",
            }}
          />
        )}

        <div
          className={cn("overflow-x-auto", resolvedMaxHeight && "overflow-y-auto")}
          style={resolvedMaxHeight ? { maxHeight: resolvedMaxHeight } : undefined}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table
              className="w-full caption-bottom text-sm"
              style={{ tableLayout: "fixed", width: "100%", minWidth: tableInstance.getTotalSize() }}
            >
              <TableHeader>
                {tableInstance.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="bg-table-header-bg hover:bg-table-header-bg">
                    <SortableContext items={headerIds} strategy={horizontalListSortingStrategy}>

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
                ) : tableInstance.getRowModel().rows.length ? (
                  tableInstance.getRowModel().rows.map((row) => (
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
                                  : "bg-table-row-bg group-hover:bg-table-row-hover"),
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
        pageIndex={tableInstance.getState().pagination.pageIndex}
        pageCount={tableInstance.getPageCount()}
        totalCount={totalCount}
        pageSize={pageSize}
        pageSizeOptions={resolvedPageSizeOpts}
        canPrevious={tableInstance.getCanPreviousPage()}
        canNext={tableInstance.getCanNextPage()}
        onFirst={() => tableInstance.setPageIndex(0)}
        onPrevious={() => tableInstance.previousPage()}
        onNext={() => tableInstance.nextPage()}
        onLast={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}
        onPageSizeChange={(n) => setPageSize(n)}
      />

    </div>
  )
}

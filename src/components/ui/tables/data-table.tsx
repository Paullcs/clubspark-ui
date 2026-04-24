"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DataTable
//
// Default admin data table. Fluid width, no internal scroll, no pinned cols.
// Built entirely from library primitives.
//
// Styling contract:
//   - Column defs pass data + `meta` only. Zero className at call sites.
//   - Headers use <DataTableColumnHeader>.
//   - Cells get classes from density + meta via getCellClasses.
//   - Outer border comes from <DataTableShell> (single point of edit).
//
// Feature flags (all optional):
//   searchColumn   → toolbar search (SearchInput)
//   exportable     → CSV export button
//   rowActions     → "..." menu per row
//   bulkActions    → bulk action bar when rows selected
//   sortable       → draggable rows via dnd-kit. Disables column sort.
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
  Row as TanstackRow,
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  Settings2Icon,
  DownloadIcon,
  MoreHorizontalIcon,
  FileTextIcon,
  GripVerticalIcon,
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
} from "@/components/ui/tables/data-table-core"

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataTableProps<TData> = {
  data:    TData[]
  columns: ColumnDef<TData, any>[]

  /** Required if `sortable` is true — used as the unique key for each row. */
  getRowId?: (row: TData) => string

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

  /** Enable drag-to-reorder rows. Column sort is disabled when true. */
  sortable?:   boolean
  /** Called with the reordered array when a drag ends. */
  onReorder?:  (rows: TData[]) => void
}

// ─── Sortable row wrapper (only used when sortable=true) ─────────────────────

function SortableTableRow<TData>({
  row,
  rowId,
  children,
  onClick,
  selected,
  className,
}: {
  row:        TanstackRow<TData>
  rowId:      string
  children:   (args: { handleAttributes: any; handleListeners: any }) => React.ReactNode
  onClick?:   () => void
  selected?:  boolean
  className?: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rowId })

  // Translate only — not CSS.Transform.toString — to prevent column stretching.
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(0, ${transform.y}px, 0)`, transition }
    : { transition }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={selected ? "selected" : undefined}
      className={cn(isDragging && "relative z-10 bg-background shadow-cs-md", className)}
      onClick={onClick}
    >
      {children({ handleAttributes: attributes, handleListeners: listeners })}
    </TableRow>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<TData>({
  data,
  columns: userColumns,
  getRowId,
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
  sortable = false,
  onReorder,
}: DataTableProps<TData>) {

  const [sorting, setSorting]                   = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]       = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection]         = React.useState({})
  const [pageSize, setPageSize]                 = React.useState(defaultPageSize)
  const [density, setDensity]                   = React.useState<DensityOption>("default")

  // ── Compose columns: optional drag handle + user columns + optional row actions
  const columns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    const cols: ColumnDef<TData, any>[] = []

    // Drag handle column (sortable tables only)
    if (sortable) {
      cols.push({
        id: "__drag",
        header: () => null,
        cell: () => null, // cell rendered inline below so it can receive dnd-kit props
        enableSorting: false,
        enableHiding:  false,
        meta: { title: "Drag", width: 36, align: "center" },
      })
    }

    cols.push(...userColumns)

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
        meta: { title: "Actions", width: 44, align: "center" },
      })
    }
    return cols
  }, [userColumns, rowActions, sortable])

  const tableInstance = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: true,
    enableMultiSort:    !sortable,   // column sort disabled in drag mode
    enableSorting:      !sortable,
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

  // ── dnd-kit sensors (only instantiated when sortable)
  const sensors = useSensors(
    useSensor(MouseSensor,    { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,    { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    if (!getRowId) {
      console.warn("[DataTable] sortable=true requires getRowId")
      return
    }
    const oldIndex = data.findIndex((r) => getRowId(r) === active.id)
    const newIndex = data.findIndex((r) => getRowId(r) === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const next = arrayMove(data, oldIndex, newIndex)
    onReorder?.(next)
  }, [data, getRowId, onReorder])

  /** Resolve a display title for a column — prefers meta.title, falls back to id. */
  const columnTitle = (columnId: string): string => {
    const col  = tableInstance.getColumn(columnId)
    const meta = col?.columnDef.meta as DataTableColumnMeta | undefined
    return meta?.title ?? columnId
  }

  const rowIds = sortable && getRowId ? data.map(getRowId) : []

  // ─── Body content (reused whether sortable or not) ─────────────────────────

  const renderBody = () => {
    if (loading) {
      return Array.from({ length: loadingRows }).map((_, i) => (
        <TableRow key={i}>
          {tableInstance.getVisibleLeafColumns().map((col) => (
            <TableCell key={col.id} className={densityConfig[density].cell}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))
    }

    const rows = tableInstance.getRowModel().rows
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="p-0">
            <EmptyState icon={FileTextIcon} heading="No results" description={emptyMessage} size="sm" />
          </TableCell>
        </TableRow>
      )
    }

    return rows.map((row) => {
      const rowId = getRowId ? getRowId(row.original) : row.id
      const renderCells = (handleAttributes?: any, handleListeners?: any) =>
        row.getVisibleCells().map((cell) => {
          const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
          return (
            <TableCell
              key={cell.id}
              style={{
                width:    meta?.width,
                minWidth: meta?.minWidth,
                maxWidth: meta?.maxWidth,
              }}
              className={cn(densityConfig[density].cell, getCellClasses(meta))}
            >
              {cell.column.id === "__drag" ? (
                <button
                  type="button"
                  {...(handleAttributes ?? {})}
                  {...(handleListeners ?? {})}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted cursor-grab active:cursor-grabbing"
                  aria-label="Drag row to reorder"
                >
                  <GripVerticalIcon className="size-4" />
                </button>
              ) : (
                flexRender(cell.column.columnDef.cell, cell.getContext())
              )}
            </TableCell>
          )
        })

      if (sortable) {
        return (
          <SortableTableRow
            key={rowId}
            row={row}
            rowId={rowId}
            selected={row.getIsSelected()}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            className={cn(onRowClick && "cursor-pointer")}
          >
            {({ handleAttributes, handleListeners }) =>
              renderCells(handleAttributes, handleListeners)
            }
          </SortableTableRow>
        )
      }

      return (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          className={cn(onRowClick && "cursor-pointer")}
          onClick={onRowClick ? () => onRowClick(row.original) : undefined}
        >
          {renderCells()}
        </TableRow>
      )
    })
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const tableBlock = (
    <Table>
      <TableHeader>
        {tableInstance.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id} className="bg-table-header-bg hover:bg-table-header-bg">
            {hg.headers.map((header) => {
              const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined
              const isInteractive = !header.isPlaceholder
                && header.column.id !== "__actions"
                && header.column.id !== "__drag"
                && header.column.getCanSort()
              return (
                <TableHead
                  key={header.id}
                  style={{
                    width:    meta?.width,
                    minWidth: meta?.minWidth,
                    maxWidth: meta?.maxWidth,
                  }}
                  className={cn(
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
      <TableBody>{renderBody()}</TableBody>
    </Table>
  )

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

      {/* Table (wrapped in DndContext when sortable) */}
      <DataTableShell>
        {sortable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
              {tableBlock}
            </SortableContext>
          </DndContext>
        ) : (
          tableBlock
        )}
      </DataTableShell>

      {/* Pagination */}
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

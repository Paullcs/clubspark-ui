"use client"

import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { GripVerticalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataTableSortableProps<TData extends { id: string }> = {
  data:            TData[]
  columns:         ColumnDef<TData>[]
  onOrderChange?:  (newData: TData[]) => void
  className?:      string
  fixed?:          boolean
}

// ─── Drag handle cell ─────────────────────────────────────────────────────────

export function DragHandle({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({ id: rowId })
  return (
    <button
      {...attributes}
      {...listeners}
      suppressHydrationWarning
      className="flex items-center justify-center size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      aria-label="Drag to reorder"
      type="button"
    >
      <GripVerticalIcon className="size-4" />
    </button>
  )
}

// ─── Sortable row ─────────────────────────────────────────────────────────────

function SortableRow<TData extends { id: string }>({
  row,
  onClick,
}: {
  row:      Row<TData>
  onClick?: (row: TData) => void
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform ? { ...transform, scaleY: 1 } : null),
    transition,
    opacity:   isDragging ? 0.6 : 1,
    zIndex:    isDragging ? 1 : undefined,
    position:  isDragging ? "relative" : undefined,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onClick?.(row.original)}
      className={cn(
        "border-b border-border transition-colors",
        "hover:bg-table-row-hover",
        onClick && "cursor-pointer",
        isDragging && "bg-muted shadow-cs-md",
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="px-3 py-2.5 text-sm"
          style={cell.column.columnDef.size ? { width: cell.column.getSize() } : undefined}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}

// ─── DataTableSortable ────────────────────────────────────────────────────────

export function DataTableSortable<TData extends { id: string }>({
  data:           initialData,
  columns,
  onOrderChange,
  className,
  fixed = false,
}: DataTableSortableProps<TData>) {

  const [data, setData] = React.useState<TData[]>(initialData)

  React.useEffect(() => { setData(initialData) }, [initialData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setData((prev) => {
      const oldIndex = prev.findIndex((r) => r.id === active.id)
      const newIndex = prev.findIndex((r) => r.id === over.id)
      const next = arrayMove(prev, oldIndex, newIndex)
      onOrderChange?.(next)
      return next
    })
  }

  const rowIds = data.map((r) => r.id)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("w-full rounded-lg border border-border overflow-hidden", className)}>
        <div className={cn(fixed && "overflow-x-auto")}>
          <table className={cn("w-full text-sm border-collapse", fixed && "table-fixed")}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border bg-table-header-bg">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-2.5 text-left font-medium text-muted-foreground"
                      style={header.column.columnDef.size ? { width: header.getSize() } : undefined}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </div>
      </div>
    </DndContext>
  )
}

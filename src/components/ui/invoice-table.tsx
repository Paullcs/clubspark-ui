"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table, TableBody, TableCell, TableFooter,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/tables/table"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceLineItem {
  id:          string | number
  name:        string
  description?: string
  sku?:        string
  qty:         number
  unitPrice:   string
  total:       string
}

export interface InvoiceSummaryRow {
  label:  string
  amount: string
  bold?:  boolean
}

export interface InvoiceTableProps {
  items:    InvoiceLineItem[]
  summary:  InvoiceSummaryRow[]
  className?: string
}

type ColumnMeta = {
  headerClassName?: string
  cellClassName?:   string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InvoiceTable({ items, summary, className }: InvoiceTableProps) {

  const columns: ColumnDef<InvoiceLineItem>[] = [
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="text-sm">
            <div className="font-semibold text-foreground">{item.name}</div>
            {item.description && <div className="mt-1 text-muted-foreground">{item.description}</div>}
            {item.sku && <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">SKU: {item.sku}</div>}
          </div>
        )
      },
      meta: {
        headerClassName: "py-3.5 text-left text-sm font-semibold text-foreground h-auto",
        cellClassName:   "w-full py-5 pr-3 align-top text-sm text-foreground",
      },
    },
    {
      accessorKey: "qty",
      header: "Qty",
      cell: ({ row }) => row.original.qty,
      meta: {
        headerClassName: "hidden px-3 py-3.5 text-right text-sm font-semibold text-foreground sm:table-cell h-auto",
        cellClassName:   "hidden px-3 py-5 text-right text-sm text-muted-foreground sm:table-cell",
      },
    },
    {
      accessorKey: "unitPrice",
      header: "Unit price",
      cell: ({ row }) => row.original.unitPrice,
      meta: {
        headerClassName: "hidden px-3 py-3.5 text-right text-sm font-semibold text-foreground sm:table-cell h-auto",
        cellClassName:   "hidden px-3 py-5 text-right text-sm text-muted-foreground sm:table-cell",
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => row.original.total,
      meta: {
        headerClassName: "py-3.5 pl-3 text-right text-sm font-semibold text-foreground h-auto",
        cellClassName:   "py-5 pl-3 text-right text-sm text-foreground",
      },
    },
  ]

  const tableInstance = useReactTable({
    data:            items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId:        (row) => String(row.id),
  })

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <Table className="min-w-full">
        <colgroup>
          <col className="w-full sm:w-1/2" />
          <col className="sm:w-1/6" />
          <col className="sm:w-1/6" />
          <col className="sm:w-1/6" />
        </colgroup>

        <TableHeader className="[&_tr]:border-border/60">
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const meta = (header.column.columnDef.meta as ColumnMeta) ?? {}
                return (
                  <TableHead
                    key={header.id}
                    className={cn("bg-transparent", meta.headerClassName)}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {tableInstance.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-border/60 hover:bg-transparent">
              {row.getVisibleCells().map((cell) => {
                const meta = (cell.column.columnDef.meta as ColumnMeta) ?? {}
                return (
                  <TableCell key={cell.id} className={cn(meta.cellClassName)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="border-0 bg-transparent font-normal">
          {summary.map((row, i) => (
            <TableRow key={i} className="border-0 hover:bg-transparent">
              <TableHead
                scope="row"
                colSpan={3}
                className={cn(
                  "hidden h-auto border-0 pt-4 pr-3 text-right text-sm sm:table-cell",
                  i === 0 && "pt-6",
                  row.bold ? "font-semibold text-foreground" : "font-normal text-muted-foreground"
                )}
              >
                {row.label}
              </TableHead>
              <TableHead
                scope="row"
                className={cn(
                  "h-auto border-0 pt-4 pr-3 text-left text-sm sm:hidden",
                  i === 0 && "pt-6",
                  row.bold ? "font-semibold text-foreground" : "font-normal text-muted-foreground"
                )}
              >
                {row.label}
              </TableHead>
              <TableCell className={cn(
                "border-0 pt-4 pl-3 text-right text-sm",
                i === 0 && "pt-6",
                row.bold ? "font-semibold text-foreground" : "text-foreground"
              )}>
                {row.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </div>
  )
}

"use client"

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
import {
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Settings2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ───────────────────────────────────────────────────────────────────

type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed"

type Booking = {
  id: string
  ref: string
  customer: string
  initials: string
  court: string
  date: string
  time: string
  duration: number
  status: BookingStatus
  amount: number
  paid: boolean
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const bookings: Booking[] = [
  { id: "1",  ref: "BK-3E83", customer: "Rob Thomas",      initials: "RT", court: "Court 1 Full",  date: "2026-03-28", time: "13:00", duration: 60,  status: "Confirmed",  amount: 12.00, paid: true  },
  { id: "2",  ref: "BK-3E84", customer: "Sarah Okafor",    initials: "SO", court: "Court 2 Half",  date: "2026-03-28", time: "14:00", duration: 60,  status: "Pending",    amount: 8.00,  paid: false },
  { id: "3",  ref: "BK-3E85", customer: "James Whittle",   initials: "JW", court: "Court 1 Full",  date: "2026-03-29", time: "09:00", duration: 90,  status: "Confirmed",  amount: 18.00, paid: true  },
  { id: "4",  ref: "BK-3E86", customer: "Priya Nair",      initials: "PN", court: "Court 3 Full",  date: "2026-03-29", time: "10:00", duration: 60,  status: "Cancelled",  amount: 0.00,  paid: false },
  { id: "5",  ref: "BK-3E87", customer: "Marcus Webb",     initials: "MW", court: "Court 2 Full",  date: "2026-03-29", time: "11:30", duration: 120, status: "Confirmed",  amount: 24.00, paid: true  },
  { id: "6",  ref: "BK-3E88", customer: "Yuki Tanaka",     initials: "YT", court: "Court 1 Half",  date: "2026-03-30", time: "08:00", duration: 60,  status: "Completed",  amount: 8.00,  paid: true  },
  { id: "7",  ref: "BK-3E89", customer: "Aisha Okonkwo",   initials: "AO", court: "Court 4 Full",  date: "2026-03-30", time: "15:00", duration: 60,  status: "Pending",    amount: 12.00, paid: false },
  { id: "8",  ref: "BK-3E90", customer: "Dan Sheridan",    initials: "DS", court: "Court 1 Full",  date: "2026-03-30", time: "17:00", duration: 90,  status: "Confirmed",  amount: 18.00, paid: true  },
  { id: "9",  ref: "BK-3E91", customer: "Fatima Al-Rawi",  initials: "FA", court: "Court 2 Full",  date: "2026-03-31", time: "10:00", duration: 60,  status: "Confirmed",  amount: 12.00, paid: true  },
  { id: "10", ref: "BK-3E92", customer: "Luke Brennan",    initials: "LB", court: "Court 3 Half",  date: "2026-03-31", time: "12:00", duration: 60,  status: "Cancelled",  amount: 0.00,  paid: false },
  { id: "11", ref: "BK-3E93", customer: "Chloe Marchetti", initials: "CM", court: "Court 1 Full",  date: "2026-04-01", time: "09:00", duration: 60,  status: "Confirmed",  amount: 12.00, paid: false },
  { id: "12", ref: "BK-3E94", customer: "Tom Adesanya",    initials: "TA", court: "Court 2 Half",  date: "2026-04-01", time: "11:00", duration: 90,  status: "Pending",    amount: 12.00, paid: false },
]

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
  const variantMap: Record<BookingStatus, "success" | "pending" | "destructive" | "active"> = {
    Confirmed: "success",
    Pending:   "pending",
    Cancelled: "destructive",
    Completed: "active",
  }
  return <Badge variant={variantMap[status]}>{status}</Badge>
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")  return <ArrowUpIcon   className="size-3.5 ml-1.5 shrink-0" />
  if (direction === "desc") return <ArrowDownIcon  className="size-3.5 ml-1.5 shrink-0" />
  return <ArrowUpDownIcon className="size-3.5 ml-1.5 shrink-0 opacity-40" />
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Booking>[] = [
  // Row selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  // Ref
  {
    accessorKey: "ref",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-medium uppercase tracking-wider"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ref <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.getValue("ref")}</span>
    ),
    size: 90,
  },
  // Customer
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-medium uppercase tracking-wider"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="xs">
          <AvatarFallback>{row.original.initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{row.getValue("customer")}</span>
      </div>
    ),
  },
  // Court
  {
    accessorKey: "court",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-medium uppercase tracking-wider"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Court <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => <span className="text-sm">{row.getValue("court")}</span>,
  },
  // Date
  {
    accessorKey: "date",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-medium uppercase tracking-wider"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return (
        <span className="text-sm">
          {date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      )
    },
  },
  // Time
  {
    accessorKey: "time",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Time</span>,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.getValue("time")}</span>
    ),
    enableSorting: false,
  },
  // Duration
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-medium uppercase tracking-wider"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Duration <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.getValue("duration")} min</span>
    ),
  },
  // Status
  {
    accessorKey: "status",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Status</span>,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  // Amount
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <button
        className="flex items-center text-xs font-medium uppercase tracking-wider ml-auto"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount <SortIcon direction={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return (
        <div className="text-right text-sm tabular-nums font-medium">
          {amount === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            `£${amount.toFixed(2)}`
          )}
        </div>
      )
    },
  },
  // Paid
  {
    accessorKey: "paid",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Paid</span>,
    cell: ({ row }) => {
      const paid = row.getValue("paid") as boolean
      const cancelled = row.original.status === "Cancelled"
      if (cancelled) return <span className="text-muted-foreground text-sm">—</span>
      return paid
        ? <Badge variant="success-solid">Paid</Badge>
        : <Badge variant="pending">Unpaid</Badge>
    },
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export function DataTableBookings() {
  const [sorting, setSorting]                 = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]     = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection]       = React.useState({})
  const [pageSize, setPageSize]               = React.useState(8)

  const table = useReactTable({
    data: bookings,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange:    setRowSelection,
    onSortingChange:         setSorting,
    onColumnFiltersChange:   setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel:         getCoreRowModel(),
    getSortedRowModel:       getSortedRowModel(),
    getFilteredRowModel:     getFilteredRowModel(),
    getPaginationRowModel:   getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  })

  // Keep pageSize in sync
  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount    = table.getFilteredRowModel().rows.length

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <Input
            placeholder="Search customer or ref…"
            value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("customer")?.setFilterValue(e.target.value)
            }
            size="sm"
            className="w-52"
          />
          {/* Status filter */}
          <Select
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(
                value === "all" ? undefined : [value]
              )
            }
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Selected count */}
          {selectedCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedCount} of {totalCount} selected
            </span>
          )}
          {/* Column visibility */}
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
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.getIsSelected() ? "bg-table-row-selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer — pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger size="sm" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 8, 10, 20].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          {" · "}{totalCount} bookings
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline" size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>

    </div>
  )
}

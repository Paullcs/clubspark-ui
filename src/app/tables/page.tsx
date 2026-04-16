"use client"

import { useState } from "react"
import { PreviewBar } from "@/components/ui/preview-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableFixed } from "@/components/ui/data-table-fixed"
import { DataTableFluid } from "@/components/ui/data-table-fluid"
import { DataTableProvider } from "@/components/ui/data-table-provider"
import { DataTableSortable, DragHandle } from "@/components/ui/data-table-sortable"
import { StickyTableHeader } from "@/components/ui/sticky-table-header"
import { SortIcon } from "@/components/ui/data-table-core"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

type DemoBooking = { id: string; ref: string; customer: string; initials: string; court: string; date: string; time: string; duration: number; status: "Confirmed" | "Pending" | "Cancelled" | "Completed"; amount: number; paid: boolean }
const demoBookings: DemoBooking[] = [
  { id: "1",  ref: "BK-3E83", customer: "Rob Thomas",      initials: "RT", court: "Court 1 Full", date: "2026-03-28", time: "13:00", duration: 60,  status: "Confirmed",  amount: 12, paid: true  },
  { id: "2",  ref: "BK-3E84", customer: "Sarah Okafor",    initials: "SO", court: "Court 2 Half", date: "2026-03-28", time: "14:00", duration: 60,  status: "Pending",    amount: 8,  paid: false },
  { id: "3",  ref: "BK-3E85", customer: "James Whittle",   initials: "JW", court: "Court 1 Full", date: "2026-03-29", time: "09:00", duration: 90,  status: "Confirmed",  amount: 18, paid: true  },
  { id: "4",  ref: "BK-3E86", customer: "Priya Nair",      initials: "PN", court: "Court 3 Full", date: "2026-03-29", time: "10:00", duration: 60,  status: "Cancelled",  amount: 0,  paid: false },
  { id: "5",  ref: "BK-3E87", customer: "Marcus Webb",     initials: "MW", court: "Court 2 Full", date: "2026-03-29", time: "11:30", duration: 120, status: "Confirmed",  amount: 24, paid: true  },
  { id: "6",  ref: "BK-3E88", customer: "Yuki Tanaka",     initials: "YT", court: "Court 1 Half", date: "2026-03-30", time: "08:00", duration: 60,  status: "Completed",  amount: 8,  paid: true  },
  { id: "7",  ref: "BK-3E89", customer: "Aisha Okonkwo",   initials: "AO", court: "Court 4 Full", date: "2026-03-30", time: "15:00", duration: 60,  status: "Pending",    amount: 12, paid: false },
  { id: "8",  ref: "BK-3E90", customer: "Dan Sheridan",    initials: "DS", court: "Court 1 Full", date: "2026-03-30", time: "17:00", duration: 90,  status: "Confirmed",  amount: 18, paid: true  },
  { id: "9",  ref: "BK-3E91", customer: "Fatima Al-Rawi",  initials: "FA", court: "Court 2 Full", date: "2026-03-31", time: "10:00", duration: 60,  status: "Confirmed",  amount: 12, paid: true  },
  { id: "10", ref: "BK-3E92", customer: "Luke Brennan",    initials: "LB", court: "Court 3 Half", date: "2026-03-31", time: "12:00", duration: 60,  status: "Cancelled",  amount: 0,  paid: false },
  { id: "11", ref: "BK-3E93", customer: "Chloe Marchetti", initials: "CM", court: "Court 1 Full", date: "2026-04-01", time: "09:00", duration: 60,  status: "Confirmed",  amount: 12, paid: false },
  { id: "12", ref: "BK-3E94", customer: "Tom Adesanya",    initials: "TA", court: "Court 2 Half", date: "2026-04-01", time: "11:00", duration: 90,  status: "Pending",    amount: 12, paid: false },
]

type DemoMember = { id: string; name: string; initials: string; membership: string; joined: string; status: "Active" | "Expired" | "Pending" }
const demoMembers: DemoMember[] = [
  { id: "1", name: "Rob Thomas",      initials: "RT", membership: "Full Member", joined: "Jan 2024", status: "Active"  },
  { id: "2", name: "Sarah Okafor",    initials: "SO", membership: "Junior",      joined: "Mar 2024", status: "Active"  },
  { id: "3", name: "James Whittle",   initials: "JW", membership: "Full Member", joined: "Aug 2023", status: "Expired" },
  { id: "4", name: "Priya Nair",      initials: "PN", membership: "Social",      joined: "Nov 2023", status: "Active"  },
  { id: "5", name: "Marcus Webb",     initials: "MW", membership: "Full Member", joined: "Feb 2025", status: "Pending" },
  { id: "6", name: "Yuki Tanaka",     initials: "YT", membership: "Family",      joined: "Apr 2023", status: "Active"  },
  { id: "7", name: "Aisha Okonkwo",   initials: "AO", membership: "Junior",      joined: "Sep 2024", status: "Active"  },
  { id: "8", name: "Dan Sheridan",    initials: "DS", membership: "Full Member", joined: "Jun 2022", status: "Expired" },
]

type DemoCourt = { id: string; name: string; surface: string; sport: string; status: "Active" | "Inactive" | "Maintenance" }
const demoCourts: DemoCourt[] = [
  { id: "1", name: "Court 1", surface: "Hard",  sport: "Tennis",     status: "Active"      },
  { id: "2", name: "Court 2", surface: "Clay",  sport: "Tennis",     status: "Active"      },
  { id: "3", name: "Court 3", surface: "Hard",  sport: "Padel",      status: "Active"      },
  { id: "4", name: "Court 4", surface: "Grass", sport: "Tennis",     status: "Maintenance" },
  { id: "5", name: "Court 5", surface: "Hard",  sport: "Pickleball", status: "Inactive"    },
]

const fixedColumns: ColumnDef<DemoBooking>[] = [
  { id: "select", header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} aria-label="Select all" />, cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" onClick={(e) => e.stopPropagation()} />, enableSorting: false, enableHiding: false, size: 40 },
  { accessorKey: "ref", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Ref <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("ref")}</span>, size: 90 },
  { accessorKey: "customer", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Customer <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => (<div className="flex items-center gap-2.5"><Avatar size="xs"><AvatarFallback>{row.original.initials}</AvatarFallback></Avatar><span className="font-medium text-sm">{row.getValue("customer")}</span></div>), size: 180 },
  { accessorKey: "court", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Court <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => <span className="text-sm">{row.getValue("court")}</span>, size: 130 },
  { accessorKey: "date", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => <span className="text-sm">{new Date(row.getValue("date")).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>, size: 120 },
  { accessorKey: "time", header: () => <span className="text-xs font-medium uppercase tracking-wider">Time</span>, cell: ({ row }) => <span className="text-sm tabular-nums">{row.getValue("time")}</span>, size: 70, enableSorting: false },
  { accessorKey: "status", header: () => <span className="text-xs font-medium uppercase tracking-wider">Status</span>, cell: ({ row }) => { const s = row.getValue("status") as DemoBooking["status"]; const v = { Confirmed: "success", Pending: "pending", Cancelled: "destructive", Completed: "active" } as const; return <Badge variant={v[s]}>{s}</Badge> }, size: 110 },
  { accessorKey: "amount", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider ml-auto" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Amount <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => { const a = row.getValue("amount") as number; return <div className="text-right text-sm tabular-nums font-medium">{a === 0 ? <span className="text-muted-foreground">—</span> : `£${a.toFixed(2)}`}</div> }, size: 90 },
  { accessorKey: "paid", header: () => <span className="text-xs font-medium uppercase tracking-wider">Paid</span>, cell: ({ row }) => { if (row.original.status === "Cancelled") return <span className="text-muted-foreground text-sm">—</span>; return row.getValue("paid") ? <Badge variant="success-solid">Paid</Badge> : <Badge variant="pending">Unpaid</Badge> }, size: 80 },
]

const fluidColumns: ColumnDef<DemoMember>[] = [
  { accessorKey: "name", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Member <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => (<div className="flex items-center gap-2.5"><Avatar size="xs"><AvatarFallback>{row.original.initials}</AvatarFallback></Avatar><span className="font-medium text-sm">{row.getValue("name")}</span></div>) },
  { accessorKey: "membership", header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Membership <SortIcon direction={column.getIsSorted()} /></button>, cell: ({ row }) => <span className="text-sm">{row.getValue("membership")}</span> },
  { accessorKey: "joined", header: () => <span className="text-xs font-medium uppercase tracking-wider">Joined</span>, cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("joined")}</span>, enableSorting: false },
  { accessorKey: "status", header: () => <span className="text-xs font-medium uppercase tracking-wider">Status</span>, cell: ({ row }) => { const s = row.getValue("status") as DemoMember["status"]; const v = { Active: "success", Expired: "destructive", Pending: "pending" } as const; return <Badge variant={v[s]}>{s}</Badge> }, enableSorting: false },
]

const sortableColumns: ColumnDef<DemoCourt>[] = [
  { id: "drag", header: () => null, cell: ({ row }) => <DragHandle rowId={row.original.id} />, size: 44 },
  { accessorKey: "name", header: () => <span className="text-xs font-medium uppercase tracking-wider">Court</span>, cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("name")}</span> },
  { accessorKey: "surface", header: () => <span className="text-xs font-medium uppercase tracking-wider">Surface</span>, cell: ({ row }) => <span className="text-sm">{row.getValue("surface")}</span> },
  { accessorKey: "sport", header: () => <span className="text-xs font-medium uppercase tracking-wider">Sport</span>, cell: ({ row }) => <span className="text-sm">{row.getValue("sport")}</span> },
  { accessorKey: "status", header: () => <span className="text-xs font-medium uppercase tracking-wider">Status</span>, cell: ({ row }) => { const s = row.getValue("status") as DemoCourt["status"]; const v = { Active: "success", Inactive: "neutral-subtle", Maintenance: "warning" } as const; return <Badge variant={v[s]}>{s}</Badge> } },
]

export default function TablesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <PreviewBar activePage="tables" />
      <div className="max-w-5xl mx-auto px-8 py-10">

        <Section title="Table" description="Basic HTML table for simple structured data.">
          <Row label="Default">
            <Table>
              <TableCaption>Recent bookings — Court 1</TableCaption>
              <TableHeader><TableRow><TableHead>Ref</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {[
                  { ref: "BK-3E83", customer: "Rob Thomas",    date: "28 Mar 2026", time: "13:00–14:00", status: "Confirmed", amount: "£12.00" },
                  { ref: "BK-3E84", customer: "Sarah Okafor",  date: "28 Mar 2026", time: "14:00–15:00", status: "Pending",   amount: "£12.00" },
                  { ref: "BK-3E85", customer: "James Whittle", date: "29 Mar 2026", time: "09:00–10:00", status: "Confirmed", amount: "£12.00" },
                  { ref: "BK-3E86", customer: "Priya Nair",    date: "29 Mar 2026", time: "10:00–11:00", status: "Cancelled", amount: "£0.00"  },
                ].map((row) => (
                  <TableRow key={row.ref}>
                    <TableCell className="font-mono text-xs">{row.ref}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell><Badge variant={row.status === "Confirmed" ? "success" : row.status === "Pending" ? "pending" : "destructive"}>{row.status}</Badge></TableCell>
                    <TableCell className="text-right">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Row>
        </Section>

        <Section title="DataTableFixed" description="Fixed column widths, sticky header, pinned columns, horizontal scroll, resizing.">
          <Row label="Bookings — sticky header, pinned columns, bulk actions, export">
            <div className="w-full">
              <DataTableProvider defaults={{ resizable: true, stickyHeader: true, maxHeight: "480px", stickyColumns: { start: 2, end: 1 } }}>
                <DataTableFixed
                  data={demoBookings} columns={fixedColumns} searchColumn="customer" searchPlaceholder="Search customer…"
                  stickyHeader maxHeight="480px" stickyColumns={{ start: 2, end: 1 }} resizable exportable exportFilename="bookings" defaultPageSize={8}
                  onRowClick={(row: DemoBooking) => toast(`Clicked: ${row.ref}`)}
                  rowActions={[
                    { label: "View booking",   onClick: (r: DemoBooking) => toast.info(`Viewing ${r.ref}`) },
                    { label: "Edit booking",   onClick: (r: DemoBooking) => toast(`Editing ${r.ref}`) },
                    { label: "Cancel booking", onClick: (r: DemoBooking) => toast.error(`${r.ref} cancelled`), variant: "destructive" },
                  ]}
                  bulkActions={[
                    { label: "Export selected", variant: "outline",     onClick: (rows: DemoBooking[]) => toast(`Exporting ${rows.length} rows`) },
                    { label: "Cancel selected", variant: "destructive", onClick: (rows: DemoBooking[]) => toast.error(`${rows.length} bookings cancelled`) },
                  ]}
                  emptyMessage="No bookings found."
                />
              </DataTableProvider>
            </div>
          </Row>
        </Section>

        <Section title="DataTableFluid" description="Fills container width, columns share available space.">
          <Row label="Members — fluid columns, row actions, export">
            <div className="w-full">
              <StickyTableHeader topOffset="65px">
                <DataTableFluid
                  data={demoMembers} columns={fluidColumns} searchColumn="name" searchPlaceholder="Search member…"
                  exportable exportFilename="members" defaultPageSize={8}
                  onRowClick={(row: DemoMember) => toast(`Clicked: ${row.name}`)}
                  rowActions={[
                    { label: "View profile",    onClick: (r: DemoMember) => toast.info(`Viewing ${r.name}`) },
                    { label: "Edit membership", onClick: (r: DemoMember) => toast(`Editing ${r.name}`) },
                    { label: "Remove member",   onClick: (r: DemoMember) => toast.error(`${r.name} removed`), variant: "destructive" },
                  ]}
                  emptyMessage="No members found."
                />
              </StickyTableHeader>
            </div>
          </Row>
        </Section>

        <Section title="DataTableSortable" description="Drag to manually reorder rows.">
          <Row label="Courts — drag to reorder">
            <div className="w-full max-w-2xl">
              <DataTableSortable
                data={demoCourts}
                columns={sortableColumns}
                onOrderChange={(rows) => toast.success(`Order saved: ${rows.map(r => r.name).join(", ")}`)}
              />
            </div>
          </Row>
        </Section>

      </div>
    </div>
  )
}

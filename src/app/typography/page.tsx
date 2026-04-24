"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tables/table"
import { DataTable } from "@/components/ui/tables/data-table"
import {
  DataTableColumnHeader,
  TableAvatarCell,
} from "@/components/ui/tables/data-table-core"
import { InvoiceTable } from "@/components/ui/tables/invoice-table"

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
      <p className="text-xs font-medium text-muted-foreground uppercase mb-3">{label}</p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

type DemoMember = {
  id:         string
  name:       string
  initials:   string
  membership: string
  joined:     string
  status:     "Active" | "Expired" | "Pending"
}

const demoMembers: DemoMember[] = [
  { id: "1", name: "Rob Thomas",    initials: "RT", membership: "Full Member", joined: "Jan 2024", status: "Active"  },
  { id: "2", name: "Sarah Okafor",  initials: "SO", membership: "Junior",      joined: "Mar 2024", status: "Active"  },
  { id: "3", name: "James Whittle", initials: "JW", membership: "Full Member", joined: "Aug 2023", status: "Expired" },
  { id: "4", name: "Priya Nair",    initials: "PN", membership: "Social",      joined: "Nov 2023", status: "Active"  },
  { id: "5", name: "Marcus Webb",   initials: "MW", membership: "Full Member", joined: "Feb 2025", status: "Pending" },
  { id: "6", name: "Yuki Tanaka",   initials: "YT", membership: "Family",      joined: "Apr 2023", status: "Active"  },
  { id: "7", name: "Aisha Okonkwo", initials: "AO", membership: "Junior",      joined: "Sep 2024", status: "Active"  },
  { id: "8", name: "Dan Sheridan",  initials: "DS", membership: "Full Member", joined: "Jun 2022", status: "Expired" },
]

// Column defs — meta pattern, zero inline classes.
const memberColumns: ColumnDef<DemoMember>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
    cell:   ({ row }) => <TableAvatarCell initials={row.original.initials} name={row.original.name} />,
  },
  {
    accessorKey: "membership",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membership" />,
    cell:   ({ row }) => row.original.membership,
  },
  {
    accessorKey: "joined",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell:   ({ row }) => row.original.joined,
    meta:   { cellVariant: "secondary" },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell:   ({ row }) => {
      const s = row.original.status
      const v = { Active: "success", Expired: "destructive", Pending: "pending" } as const
      return <Badge variant={v[s]}>{s}</Badge>
    },
    enableSorting: false,
  },
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
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
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
                    <TableCell>
                      <Badge variant={row.status === "Confirmed" ? "success" : row.status === "Pending" ? "pending" : "destructive"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Row>
        </Section>

        <Section title="DataTable" description="Fluid-width admin data table. Column defs use meta pattern — zero inline classes at call sites. Built from library primitives.">
          <Row label="Members — search, row actions, export">
            <div className="w-full">
              <DataTable
                data={demoMembers}
                columns={memberColumns}
                searchColumn="name"
                searchPlaceholder="Search member…"
                exportable
                exportFilename="members"
                defaultPageSize={8}
                onRowClick={(row) => toast(`Clicked: ${row.name}`)}
                rowActions={[
                  { label: "View profile",    onClick: (r) => toast.info(`Viewing ${r.name}`) },
                  { label: "Edit membership", onClick: (r) => toast(`Editing ${r.name}`) },
                  { label: "Remove member",   onClick: (r) => toast.error(`${r.name} removed`), variant: "destructive" },
                ]}
                emptyMessage="No members found."
              />
            </div>
          </Row>
        </Section>

        <Section title="InvoiceTable" description="Specialised table with summary rows for invoices.">
          <Row label="Default">
            <InvoiceTable
              items={[
                { id: 1, name: "Ridgeway Backpack",      description: "Midnight Navy · 32L capacity",   sku: "RBK-32-MN",   qty: 2, unitPrice: "£145.00", total: "£290.00" },
                { id: 2, name: "Everyday Bottle 20oz",   description: "Slate · triple-wall stainless", sku: "EVB-20-SL",   qty: 3, unitPrice: "£28.00",  total: "£84.00"  },
                { id: 3, name: "Daybreak Fleece Hoodie", description: "French terry · Nightfall",     sku: "DBH-FT-NV",   qty: 1, unitPrice: "£95.00",  total: "£95.00"  },
                { id: 4, name: "Travel Organizer Set",   description: "Mesh packing cubes · 4 pack",  sku: "TRV-ORG-SET", qty: 1, unitPrice: "£72.00",  total: "£72.00"  },
                { id: 5, name: "Expedition Duffel 90L",  description: "Weatherproof ripstop · Olive", sku: "EXP-90-OLV",  qty: 1, unitPrice: "£260.00", total: "£260.00" },
              ]}
              summary={[
                { label: "Subtotal", amount: "£801.00" },
                { label: "Tax",      amount: "£64.08"  },
                { label: "Total",    amount: "£865.08", bold: true },
              ]}
            />
          </Row>
        </Section>

      </div>
    </div>
  )
}

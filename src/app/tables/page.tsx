"use client"

import * as React from "react"
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
import { DataTableFixed } from "@/components/ui/tables/data-table-fixed"
import {
  DataTableColumnHeader,
  createSelectColumn,
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
      <p className="text-xs font-medium text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

// ─── Demo data — court equipment inventory ───────────────────────────────────

type EquipmentItem = {
  id:       string
  sku:      string
  name:     string
  category: "Racquet" | "Ball" | "Apparel" | "Footwear" | "Accessory"
  stock:    number
  hireRate: number
  status:   "Available" | "Low stock" | "Out of stock" | "Retired"
}

const demoEquipment: EquipmentItem[] = [
  { id: "1",  sku: "RAQ-W001", name: "Wilson Pro Staff 97 v14",     category: "Racquet",   stock: 12, hireRate: 8,  status: "Available"    },
  { id: "2",  sku: "RAQ-B002", name: "Babolat Pure Drive 2025",     category: "Racquet",   stock: 8,  hireRate: 8,  status: "Available"    },
  { id: "3",  sku: "RAQ-H003", name: "Head Speed MP 2024",          category: "Racquet",   stock: 3,  hireRate: 8,  status: "Low stock"    },
  { id: "4",  sku: "BAL-W004", name: "Wilson US Open · tube of 4",  category: "Ball",      stock: 48, hireRate: 3,  status: "Available"    },
  { id: "5",  sku: "BAL-D005", name: "Dunlop Fort · tube of 4",     category: "Ball",      stock: 0,  hireRate: 3,  status: "Out of stock" },
  { id: "6",  sku: "APP-T006", name: "Club tennis shirt · adult M", category: "Apparel",   stock: 22, hireRate: 0,  status: "Available"    },
  { id: "7",  sku: "APP-T007", name: "Club tennis shirt · junior",  category: "Apparel",   stock: 15, hireRate: 0,  status: "Available"    },
  { id: "8",  sku: "FTW-N008", name: "Nike Vapor Pro · court shoe", category: "Footwear",  stock: 6,  hireRate: 12, status: "Available"    },
  { id: "9",  sku: "FTW-A009", name: "Adidas Barricade · size 10",  category: "Footwear",  stock: 2,  hireRate: 12, status: "Low stock"    },
  { id: "10", sku: "ACC-G010", name: "Overgrip · pack of 3",        category: "Accessory", stock: 36, hireRate: 0,  status: "Available"    },
  { id: "11", sku: "ACC-V011", name: "Vibration dampener",          category: "Accessory", stock: 54, hireRate: 0,  status: "Available"    },
  { id: "12", sku: "ACC-S012", name: "Racquet string · reel",       category: "Accessory", stock: 1,  hireRate: 0,  status: "Low stock"    },
  { id: "13", sku: "RAQ-Y013", name: "Yonex EZONE 98 (2022)",       category: "Racquet",   stock: 0,  hireRate: 0,  status: "Retired"      },
  { id: "14", sku: "APP-S014", name: "Tennis skirt · adult",        category: "Apparel",   stock: 9,  hireRate: 0,  status: "Available"    },
  { id: "15", sku: "ACC-B015", name: "Ball hopper · 75 balls",      category: "Accessory", stock: 4,  hireRate: 4,  status: "Available"    },
]

const equipmentColumns: ColumnDef<EquipmentItem>[] = [
  createSelectColumn<EquipmentItem>(),
  {
    accessorKey: "sku",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
    cell:   ({ row }) => row.original.sku,
    meta:   { title: "SKU", cellVariant: "secondary", tabularNums: true, width: 110 },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
    cell:   ({ row }) => row.original.name,
    meta:   { title: "Item" },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell:   ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
    meta:   { title: "Category" },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
    cell:   ({ row }) => row.original.stock,
    meta:   { title: "Stock", align: "right", tabularNums: true, width: 90 },
  },
  {
    accessorKey: "hireRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hire / hr" />,
    cell:   ({ row }) => row.original.hireRate === 0 ? "—" : `£${row.original.hireRate.toFixed(2)}`,
    meta:   { title: "Hire / hr", align: "right", tabularNums: true, width: 110 },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell:   ({ row }) => {
      const s = row.original.status
      const v = {
        "Available":    "success",
        "Low stock":    "warning",
        "Out of stock": "destructive",
        "Retired":      "neutral-subtle",
      } as const
      return <Badge variant={v[s]}>{s}</Badge>
    },
    meta: { title: "Status", width: 130 },
  },
]

// ─── Demo data — sortable court display order ────────────────────────────────

type Court = {
  id:        string
  name:      string
  surface:   "Hard" | "Clay" | "Grass" | "Artificial"
  covered:   boolean
  hireRate:  number
}

const courtsInitial: Court[] = [
  { id: "c1", name: "Court 1 — Centre",    surface: "Hard",       covered: false, hireRate: 18 },
  { id: "c2", name: "Court 2 — North",     surface: "Hard",       covered: false, hireRate: 18 },
  { id: "c3", name: "Court 3 — North",     surface: "Hard",       covered: false, hireRate: 18 },
  { id: "c4", name: "Court 4 — Clay",      surface: "Clay",       covered: false, hireRate: 16 },
  { id: "c5", name: "Court 5 — Clay",      surface: "Clay",       covered: false, hireRate: 16 },
  { id: "c6", name: "Court 6 — Indoor A",  surface: "Hard",       covered: true,  hireRate: 22 },
  { id: "c7", name: "Court 7 — Indoor B",  surface: "Hard",       covered: true,  hireRate: 22 },
  { id: "c8", name: "Court 8 — Practice",  surface: "Artificial", covered: false, hireRate: 12 },
]

const courtColumns: ColumnDef<Court>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Court" />,
    cell:   ({ row }) => row.original.name,
    meta:   { title: "Court" },
  },
  {
    accessorKey: "surface",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Surface" />,
    cell:   ({ row }) => <Badge variant="outline">{row.original.surface}</Badge>,
    meta:   { title: "Surface", width: 140 },
  },
  {
    accessorKey: "covered",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Covered" />,
    cell:   ({ row }) => row.original.covered ? "Yes" : "No",
    meta:   { title: "Covered", width: 100 },
  },
  {
    accessorKey: "hireRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hire / hr" />,
    cell:   ({ row }) => `£${row.original.hireRate.toFixed(2)}`,
    meta:   { title: "Hire / hr", align: "right", tabularNums: true, width: 120 },
  },
]

// ─── Demo data — club members (wide dataset for pinned-columns demo) ─────────

type Member = {
  id:            string
  name:          string
  membership:    "Full" | "Junior" | "Student" | "Off-peak" | "Family" | "Life"
  status:        "Active" | "Pending" | "Lapsed" | "Cancelled"
  joined:        string
  expires:       string
  balance:       number
  lastBooking:   string
  totalBookings: number
  coach:         string
  homeClub:      string
  phone:         string
  email:         string
}

const demoMembers: Member[] = [
  { id: "m1",  name: "Rob Thomas",        membership: "Full",     status: "Active",    joined: "12 Jan 2024", expires: "12 Jan 2027", balance:   0.00, lastBooking: "28 Mar 2026", totalBookings: 142, coach: "Sean Delaney",     homeClub: "Wimbledon LTC",    phone: "+44 7700 900123", email: "rob.thomas@example.com"        },
  { id: "m2",  name: "Sarah Okafor",      membership: "Family",   status: "Active",    joined: "03 Mar 2023", expires: "03 Mar 2026", balance:  42.00, lastBooking: "27 Mar 2026", totalBookings:  89, coach: "Priya Nair",       homeClub: "Wimbledon LTC",    phone: "+44 7700 900231", email: "sarah.okafor@example.com"      },
  { id: "m3",  name: "James Whittle",     membership: "Full",     status: "Pending",   joined: "22 Mar 2026", expires: "22 Mar 2027", balance:   0.00, lastBooking: "—",           totalBookings:   0, coach: "—",                homeClub: "Wimbledon LTC",    phone: "+44 7700 900442", email: "james.whittle@example.com"     },
  { id: "m4",  name: "Priya Nair",        membership: "Life",     status: "Active",    joined: "17 Sep 2018", expires: "—",           balance:   0.00, lastBooking: "29 Mar 2026", totalBookings: 412, coach: "—",                homeClub: "Wimbledon LTC",    phone: "+44 7700 900553", email: "priya.nair@example.com"        },
  { id: "m5",  name: "Lukas Becker",      membership: "Junior",   status: "Active",    joined: "06 Jun 2025", expires: "06 Jun 2026", balance:   0.00, lastBooking: "26 Mar 2026", totalBookings:  34, coach: "Maya Johansson",   homeClub: "Putney TC",        phone: "+44 7700 900664", email: "lukas.becker@example.com"      },
  { id: "m6",  name: "Aisha Rahman",      membership: "Off-peak", status: "Active",    joined: "14 Feb 2024", expires: "14 Feb 2026", balance:  18.50, lastBooking: "19 Mar 2026", totalBookings:  67, coach: "Sean Delaney",     homeClub: "Wimbledon LTC",    phone: "+44 7700 900775", email: "aisha.rahman@example.com"      },
  { id: "m7",  name: "Marco Rossi",       membership: "Student",  status: "Lapsed",    joined: "19 Oct 2022", expires: "19 Oct 2024", balance:  64.00, lastBooking: "02 Oct 2024", totalBookings:  51, coach: "Tom Kowalski",     homeClub: "Putney TC",        phone: "+44 7700 900886", email: "marco.rossi@example.com"       },
  { id: "m8",  name: "Helen Murray",      membership: "Full",     status: "Cancelled", joined: "01 Apr 2020", expires: "01 Apr 2025", balance:   0.00, lastBooking: "15 Mar 2025", totalBookings: 198, coach: "—",                homeClub: "Wimbledon LTC",    phone: "+44 7700 900997", email: "helen.murray@example.com"      },
  { id: "m9",  name: "Dylan Reeves",      membership: "Junior",   status: "Active",    joined: "08 Aug 2025", expires: "08 Aug 2026", balance:   0.00, lastBooking: "24 Mar 2026", totalBookings:  22, coach: "Maya Johansson",   homeClub: "Wimbledon LTC",    phone: "+44 7700 901008", email: "dylan.reeves@example.com"      },
  { id: "m10", name: "Anya Volkov",       membership: "Full",     status: "Active",    joined: "15 Nov 2021", expires: "15 Nov 2026", balance:   0.00, lastBooking: "29 Mar 2026", totalBookings: 234, coach: "Sean Delaney",     homeClub: "Wimbledon LTC",    phone: "+44 7700 901119", email: "anya.volkov@example.com"       },
  { id: "m11", name: "Kenji Tanaka",      membership: "Full",     status: "Active",    joined: "27 Feb 2023", expires: "27 Feb 2026", balance:  12.00, lastBooking: "23 Mar 2026", totalBookings:  78, coach: "Priya Nair",       homeClub: "Wimbledon LTC",    phone: "+44 7700 901220", email: "kenji.tanaka@example.com"      },
  { id: "m12", name: "Isla Fernandez",    membership: "Family",   status: "Active",    joined: "04 Jul 2024", expires: "04 Jul 2027", balance:   0.00, lastBooking: "28 Mar 2026", totalBookings:  41, coach: "Tom Kowalski",     homeClub: "Wimbledon LTC",    phone: "+44 7700 901331", email: "isla.fernandez@example.com"    },
]

const memberColumns: ColumnDef<Member>[] = [
  createSelectColumn<Member>(),
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
    cell:   ({ row }) => row.original.name,
    meta:   { title: "Member", width: 180 },
  },
  {
    accessorKey: "membership",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membership" />,
    cell:   ({ row }) => <Badge variant="outline">{row.original.membership}</Badge>,
    meta:   { title: "Membership", width: 130 },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell:   ({ row }) => {
      const s = row.original.status
      const v = {
        "Active":    "success",
        "Pending":   "warning",
        "Lapsed":    "neutral-subtle",
        "Cancelled": "destructive",
      } as const
      return <Badge variant={v[s]}>{s}</Badge>
    },
    meta: { title: "Status", width: 120 },
  },
  {
    accessorKey: "joined",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell:   ({ row }) => row.original.joined,
    meta:   { title: "Joined", width: 130 },
  },
  {
    accessorKey: "expires",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell:   ({ row }) => row.original.expires,
    meta:   { title: "Expires", width: 130 },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
    cell:   ({ row }) => row.original.balance === 0 ? "—" : `£${row.original.balance.toFixed(2)}`,
    meta:   { title: "Balance", align: "right", tabularNums: true, width: 110 },
  },
  {
    accessorKey: "lastBooking",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last booking" />,
    cell:   ({ row }) => row.original.lastBooking,
    meta:   { title: "Last booking", width: 140 },
  },
  {
    accessorKey: "totalBookings",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total bookings" />,
    cell:   ({ row }) => row.original.totalBookings,
    meta:   { title: "Total bookings", align: "right", tabularNums: true, width: 140 },
  },
  {
    accessorKey: "coach",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned coach" />,
    cell:   ({ row }) => row.original.coach,
    meta:   { title: "Assigned coach", width: 160 },
  },
  {
    accessorKey: "homeClub",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Home club" />,
    cell:   ({ row }) => row.original.homeClub,
    meta:   { title: "Home club", width: 160 },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell:   ({ row }) => row.original.phone,
    meta:   { title: "Phone", cellVariant: "secondary", tabularNums: true, width: 160 },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell:   ({ row }) => row.original.email,
    meta:   { title: "Email", cellVariant: "secondary", width: 220 },
  },
]

export default function TablesPage() {
  const [courts, setCourts] = React.useState<Court[]>(courtsInitial)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <PreviewBar activePage="tables" />
      <div className="max-w-5xl mx-auto px-8 py-10">

        <Section title="Table" description="Basic HTML table for simple structured data.">
          <Row label="Default">
            <Table>
              <TableCaption>Court 1 bookings · today</TableCaption>
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

        <Section
          title="DataTable"
          description="Fluid-width admin data table. Select rows to reveal the bulk action bar above the table."
        >
          <Row label="Court equipment inventory">
            <div className="w-full">
              <DataTable
                data={demoEquipment}
                columns={equipmentColumns}
                getRowId={(r) => r.id}
                searchColumn="name"
                searchPlaceholder="Search equipment…"
                defaultPageSize={8}
                bulkActions={[
                  {
                    label:   "Mark as available",
                    variant: "outline",
                    onClick: (rows: EquipmentItem[]) =>
                      toast.success(`${rows.length} item${rows.length === 1 ? "" : "s"} marked available`),
                  },
                  {
                    label:   "Retire selected",
                    variant: "destructive",
                    onClick: (rows: EquipmentItem[]) =>
                      toast.error(`${rows.length} item${rows.length === 1 ? "" : "s"} retired`),
                  },
                ]}
                rowActions={[
                  { label: "View details", onClick: (r: EquipmentItem) => toast.info(`Viewing ${r.name}`) },
                  { label: "Edit item",    onClick: (r: EquipmentItem) => toast(`Editing ${r.name}`) },
                  { label: "Retire item",  onClick: (r: EquipmentItem) => toast.error(`${r.name} retired`), variant: "destructive" },
                ]}
                emptyMessage="Try adjusting your search or filters."
              />
            </div>
          </Row>
        </Section>

        <Section
          title="DataTable — sortable rows"
          description="Drag rows by the grip handle to change their order. Sets the court display order shown to members."
        >
          <Row label="Court display order — drag to reorder">
            <div className="w-full">
              <DataTable
                data={courts}
                columns={courtColumns}
                getRowId={(r) => r.id}
                sortable
                onReorder={(next) => {
                  setCourts(next)
                  toast.success("Court order updated")
                }}
                defaultPageSize={10}
                emptyMessage="No courts configured."
              />
            </div>
          </Row>
        </Section>

        <Section
          title="DataTableFixed"
          description="Wide dataset with pinned columns and horizontal scroll. First 2 columns pinned left (select + member name). Row actions auto-pin right."
        >
          <Row label="Club members — scroll horizontally to see pinned columns stay in place">
            <div className="w-full">
              <DataTableFixed
                data={demoMembers}
                columns={memberColumns}
                getRowId={(r) => r.id}
                leftPinCount={2}
                searchColumn="name"
                searchPlaceholder="Search members…"
                defaultPageSize={10}
                bulkActions={[
                  {
                    label:   "Send renewal reminder",
                    variant: "outline",
                    onClick: (rows: Member[]) =>
                      toast.success(`Reminder sent to ${rows.length} member${rows.length === 1 ? "" : "s"}`),
                  },
                  {
                    label:   "Archive selected",
                    variant: "destructive",
                    onClick: (rows: Member[]) =>
                      toast.error(`${rows.length} member${rows.length === 1 ? "" : "s"} archived`),
                  },
                ]}
                rowActions={[
                  { label: "View profile", onClick: (m: Member) => toast.info(`Viewing ${m.name}`) },
                  { label: "Edit member",  onClick: (m: Member) => toast(`Editing ${m.name}`) },
                  { label: "Archive",      onClick: (m: Member) => toast.error(`${m.name} archived`), variant: "destructive" },
                ]}
                emptyMessage="No members match your filters."
              />
            </div>
          </Row>
        </Section>

        <Section title="InvoiceTable" description="Specialised table with summary rows for invoices.">
          <Row label="Default">
            <InvoiceTable
              items={[
                { id: 1, name: "Court hire · Court 1",    description: "90 minutes · peak time",        sku: "CRT-01-PK", qty: 1, unitPrice: "£18.00",  total: "£18.00"  },
                { id: 2, name: "Racquet hire",            description: "Wilson Pro Staff · per hour",   sku: "RAQ-W001",  qty: 2, unitPrice: "£8.00",   total: "£16.00"  },
                { id: 3, name: "Tennis balls",            description: "Wilson US Open · tube of 4",    sku: "BAL-W004",  qty: 1, unitPrice: "£3.00",   total: "£3.00"   },
                { id: 4, name: "Coaching session",        description: "1-on-1 · 45 minutes · Sean D.", sku: "CCH-1TO1",  qty: 1, unitPrice: "£42.00",  total: "£42.00"  },
                { id: 5, name: "Club membership top-up",  description: "Junior · quarterly extension",  sku: "MEM-JR-Q",  qty: 1, unitPrice: "£65.00",  total: "£65.00"  },
              ]}
              summary={[
                { label: "Subtotal", amount: "£144.00" },
                { label: "Tax",      amount: "£11.52"  },
                { label: "Total",    amount: "£155.52", bold: true },
              ]}
            />
          </Row>
        </Section>

      </div>
    </div>
  )
}

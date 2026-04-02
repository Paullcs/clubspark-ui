"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { SearchInput } from "@/components/ui/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableFixed } from "@/components/ui/data-table-fixed"
import { DataTableFluid } from "@/components/ui/data-table-fluid"
import { DataTableProvider } from "@/components/ui/data-table-provider"
import { StickyTableHeader } from "@/components/ui/sticky-table-header"
import { SortIcon } from "@/components/ui/data-table-core"
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import {
  AlertCircleIcon, MailIcon, UserIcon, CheckCircleIcon,
  InfoIcon, AlertTriangleIcon, ClockIcon, CalendarIcon,
  MoreHorizontalIcon, SettingsIcon, LogOutIcon, ChevronDownIcon
} from "lucide-react"

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  { ssr: false }
)

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
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>
    </div>
  )
}

// ─── DataTableFixed demo data ─────────────────────────────────────────────────

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

const fixedColumns: ColumnDef<DemoBooking>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" onClick={(e) => e.stopPropagation()} />,
    enableSorting: false, enableHiding: false, size: 40,
  },
  {
    accessorKey: "ref",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Ref <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("ref")}</span>,
    size: 90,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Customer <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="xs"><AvatarFallback>{row.original.initials}</AvatarFallback></Avatar>
        <span className="font-medium text-sm">{row.getValue("customer")}</span>
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: "court",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Court <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => <span className="text-sm">{row.getValue("court")}</span>,
    size: 130,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => <span className="text-sm">{new Date(row.getValue("date")).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>,
    size: 120,
  },
  {
    accessorKey: "time",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Time</span>,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.getValue("time")}</span>,
    size: 70, enableSorting: false,
  },
  {
    accessorKey: "status",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Status</span>,
    cell: ({ row }) => {
      const s = row.getValue("status") as DemoBooking["status"]
      const v = { Confirmed: "success", Pending: "pending", Cancelled: "destructive", Completed: "active" } as const
      return <Badge variant={v[s]}>{s}</Badge>
    },
    size: 110,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider ml-auto" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Amount <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => { const a = row.getValue("amount") as number; return <div className="text-right text-sm tabular-nums font-medium">{a === 0 ? <span className="text-muted-foreground">—</span> : `£${a.toFixed(2)}`}</div> },
    size: 90,
  },
  {
    accessorKey: "paid",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Paid</span>,
    cell: ({ row }) => {
      if (row.original.status === "Cancelled") return <span className="text-muted-foreground text-sm">—</span>
      return row.getValue("paid") ? <Badge variant="success-solid">Paid</Badge> : <Badge variant="pending">Unpaid</Badge>
    },
    size: 80,
  },
]

// ─── DataTableFluid demo data ─────────────────────────────────────────────────

type DemoMember = { id: string; name: string; initials: string; membership: string; joined: string; status: "Active" | "Expired" | "Pending" }

const demoMembers: DemoMember[] = [
  { id: "1", name: "Rob Thomas",      initials: "RT", membership: "Full Member",   joined: "Jan 2024", status: "Active"  },
  { id: "2", name: "Sarah Okafor",    initials: "SO", membership: "Junior",        joined: "Mar 2024", status: "Active"  },
  { id: "3", name: "James Whittle",   initials: "JW", membership: "Full Member",   joined: "Aug 2023", status: "Expired" },
  { id: "4", name: "Priya Nair",      initials: "PN", membership: "Social",        joined: "Nov 2023", status: "Active"  },
  { id: "5", name: "Marcus Webb",     initials: "MW", membership: "Full Member",   joined: "Feb 2025", status: "Pending" },
  { id: "6", name: "Yuki Tanaka",     initials: "YT", membership: "Family",        joined: "Apr 2023", status: "Active"  },
  { id: "7", name: "Aisha Okonkwo",   initials: "AO", membership: "Junior",        joined: "Sep 2024", status: "Active"  },
  { id: "8", name: "Dan Sheridan",    initials: "DS", membership: "Full Member",   joined: "Jun 2022", status: "Expired" },
]

const fluidColumns: ColumnDef<DemoMember>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Member <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="xs"><AvatarFallback>{row.original.initials}</AvatarFallback></Avatar>
        <span className="font-medium text-sm">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "membership",
    header: ({ column }) => <button className="flex items-center text-xs font-medium uppercase tracking-wider" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Membership <SortIcon direction={column.getIsSorted()} /></button>,
    cell: ({ row }) => <span className="text-sm">{row.getValue("membership")}</span>,
  },
  {
    accessorKey: "joined",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Joined</span>,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("joined")}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: () => <span className="text-xs font-medium uppercase tracking-wider">Status</span>,
    cell: ({ row }) => {
      const s = row.getValue("status") as DemoMember["status"]
      const v = { Active: "success", Expired: "destructive", Pending: "pending" } as const
      return <Badge variant={v[s]}>{s}</Badge>
    },
    enableSorting: false,
  },
]

export default function ComponentsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [sliderValue, setSliderValue] = useState([40])
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <TooltipProvider>
      <div>
        <Toaster />
        <div className="min-h-screen bg-background text-foreground">

          {/* Header */}
          <div className="border-b border-border bg-card px-8 py-4 flex items-center justify-between sticky top-0 z-[--z-sticky]">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Clubspark UI</h1>
              <p className="text-sm text-muted-foreground">Component library preview</p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="dark-mode" className="text-sm">Dark mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked)
                  document.documentElement.classList.toggle("dark", checked)
                }}
              />
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-8 py-10">

            {/* BUTTONS */}
            <Section title="Button" description="All variants and sizes.">
              <Row label="Solid variants">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="active">Active</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="pending">Pending</Button>
                <Button variant="info">Info</Button>
                <Button variant="highlight">Highlight</Button>
                <Button variant="neutral">Neutral</Button>
                <Button variant="accent">Accent</Button>
              </Row>
              <Row label="Outline variants">
                <Button variant="outline">Outline</Button>
                <Button variant="secondary-outline">Secondary</Button>
                <Button variant="destructive-outline">Destructive</Button>
                <Button variant="success-outline">Success</Button>
                <Button variant="active-outline">Active</Button>
                <Button variant="warning-outline">Warning</Button>
                <Button variant="pending-outline">Pending</Button>
                <Button variant="info-outline">Info</Button>
                <Button variant="highlight-outline">Highlight</Button>
                <Button variant="neutral-outline">Neutral</Button>
              </Row>
              <Row label="Other">
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="negative">Negative</Button>
              </Row>
              <Row label="Sizes">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">X-Large</Button>
              </Row>
              <Row label="States">
                <Button disabled>Disabled</Button>
                <Button variant="destructive" disabled>Disabled destructive</Button>
              </Row>
            </Section>

            {/* BADGES */}
            <Section title="Badge" description="Subtle (tinted) and solid (filled) status badges.">
              <Row label="Subtle (tinted)">
                <Badge variant="success">Success</Badge>
                <Badge variant="active">Active</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="pending">Pending</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="highlight">Highlight</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="neutral-subtle">Neutral</Badge>
                <Badge variant="outline">Outline</Badge>
              </Row>
              <Row label="Solid">
                <Badge variant="success-solid">Success</Badge>
                <Badge variant="active-solid">Active</Badge>
                <Badge variant="warning-solid">Warning</Badge>
                <Badge variant="pending-solid">Pending</Badge>
                <Badge variant="info-solid">Info</Badge>
                <Badge variant="highlight-solid">Highlight</Badge>
                <Badge variant="destructive-solid">Destructive</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </Row>
              <Row label="Base (shadcn)">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </Row>
            </Section>

            {/* ALERTS */}
            <Section title="Alert" description="Filled and outline variants for inline notifications.">
              <Row label="Outline variants">
                <div className="w-full space-y-3">
                  <Alert variant="success-outline">
                    <CheckCircleIcon className="size-4" />
                    <AlertTitle>Booking confirmed</AlertTitle>
                    <AlertDescription>Court 1 has been booked for 28 March at 13:00.</AlertDescription>
                  </Alert>
                  <Alert variant="active-outline">
                    <CheckCircleIcon className="size-4" />
                    <AlertTitle>Session in progress</AlertTitle>
                    <AlertDescription>Court 2 is currently active until 14:00.</AlertDescription>
                  </Alert>
                  <Alert variant="warning-outline">
                    <AlertTriangleIcon className="size-4" />
                    <AlertTitle>Renewal due soon</AlertTitle>
                    <AlertDescription>1 membership renews in 26 days.</AlertDescription>
                  </Alert>
                  <Alert variant="pending-outline">
                    <ClockIcon className="size-4" />
                    <AlertTitle>Awaiting approval</AlertTitle>
                    <AlertDescription>1 booking is waiting for admin sign-off.</AlertDescription>
                  </Alert>
                  <Alert variant="info-outline">
                    <InfoIcon className="size-4" />
                    <AlertTitle>New feature available</AlertTitle>
                    <AlertDescription>Recurring bookings now support iCal RRULE format.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive-outline">
                    <AlertCircleIcon className="size-4" />
                    <AlertTitle>Payment failed</AlertTitle>
                    <AlertDescription>The payment for booking BK-3E83 could not be processed.</AlertDescription>
                  </Alert>
                </div>
              </Row>
              <Row label="Filled variants">
                <div className="w-full space-y-3">
                  <Alert variant="success">
                    <CheckCircleIcon className="size-4" />
                    <AlertTitle>Booking confirmed</AlertTitle>
                    <AlertDescription>Court 1 has been booked successfully.</AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <AlertTriangleIcon className="size-4" />
                    <AlertTitle>Renewal due soon</AlertTitle>
                    <AlertDescription>1 membership renews in 26 days.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertCircleIcon className="size-4" />
                    <AlertTitle>Payment failed</AlertTitle>
                    <AlertDescription>The payment could not be processed.</AlertDescription>
                  </Alert>
                </div>
              </Row>
            </Section>

            {/* TOAST */}
            <Section title="Toast (Sonner)" description="Notification toasts triggered by user actions.">
              <Row label="Variants">
                <Button variant="default" onClick={() => toast.success("Booking confirmed successfully.")}>Success</Button>
                <Button variant="warning-outline" onClick={() => toast.warning("Renewal due in 26 days.")}>Warning</Button>
                <Button variant="destructive-outline" onClick={() => toast.error("Payment failed. Please try again.")}>Error</Button>
                <Button variant="outline" onClick={() => toast.info("New feature available.")}>Info</Button>
                <Button variant="ghost" onClick={() => toast("Notification message here.")}>Default</Button>
                <Button variant="secondary" onClick={() => toast.loading("Processing your booking...")}>Loading</Button>
              </Row>
            </Section>

            {/* INPUTS */}
            <Section title="Input" description="Text inputs with size variants and states.">
              <Row label="Sizes">
                <div className="w-full space-y-3 max-w-sm">
                  <Input size="sm" placeholder="Small input (32px)" />
                  <Input size="default" placeholder="Default input (40px)" />
                  <Input size="lg" placeholder="Large input (48px)" />
                  <Input size="xl" placeholder="X-Large input (56px)" />
                </div>
              </Row>
              <Row label="States">
                <div className="w-full space-y-3 max-w-sm">
                  <Input placeholder="Default state" />
                  <Input placeholder="Disabled state" disabled />
                  <Input placeholder="Error state" aria-invalid />
                </div>
              </Row>
              <Row label="With icons">
                <div className="w-full space-y-3 max-w-sm">
                  <InputWithIcon placeholder="Email address" leadingIcon={<MailIcon className="size-4" />} />
                  <InputWithIcon placeholder="Username" leadingIcon={<UserIcon className="size-4" />} />
                </div>
              </Row>
              <Row label="Search">
                <div className="w-full max-w-sm">
                  <SearchInput
                    placeholder="Search bookings..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue("")}
                  />
                </div>
              </Row>
            </Section>

            {/* INPUT GROUP */}
            <Section title="Input Group" description="Inputs with attached prefix or suffix labels.">
              <Row label="Prefix">
                <div className="w-full space-y-3 max-w-sm">
                  <InputGroup>
                    <InputGroupText>https://</InputGroupText>
                    <Input placeholder="yourclub.clubspark.co.uk" />
                  </InputGroup>
                  <InputGroup>
                    <InputGroupText>£</InputGroupText>
                    <Input placeholder="0.00" type="number" />
                  </InputGroup>
                </div>
              </Row>
              <Row label="Suffix">
                <div className="w-full space-y-3 max-w-sm">
                  <InputGroup>
                    <Input placeholder="Duration" type="number" />
                    <InputGroupText>mins</InputGroupText>
                  </InputGroup>
                  <InputGroup>
                    <Input placeholder="Capacity" type="number" />
                    <InputGroupText>players</InputGroupText>
                  </InputGroup>
                </div>
              </Row>
            </Section>

            {/* TEXTAREA */}
            <Section title="Textarea" description="Multiline text inputs with size variants.">
              <Row label="Sizes">
                <div className="w-full space-y-3 max-w-sm">
                  <Textarea size="sm" placeholder="Small textarea" />
                  <Textarea size="default" placeholder="Default textarea" />
                  <Textarea size="lg" placeholder="Large textarea" />
                </div>
              </Row>
            </Section>

            {/* SELECT */}
            <Section title="Select" description="Dropdown select with size variants.">
              <Row label="Sizes">
                <div className="w-full space-y-3 max-w-sm">
                  <Select>
                    <SelectTrigger size="sm"><SelectValue placeholder="Small select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger size="default"><SelectValue placeholder="Default select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger size="lg"><SelectValue placeholder="Large select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Row>
            </Section>

            {/* SLIDER */}
            <Section title="Slider" description="Range input slider.">
              <Row label="Default">
                <div className="w-full max-w-sm space-y-4">
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
                </div>
              </Row>
              <Row label="Disabled">
                <div className="w-full max-w-sm">
                  <Slider defaultValue={[60]} min={0} max={100} step={1} disabled />
                </div>
              </Row>
            </Section>

            {/* FORM ELEMENTS */}
            <Section title="Form elements" description="Checkbox, radio and switch — all states.">
              <Row label="Checkbox">
                <div className="flex flex-wrap items-start gap-8">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-unchecked" />
                      <Label htmlFor="cb-unchecked">Unchecked</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-checked" defaultChecked />
                      <Label htmlFor="cb-checked">Checked</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-indeterminate" checked="indeterminate" />
                      <Label htmlFor="cb-indeterminate">Indeterminate</Label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-dis-unchecked" disabled />
                      <Label htmlFor="cb-dis-unchecked">Unchecked</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-dis-checked" disabled defaultChecked />
                      <Label htmlFor="cb-dis-checked">Checked</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-dis-indeterminate" disabled checked="indeterminate" />
                      <Label htmlFor="cb-dis-indeterminate">Indeterminate</Label>
                    </div>
                  </div>
                </div>
              </Row>
              <Row label="Radio">
                <div className="flex flex-wrap items-start gap-8">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                    <RadioGroup defaultValue="r-selected">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="r-unselected" id="r-unselected" />
                        <Label htmlFor="r-unselected">Unselected</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="r-selected" id="r-selected" />
                        <Label htmlFor="r-selected">Selected</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                    <RadioGroup defaultValue="r-dis-selected">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="r-dis-unselected" id="r-dis-unselected" disabled />
                        <Label htmlFor="r-dis-unselected">Unselected</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="r-dis-selected" id="r-dis-selected" disabled />
                        <Label htmlFor="r-dis-selected">Selected</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Row>
              <Row label="Switch">
                <div className="flex flex-wrap items-start gap-8">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                    <div className="flex items-center gap-2">
                      <Switch id="sw-off" />
                      <Label htmlFor="sw-off">Off</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="sw-on" defaultChecked />
                      <Label htmlFor="sw-on">On</Label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                    <div className="flex items-center gap-2">
                      <Switch id="sw-dis-off" disabled />
                      <Label htmlFor="sw-dis-off">Off</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="sw-dis-on" disabled defaultChecked />
                      <Label htmlFor="sw-dis-on">On</Label>
                    </div>
                  </div>
                </div>
              </Row>
            </Section>

            {/* TABS */}
            <Section title="Tabs" description="Tab navigation for switching between views.">
              <Row label="Default">
                <Tabs defaultValue="bookings" className="w-full max-w-lg">
                  <TabsList>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bookings" className="mt-4 text-sm text-muted-foreground">
                    Booking records and management tools appear here.
                  </TabsContent>
                  <TabsContent value="members" className="mt-4 text-sm text-muted-foreground">
                    Member profiles and membership details appear here.
                  </TabsContent>
                  <TabsContent value="reports" className="mt-4 text-sm text-muted-foreground">
                    Revenue and utilisation reports appear here.
                  </TabsContent>
                </Tabs>
              </Row>
              <Row label="Line variant">
                <Tabs defaultValue="bookings" className="w-full max-w-lg">
                  <TabsList variant="line">
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bookings" className="mt-4 text-sm text-muted-foreground">
                    Booking records and management tools appear here.
                  </TabsContent>
                  <TabsContent value="members" className="mt-4 text-sm text-muted-foreground">
                    Member profiles and membership details appear here.
                  </TabsContent>
                  <TabsContent value="reports" className="mt-4 text-sm text-muted-foreground">
                    Revenue and utilisation reports appear here.
                  </TabsContent>
                </Tabs>
              </Row>
            </Section>

            {/* ACCORDION */}
            <Section title="Accordion" description="Collapsible content sections.">
              <Row label="Default">
                <Accordion type="single" collapsible className="w-full max-w-lg">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What sports are supported?</AccordionTrigger>
                    <AccordionContent>
                      Clubspark supports tennis, football, padel, pickleball and many more sports across venues nationwide.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do recurring bookings work?</AccordionTrigger>
                    <AccordionContent>
                      Recurring bookings use iCal RRULE format — set a frequency, count or end date and the system handles the rest automatically.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I manage multiple venues?</AccordionTrigger>
                    <AccordionContent>
                      Yes — Clubspark supports multi-venue management from a single admin portal with role-based access control.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Row>
            </Section>

            {/* BREADCRUMB */}
            <Section title="Breadcrumb" description="Navigational trail showing the current page location.">
              <Row label="Default">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Venues</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Wimbledon LTC</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Row>
              <Row label="Deeper path">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Bookings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Court 1</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>BK-3E83</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Row>
            </Section>

            {/* CARD */}
            <Section title="Card" description="Surface container for grouped content.">
              <Row label="Stat cards">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total bookings</CardTitle>
                      <CardDescription>Last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">1,284</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-muted-foreground">↑ 12% vs previous period</p>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Active members</CardTitle>
                      <CardDescription>Current billing period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">342</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-muted-foreground">↓ 3 cancelled this week</p>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue</CardTitle>
                      <CardDescription>Month to date</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">£8,420</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-xs text-muted-foreground">↑ 8% vs last month</p>
                    </CardFooter>
                  </Card>
                </div>
              </Row>
              <Row label="With action">
                <Card className="w-full max-w-sm">
                  <CardHeader>
                    <CardTitle>Confirm cancellation</CardTitle>
                    <CardDescription>
                      This will cancel booking BK-3E83 and notify the customer.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-3">
                    <Button variant="outline" className="flex-1">Keep booking</Button>
                    <Button variant="destructive" className="flex-1">Cancel booking</Button>
                  </CardFooter>
                </Card>
              </Row>
            </Section>

            {/* DROPDOWN MENU */}
            <Section title="Dropdown Menu" description="Contextual action menus anchored to a trigger.">
              <Row label="Default">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Actions <ChevronDownIcon className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Booking BK-3E83</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit booking</DropdownMenuItem>
                    <DropdownMenuItem>Send confirmation</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      Cancel booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="default">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>My account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserIcon className="size-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SettingsIcon className="size-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <LogOutIcon className="size-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Row>
            </Section>

            {/* TABLE */}
            <Section title="Table" description="Data table for structured records.">
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
                      { ref: "BK-3E83", customer: "Rob Thomas", date: "28 Mar 2026", time: "13:00–14:00", status: "Confirmed", amount: "£12.00" },
                      { ref: "BK-3E84", customer: "Sarah Okafor", date: "28 Mar 2026", time: "14:00–15:00", status: "Pending", amount: "£12.00" },
                      { ref: "BK-3E85", customer: "James Whittle", date: "29 Mar 2026", time: "09:00–10:00", status: "Confirmed", amount: "£12.00" },
                      { ref: "BK-3E86", customer: "Priya Nair", date: "29 Mar 2026", time: "10:00–11:00", status: "Cancelled", amount: "£0.00" },
                    ].map((row) => (
                      <TableRow key={row.ref}>
                        <TableCell className="font-mono text-xs">{row.ref}</TableCell>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.status === "Confirmed" ? "success"
                              : row.status === "Pending" ? "pending"
                              : "destructive"
                            }
                          >
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

            {/* DATA TABLE — FIXED */}
            <Section title="DataTableFixed" description="Fixed column widths, sticky header, sticky columns, horizontal scroll. Use for dense multi-column data.">
              <Row label="Bookings — sticky header, row actions, bulk actions, export">
                <div className="w-full">
                <DataTableProvider defaults={{ resizable: true, stickyHeader: true, maxHeight: "480px", stickyColumns: { start: 2, end: 1 } }}>
                  <DataTableFixed
                    data={demoBookings}
                    columns={fixedColumns}
                    searchColumn="customer"
                    searchPlaceholder="Search customer…"
                    stickyHeader
                    maxHeight="480px"
                    stickyColumns={{ start: 2, end: 1 }}
                    resizable
                    exportable
                    exportFilename="bookings"
                    defaultPageSize={8}
                    onRowClick={(row: DemoBooking) => toast(`Clicked: ${row.ref}`)}
                    rowActions={[
                      { label: "View booking",      onClick: (r: DemoBooking) => toast.info(`Viewing ${r.ref}`)              },
                      { label: "Edit booking",      onClick: (r: DemoBooking) => toast(`Editing ${r.ref}`)                   },
                      { label: "Cancel booking",    onClick: (r: DemoBooking) => toast.error(`${r.ref} cancelled`), variant: "destructive" },
                    ]}
                    bulkActions={[
                      { label: "Export selected",   variant: "outline",     onClick: (rows) => toast(`Exporting ${rows.length} rows`)       },
                      { label: "Cancel selected",   variant: "destructive", onClick: (rows) => toast.error(`${rows.length} bookings cancelled`) },
                    ]}
                    emptyMessage="No bookings found."
                  />
                </DataTableProvider>
                </div>
              </Row>
            </Section>

            {/* DATA TABLE — FLUID */}
            <Section title="DataTableFluid" description="Fills container width, columns share available space. Use for simple lists and dashboard summaries.">
              <Row label="Members — simple list, row actions">
                <div className="w-full">
                  <StickyTableHeader topOffset="65px">
                    <DataTableFluid
                      data={demoMembers}
                      columns={fluidColumns}
                      searchColumn="name"
                      searchPlaceholder="Search member…"
                      exportable
                      exportFilename="members"
                      defaultPageSize={8}
                      onRowClick={(row: DemoMember) => toast(`Clicked: ${row.name}`)}
                      rowActions={[
                        { label: "View profile",      onClick: (r: DemoMember) => toast.info(`Viewing ${r.name}`)             },
                        { label: "Edit membership",   onClick: (r: DemoMember) => toast(`Editing ${r.name}`)                  },
                        { label: "Remove member",     onClick: (r: DemoMember) => toast.error(`${r.name} removed`), variant: "destructive" },
                      ]}
                      emptyMessage="No members found."
                    />
                  </StickyTableHeader>
                </div>
              </Row>
            </Section>

            {/* PAGINATION */}
            <Section title="Pagination" description="Page navigation for long data sets.">
              <Row label="Default">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">12</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </Row>
            </Section>

            {/* COMMAND */}
            <Section title="Command" description="Keyboard-driven search palette for quick navigation and actions.">
              <Row label="Inline">
                <Command className="rounded-lg border border-border shadow-sm w-full max-w-sm">
                  <CommandInput placeholder="Search bookings, members, courts…" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Bookings">
                      <CommandItem>
                        <CalendarIcon className="size-4 mr-2" />
                        BK-3E83 — Rob Thomas
                        <CommandShortcut>⌘B</CommandShortcut>
                      </CommandItem>
                      <CommandItem>
                        <CalendarIcon className="size-4 mr-2" />
                        BK-3E84 — Sarah Okafor
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Members">
                      <CommandItem>
                        <UserIcon className="size-4 mr-2" />
                        Rob Thomas
                      </CommandItem>
                      <CommandItem>
                        <UserIcon className="size-4 mr-2" />
                        Sarah Okafor
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                      <CommandItem>
                        <SettingsIcon className="size-4 mr-2" />
                        Settings
                        <CommandShortcut>⌘,</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </Row>
            </Section>

            {/* NAVIGATION MENU */}
            <Section title="Navigation Menu" description="Top-level site navigation with dropdown panels.">
              <Row label="Default">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Bookings</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-3 w-48">
                          <li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">All bookings</NavigationMenuLink></li>
                          <li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Recurring</NavigationMenuLink></li>
                          <li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Awaiting approval</NavigationMenuLink></li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Members</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-3 w-48">
                          <li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">All members</NavigationMenuLink></li>
                          <li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Memberships</NavigationMenuLink></li>
                          <li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Renewals</NavigationMenuLink></li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
                        Reports
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </Row>
            </Section>

            {/* CALENDAR */}
            <Section title="Calendar" description="Date picker calendar.">
              <Row label="Default">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border border-border"
                />
              </Row>
            </Section>

            {/* DIALOG */}
            <Section title="Dialog" description="Modal dialogs for confirmations and forms.">
              <Row label="Examples">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm booking</DialogTitle>
                      <DialogDescription>
                        You are about to book Court 1 Full for 28 March 2026 at 13:00. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="default">Confirm booking</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive-outline">Delete product</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete product</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Row>
            </Section>

            {/* SHEET */}
            <Section title="Sheet" description="Slide-out panels for forms and detail views.">
              <Row label="Sides">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open from right</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Booking details</SheetTitle>
                      <SheetDescription>
                        View and edit the details of this booking.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="space-y-1.5">
                        <Label>Customer</Label>
                        <Input defaultValue="Rob Thomas" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Bookable unit</Label>
                        <Input defaultValue="Court 1 Full" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Notes</Label>
                        <Textarea placeholder="Add any booking notes..." />
                      </div>
                      <Button className="w-full">Save changes</Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open from left</Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                      <SheetDescription>Mobile navigation panel.</SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </Row>
            </Section>

            {/* POPOVER */}
            <Section title="Popover" description="Floating content panels anchored to a trigger.">
              <Row label="Default">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="size-4 mr-2" />
                      Pick a date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                  </PopoverContent>
                </Popover>
              </Row>
            </Section>

            {/* TOOLTIP */}
            <Section title="Tooltip" description="Contextual hints on hover.">
              <Row label="Default">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="default">Save booking</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Saves and confirms the booking immediately</p>
                  </TooltipContent>
                </Tooltip>
              </Row>
            </Section>

            {/* SEPARATOR */}
            <Section title="Separator" description="Visual divider between content sections.">
              <Row label="Horizontal">
                <div className="w-full max-w-sm space-y-3">
                  <p className="text-sm">Above the separator</p>
                  <Separator />
                  <p className="text-sm">Below the separator</p>
                </div>
              </Row>
              <Row label="Vertical">
                <div className="flex items-center gap-3 h-8">
                  <span className="text-sm">Bookings</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">Members</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">Reports</span>
                </div>
              </Row>
            </Section>

            {/* AVATAR */}
            <Section title="Avatar" description="Full size scale from 24px to 96px.">
              <Row label="Sizes">
                <Avatar size="2xs"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="xs"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="sm"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="default"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="lg"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="xl"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="2xl"><AvatarFallback>RT</AvatarFallback></Avatar>
                <Avatar size="3xl"><AvatarFallback>RT</AvatarFallback></Avatar>
              </Row>
            </Section>

            {/* PROGRESS */}
            <Section title="Progress" description="Progress bar with colour variants and sizes.">
              <Row label="Colour variants">
                <div className="w-full space-y-3">
                  <Progress value={75} variant="default" />
                  <Progress value={60} variant="success" />
                  <Progress value={45} variant="active" />
                  <Progress value={80} variant="warning" />
                  <Progress value={30} variant="pending" />
                  <Progress value={55} variant="destructive" />
                  <Progress value={70} variant="info" />
                  <Progress value={40} variant="highlight" />
                </div>
              </Row>
              <Row label="Sizes">
                <div className="w-full space-y-3">
                  <Progress value={60} size="sm" />
                  <Progress value={60} size="default" />
                  <Progress value={60} size="lg" />
                  <Progress value={60} size="xl" />
                </div>
              </Row>
            </Section>

            {/* SKELETON */}
            <Section title="Skeleton" description="Loading placeholder for content.">
              <Row label="Examples">
                <div className="w-full space-y-3 max-w-sm">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-3 mt-4">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              </Row>
            </Section>

          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

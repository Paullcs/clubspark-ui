"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { PreviewBar } from "@/components/ui/preview-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback, AvatarWrapper } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerBody, DrawerFooter } from "@/components/ui/drawer"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Leaderboard } from "@/components/ui/leaderboard"
import {
  AlertCircleIcon, MailIcon, UserIcon, CheckCircleIcon,
  InfoIcon, AlertTriangleIcon, ClockIcon, CalendarIcon,
  MoreHorizontalIcon, SettingsIcon, LogOutIcon, ChevronDownIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon,
  BoldIcon, ItalicIcon, UnderlineIcon,
  LayoutGridIcon, ListIcon,
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

export default function ComponentsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <TooltipProvider>
      <div>
        <Toaster />
        <div className="min-h-screen bg-background text-foreground">

          <PreviewBar activePage="components" />

          <div className="max-w-5xl mx-auto px-8 py-10">

            <Section title="Button" description="All variants and sizes.">
              <Row label="Brand (changes per theme)">
                <Button variant="default">Primary</Button><Button variant="outline">Primary Outline</Button><Button variant="accent">Accent</Button>
              </Row>
              <Row label="Solid variants — shared across all themes">
                <Button variant="destructive">Destructive</Button><Button variant="success">Success</Button><Button variant="active">Active</Button><Button variant="warning">Warning</Button><Button variant="pending">Pending</Button><Button variant="info">Info</Button><Button variant="highlight">Highlight</Button><Button variant="neutral">Neutral</Button>
              </Row>
              <Row label="Outline variants">
                <Button variant="outline">Outline</Button><Button variant="secondary-outline">Secondary</Button><Button variant="destructive-outline">Destructive</Button><Button variant="success-outline">Success</Button><Button variant="active-outline">Active</Button><Button variant="warning-outline">Warning</Button><Button variant="pending-outline">Pending</Button><Button variant="info-outline">Info</Button><Button variant="highlight-outline">Highlight</Button><Button variant="neutral-outline">Neutral</Button>
              </Row>
              <Row label="Other"><Button variant="ghost">Ghost</Button><Button variant="link">Link</Button><Button variant="negative">Negative</Button></Row>
              <Row label="Sizes"><Button size="sm">Small</Button><Button size="default">Default</Button><Button size="lg">Large</Button><Button size="xl">X-Large</Button></Row>
              <Row label="States"><Button disabled>Disabled</Button><Button variant="destructive" disabled>Disabled destructive</Button></Row>
            </Section>

            <Section title="Badge" description="Subtle (tinted) and solid (filled) status badges.">
              <Row label="Subtle (tinted)">
                <Badge variant="success">Success</Badge><Badge variant="active">Active</Badge><Badge variant="warning">Warning</Badge><Badge variant="pending">Pending</Badge><Badge variant="info">Info</Badge><Badge variant="highlight">Highlight</Badge><Badge variant="destructive">Destructive</Badge><Badge variant="neutral-subtle">Neutral</Badge><Badge variant="outline">Outline</Badge>
              </Row>
              <Row label="Solid">
                <Badge variant="success-solid">Success</Badge><Badge variant="active-solid">Active</Badge><Badge variant="warning-solid">Warning</Badge><Badge variant="pending-solid">Pending</Badge><Badge variant="info-solid">Info</Badge><Badge variant="highlight-solid">Highlight</Badge><Badge variant="destructive-solid">Destructive</Badge><Badge variant="neutral">Neutral</Badge>
              </Row>
              <Row label="Base (shadcn)"><Badge variant="default">Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="ghost">Ghost</Badge></Row>
            </Section>

            <Section title="Alert" description="Filled and outline variants for inline notifications.">
              <Row label="Outline variants">
                <div className="w-full space-y-3">
                  <Alert variant="success-outline"><CheckCircleIcon className="size-4" /><AlertTitle>Booking confirmed</AlertTitle><AlertDescription>Court 1 has been booked for 28 March at 13:00.</AlertDescription></Alert>
                  <Alert variant="active-outline"><CheckCircleIcon className="size-4" /><AlertTitle>Session in progress</AlertTitle><AlertDescription>Court 2 is currently active until 14:00.</AlertDescription></Alert>
                  <Alert variant="warning-outline"><AlertTriangleIcon className="size-4" /><AlertTitle>Renewal due soon</AlertTitle><AlertDescription>1 membership renews in 26 days.</AlertDescription></Alert>
                  <Alert variant="pending-outline"><ClockIcon className="size-4" /><AlertTitle>Awaiting approval</AlertTitle><AlertDescription>1 booking is waiting for admin sign-off.</AlertDescription></Alert>
                  <Alert variant="info-outline"><InfoIcon className="size-4" /><AlertTitle>New feature available</AlertTitle><AlertDescription>Recurring bookings now support iCal RRULE format.</AlertDescription></Alert>
                  <Alert variant="destructive-outline"><AlertCircleIcon className="size-4" /><AlertTitle>Payment failed</AlertTitle><AlertDescription>The payment for booking BK-3E83 could not be processed.</AlertDescription></Alert>
                </div>
              </Row>
              <Row label="Filled variants">
                <div className="w-full space-y-3">
                  <Alert variant="success"><CheckCircleIcon className="size-4" /><AlertTitle>Booking confirmed</AlertTitle><AlertDescription>Court 1 has been booked successfully.</AlertDescription></Alert>
                  <Alert variant="warning"><AlertTriangleIcon className="size-4" /><AlertTitle>Renewal due soon</AlertTitle><AlertDescription>1 membership renews in 26 days.</AlertDescription></Alert>
                  <Alert variant="destructive"><AlertCircleIcon className="size-4" /><AlertTitle>Payment failed</AlertTitle><AlertDescription>The payment could not be processed.</AlertDescription></Alert>
                </div>
              </Row>
            </Section>

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

            <Section title="Toggle Group" description="Segmented controls for single or multi-select options.">
              <Row label="Default — icons, single select">
                <ToggleGroup type="single" defaultValue="center">
                  <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon className="size-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon className="size-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon className="size-4" /></ToggleGroupItem>
                </ToggleGroup>
              </Row>
              <Row label="Default — icons, multi select">
                <ToggleGroup type="multiple" defaultValue={["bold"]}>
                  <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon className="size-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon className="size-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Underline"><UnderlineIcon className="size-4" /></ToggleGroupItem>
                </ToggleGroup>
              </Row>
              <Row label="Default — text labels">
                <ToggleGroup type="single" defaultValue="month">
                  <ToggleGroupItem value="day">Day</ToggleGroupItem><ToggleGroupItem value="week">Week</ToggleGroupItem><ToggleGroupItem value="month">Month</ToggleGroupItem><ToggleGroupItem value="year">Year</ToggleGroupItem>
                </ToggleGroup>
              </Row>
              <Row label="Primary — selected state uses brand colour">
                <ToggleGroup type="single" variant="primary" defaultValue="grid">
                  <ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGridIcon className="size-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view"><ListIcon className="size-4" /></ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup type="single" variant="primary" defaultValue="confirmed">
                  <ToggleGroupItem value="all">All</ToggleGroupItem><ToggleGroupItem value="confirmed">Confirmed</ToggleGroupItem><ToggleGroupItem value="pending">Pending</ToggleGroupItem><ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
                </ToggleGroup>
              </Row>
              <Row label="Sizes">
                <ToggleGroup type="single" size="sm" defaultValue="a"><ToggleGroupItem value="a">Small</ToggleGroupItem><ToggleGroupItem value="b">Toggle</ToggleGroupItem></ToggleGroup>
                <ToggleGroup type="single" size="default" defaultValue="a"><ToggleGroupItem value="a">Default</ToggleGroupItem><ToggleGroupItem value="b">Toggle</ToggleGroupItem></ToggleGroup>
                <ToggleGroup type="single" size="lg" defaultValue="a"><ToggleGroupItem value="a">Large</ToggleGroupItem><ToggleGroupItem value="b">Toggle</ToggleGroupItem></ToggleGroup>
              </Row>
              <Row label="Outline">
                <ToggleGroup type="single" variant="outline" defaultValue="bookings">
                  <ToggleGroupItem value="bookings">Bookings</ToggleGroupItem><ToggleGroupItem value="members">Members</ToggleGroupItem><ToggleGroupItem value="reports">Reports</ToggleGroupItem>
                </ToggleGroup>
              </Row>
            </Section>

            <Section title="Tabs" description="Tab navigation for switching between views.">
              <Row label="Default">
                <Tabs defaultValue="bookings" className="w-full max-w-lg">
                  <TabsList><TabsTrigger value="bookings">Bookings</TabsTrigger><TabsTrigger value="members">Members</TabsTrigger><TabsTrigger value="reports">Reports</TabsTrigger></TabsList>
                  <TabsContent value="bookings" className="mt-4 text-sm text-muted-foreground">Booking records and management tools appear here.</TabsContent>
                  <TabsContent value="members" className="mt-4 text-sm text-muted-foreground">Member profiles and membership details appear here.</TabsContent>
                  <TabsContent value="reports" className="mt-4 text-sm text-muted-foreground">Revenue and utilisation reports appear here.</TabsContent>
                </Tabs>
              </Row>
              <Row label="Line variant">
                <Tabs defaultValue="bookings" className="w-full max-w-lg">
                  <TabsList variant="line"><TabsTrigger value="bookings">Bookings</TabsTrigger><TabsTrigger value="members">Members</TabsTrigger><TabsTrigger value="reports">Reports</TabsTrigger><TabsTrigger value="settings" disabled>Settings</TabsTrigger></TabsList>
                  <TabsContent value="bookings" className="mt-4 text-sm text-muted-foreground">Booking records and management tools appear here.</TabsContent>
                  <TabsContent value="members" className="mt-4 text-sm text-muted-foreground">Member profiles and membership details appear here.</TabsContent>
                  <TabsContent value="reports" className="mt-4 text-sm text-muted-foreground">Revenue and utilisation reports appear here.</TabsContent>
                </Tabs>
              </Row>
            </Section>

            <Section title="Accordion" description="Collapsible content sections.">
              <Row label="Default">
                <Accordion type="single" collapsible className="w-full max-w-lg">
                  <AccordionItem value="i1"><AccordionTrigger>What sports are supported?</AccordionTrigger><AccordionContent>Clubspark supports tennis, football, padel, pickleball and many more sports across venues nationwide.</AccordionContent></AccordionItem>
                  <AccordionItem value="i2"><AccordionTrigger>How do recurring bookings work?</AccordionTrigger><AccordionContent>Recurring bookings use iCal RRULE format — set a frequency, count or end date and the system handles the rest automatically.</AccordionContent></AccordionItem>
                  <AccordionItem value="i3"><AccordionTrigger>Can I manage multiple venues?</AccordionTrigger><AccordionContent>Yes — Clubspark supports multi-venue management from a single admin portal with role-based access control.</AccordionContent></AccordionItem>
                </Accordion>
              </Row>
            </Section>

            <Section title="Breadcrumb" description="Navigational trail showing the current page location.">
              <Row label="Default">
                <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Venues</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Wimbledon LTC</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
              </Row>
              <Row label="Deeper path">
                <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Bookings</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Court 1</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>BK-3E83</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
              </Row>
            </Section>

            <Section title="Card" description="Surface container for grouped content.">
              <Row label="Stat cards">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <StatCard title="Total Revenue" value="£4,280.00" description="Trending up this month" trend={{ value: "+12.5%", direction: "up" }} />
                  <StatCard title="Active Bookings" value="21" description="1 booking today" trend={{ value: "+3", direction: "up" }} />
                  <StatCard title="Active Members" value="156" description="12 new this month" trend={{ value: "+8.2%", direction: "up" }} />
                  <StatCard title="Utilisation" value="47%" description="Across 8 bookable units" trend={{ value: "-2.1%", direction: "down" }} />
                </div>
              </Row>
              <Row label="With action">
                <Card className="w-full max-w-sm">
                  <CardHeader><CardTitle>Confirm cancellation</CardTitle><CardDescription>This will cancel booking BK-3E83 and notify the customer.</CardDescription></CardHeader>
                  <CardFooter className="flex gap-3"><Button variant="outline" className="flex-1">Keep booking</Button><Button variant="destructive" className="flex-1">Cancel booking</Button></CardFooter>
                </Card>
              </Row>
            </Section>

            <Section title="Dropdown Menu" description="Contextual action menus anchored to a trigger.">
              <Row label="Default">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline">Actions <ChevronDownIcon className="size-4 ml-2" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Booking BK-3E83</DropdownMenuLabel><DropdownMenuSeparator />
                    <DropdownMenuItem>View details</DropdownMenuItem><DropdownMenuItem>Edit booking</DropdownMenuItem><DropdownMenuItem>Send confirmation</DropdownMenuItem>
                    <DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive">Cancel booking</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="default"><MoreHorizontalIcon className="size-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>My account</DropdownMenuLabel><DropdownMenuSeparator />
                    <DropdownMenuItem><UserIcon className="size-4 mr-2" />Profile</DropdownMenuItem><DropdownMenuItem><SettingsIcon className="size-4 mr-2" />Settings</DropdownMenuItem>
                    <DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive"><LogOutIcon className="size-4 mr-2" />Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Row>
            </Section>

            <Section title="Command" description="Keyboard-driven search palette for quick navigation and actions.">
              <Row label="Inline">
                <Command className="rounded-lg border border-border shadow-sm w-full max-w-sm">
                  <CommandInput placeholder="Search bookings, members, courts…" autoFocus={false} />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Bookings">
                      <CommandItem><CalendarIcon className="size-4 mr-2" />BK-3E83 — Rob Thomas<CommandShortcut>⌘B</CommandShortcut></CommandItem>
                      <CommandItem><CalendarIcon className="size-4 mr-2" />BK-3E84 — Sarah Okafor</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Members">
                      <CommandItem><UserIcon className="size-4 mr-2" />Rob Thomas</CommandItem>
                      <CommandItem><UserIcon className="size-4 mr-2" />Sarah Okafor</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                      <CommandItem><SettingsIcon className="size-4 mr-2" />Settings<CommandShortcut>⌘,</CommandShortcut></CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </Row>
            </Section>

            <Section title="Navigation Menu" description="Top-level site navigation with dropdown panels.">
              <Row label="Default">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Bookings</NavigationMenuTrigger>
                      <NavigationMenuContent><ul className="grid gap-1 p-3 w-48"><li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">All bookings</NavigationMenuLink></li><li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Recurring</NavigationMenuLink></li><li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Awaiting approval</NavigationMenuLink></li></ul></NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Members</NavigationMenuTrigger>
                      <NavigationMenuContent><ul className="grid gap-1 p-3 w-48"><li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">All members</NavigationMenuLink></li><li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Memberships</NavigationMenuLink></li><li><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Renewals</NavigationMenuLink></li></ul></NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem><NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">Reports</NavigationMenuLink></NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </Row>
            </Section>

            <Section title="Date Range Picker" description="Preset options with optional custom calendar range.">
              <Row label="Default">
                <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="Select date range" />
                {dateRange && <span className="text-sm text-muted-foreground">{dateRange.preset ?? `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`}</span>}
              </Row>
            </Section>

            <Section title="Calendar" description="Date picker calendar.">
              <Row label="Default"><Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border border-border" /></Row>
            </Section>

            <Section title="Dialog" description="Modal dialogs for confirmations and forms.">
              <Row label="Examples">
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
                  <DialogContent><DialogHeader><DialogTitle>Confirm booking</DialogTitle><DialogDescription>You are about to book Court 1 Full for 28 March 2026 at 13:00. This action cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline">Cancel</Button><Button variant="default">Confirm booking</Button></DialogFooter></DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild><Button variant="destructive-outline">Delete product</Button></DialogTrigger>
                  <DialogContent><DialogHeader><DialogTitle>Delete product</DialogTitle><DialogDescription>Are you sure you want to delete this product? This action cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline">Cancel</Button><Button variant="destructive">Delete</Button></DialogFooter></DialogContent>
                </Dialog>
              </Row>
            </Section>

            <Section title="Drawer" description="Slide-in panels from any side.">
              <Row label="Sides">
                <Drawer direction="right">
                  <DrawerTrigger asChild><Button variant="outline">Open from right</Button></DrawerTrigger>
                  <DrawerContent direction="right">
                    <DrawerHeader><DrawerTitle>Booking details</DrawerTitle><DrawerDescription>View and edit the details of this booking.</DrawerDescription></DrawerHeader>
                    <DrawerBody><div className="space-y-1.5"><Label>Customer</Label><Input defaultValue="Rob Thomas" /></div><div className="space-y-1.5"><Label>Bookable unit</Label><Input defaultValue="Court 1 Full" /></div><div className="space-y-1.5"><Label>Notes</Label><Textarea placeholder="Add any booking notes..." /></div></DrawerBody>
                    <DrawerFooter><Button className="w-full">Save changes</Button></DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <Drawer direction="bottom">
                  <DrawerTrigger asChild><Button variant="outline">Open from bottom</Button></DrawerTrigger>
                  <DrawerContent direction="bottom">
                    <DrawerHeader><DrawerTitle>Quick actions</DrawerTitle><DrawerDescription>Choose an action for booking BK-3E83.</DrawerDescription></DrawerHeader>
                    <DrawerBody><Button variant="outline" className="w-full justify-start">View booking</Button><Button variant="outline" className="w-full justify-start">Edit booking</Button><Button variant="destructive-outline" className="w-full justify-start">Cancel booking</Button></DrawerBody>
                    <DrawerFooter><Button variant="ghost" className="w-full">Dismiss</Button></DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <Drawer direction="left">
                  <DrawerTrigger asChild><Button variant="outline">Open from left</Button></DrawerTrigger>
                  <DrawerContent direction="left">
                    <DrawerHeader><DrawerTitle>Navigation</DrawerTitle><DrawerDescription>Mobile navigation panel.</DrawerDescription></DrawerHeader>
                    <DrawerBody><nav className="flex flex-col gap-1">{["Dashboard","Bookings","Members","Courts","Reports","Settings"].map((item) => (<Button key={item} variant="ghost" className="w-full justify-start">{item}</Button>))}</nav></DrawerBody>
                  </DrawerContent>
                </Drawer>
              </Row>
            </Section>

            <Section title="Hover Card" description="Rich floating content triggered on hover.">
              <Row label="Examples">
                <HoverCard>
                  <HoverCardTrigger asChild><Button variant="link">@rob.thomas</Button></HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-start gap-3">
                      <Avatar size="default"><AvatarFallback>RT</AvatarFallback></Avatar>
                      <div className="flex flex-col gap-1"><p className="text-sm font-semibold">Rob Thomas</p><p className="text-xs text-muted-foreground">Full Member · joined Jan 2024</p><div className="flex gap-1.5 mt-1.5 flex-wrap"><Badge variant="success">Active</Badge><Badge variant="info">12 bookings</Badge></div></div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger asChild><Button variant="link">Court 1 Full</Button></HoverCardTrigger>
                  <HoverCardContent><div className="flex flex-col gap-2"><p className="text-sm font-semibold">Court 1 — Full Court</p><p className="text-xs text-muted-foreground">Available 06:00–22:00 · Max 4 players</p><Badge variant="active" className="w-fit">In use until 14:00</Badge></div></HoverCardContent>
                </HoverCard>
              </Row>
            </Section>

            <Section title="Popover" description="Floating content panels anchored to a trigger.">
              <Row label="Default">
                <Popover><PopoverTrigger asChild><Button variant="outline"><CalendarIcon className="size-4 mr-2" />Pick a date</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent></Popover>
              </Row>
            </Section>

            <Section title="Tooltip" description="Contextual hints on hover.">
              <Row label="Default">
                <Tooltip><TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger><TooltipContent><p>This is a tooltip</p></TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><Button variant="default">Save booking</Button></TooltipTrigger><TooltipContent><p>Saves and confirms the booking immediately</p></TooltipContent></Tooltip>
              </Row>
            </Section>

            <Section title="Separator" description="Visual divider between content sections.">
              <Row label="Horizontal"><div className="w-full max-w-sm space-y-3"><p className="text-sm">Above the separator</p><Separator /><p className="text-sm">Below the separator</p></div></Row>
              <Row label="Vertical"><div className="flex items-center gap-3 h-8"><span className="text-sm">Bookings</span><Separator orientation="vertical" /><span className="text-sm">Members</span><Separator orientation="vertical" /><span className="text-sm">Reports</span></div></Row>
            </Section>

            <Section title="Avatar" description="Full size scale from 24px to 96px. Neutral and info variants, image and initials.">
              <Row label="Neutral — initials">
                <Avatar size="2xs"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="xs"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="sm"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="default"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="xl"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="2xl"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="3xl"><AvatarFallback>RT</AvatarFallback></Avatar>
              </Row>
              <Row label="Info — initials">
                <Avatar size="2xs" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="xs" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="sm" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="default" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="lg" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="xl" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="2xl" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="3xl" variant="info"><AvatarFallback>RT</AvatarFallback></Avatar>
              </Row>
              <Row label="Image">
                <Avatar size="2xs"><AvatarImage src="https://i.pravatar.cc/24?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="xs"><AvatarImage src="https://i.pravatar.cc/28?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="sm"><AvatarImage src="https://i.pravatar.cc/32?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="default"><AvatarImage src="https://i.pravatar.cc/40?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="lg"><AvatarImage src="https://i.pravatar.cc/48?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="xl"><AvatarImage src="https://i.pravatar.cc/64?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="2xl"><AvatarImage src="https://i.pravatar.cc/80?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar><Avatar size="3xl"><AvatarImage src="https://i.pravatar.cc/96?img=1" /><AvatarFallback>RT</AvatarFallback></Avatar>
              </Row>
              <Row label="Status indicator">
                <AvatarWrapper status="online"><Avatar size="default"><AvatarFallback>RT</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper status="busy"><Avatar size="default"><AvatarFallback>SO</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper status="away"><Avatar size="default"><AvatarFallback>JW</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper status="offline"><Avatar size="default"><AvatarFallback>PN</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper status="online"><Avatar size="lg"><AvatarImage src="https://i.pravatar.cc/48?img=2" /><AvatarFallback>MW</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper status="busy"><Avatar size="xl"><AvatarImage src="https://i.pravatar.cc/64?img=3" /><AvatarFallback>YT</AvatarFallback></Avatar></AvatarWrapper>
              </Row>
              <Row label="Counter badge">
                <AvatarWrapper count={3}><Avatar size="default"><AvatarFallback>RT</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper count={12}><Avatar size="default"><AvatarFallback>SO</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper count={99}><Avatar size="default"><AvatarFallback>JW</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper count={100}><Avatar size="default"><AvatarFallback>PN</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper count={5} status="online"><Avatar size="lg"><AvatarImage src="https://i.pravatar.cc/48?img=4" /><AvatarFallback>MW</AvatarFallback></Avatar></AvatarWrapper>
                <AvatarWrapper count={2} status="busy"><Avatar size="xl"><AvatarImage src="https://i.pravatar.cc/64?img=5" /><AvatarFallback>YT</AvatarFallback></Avatar></AvatarWrapper>
              </Row>
            </Section>

            <Section title="Progress" description="Progress bar with colour variants and sizes.">
              <Row label="Colour variants">
                <div className="w-full space-y-3">
                  <Progress value={75} variant="default" /><Progress value={60} variant="success" /><Progress value={45} variant="active" /><Progress value={80} variant="warning" /><Progress value={30} variant="pending" /><Progress value={55} variant="destructive" /><Progress value={70} variant="info" /><Progress value={40} variant="highlight" />
                </div>
              </Row>
              <Row label="Sizes">
                <div className="w-full space-y-3">
                  <Progress value={60} size="sm" /><Progress value={60} size="default" /><Progress value={60} size="lg" /><Progress value={60} size="xl" />
                </div>
              </Row>
            </Section>

            <Section title="Skeleton" description="Loading placeholder for content.">
              <Row label="Examples">
                <div className="w-full space-y-3 max-w-sm">
                  <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-3 mt-4"><Skeleton className="size-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" /></div></div>
                </div>
              </Row>
            </Section>

            <Section title="Leaderboard" description="Ranked list with avatar, name, subtitle and value.">
              <Row label="Default">
                <Leaderboard />
              </Row>
            </Section>

          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

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
import {
  AlertCircleIcon, MailIcon, UserIcon, CheckCircleIcon,
  InfoIcon, AlertTriangleIcon, ClockIcon, CalendarIcon
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

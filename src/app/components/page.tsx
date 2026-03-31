"use client"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { SearchInput } from "@/components/ui/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircleIcon, MailIcon, UserIcon, CheckCircleIcon, InfoIcon, AlertTriangleIcon, ClockIcon } from "lucide-react"

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

  return (
    <div className={darkMode ? "dark" : ""}>
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
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-10">

          {/* BUTTONS */}
          <Section title="Button" description="All variants and sizes. Use the appropriate variant to communicate intent.">
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
            <Row label="Other variants">
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
              <Button variant="destructive" disabled>Disabled</Button>
            </Row>
          </Section>

          {/* BADGES */}
          <Section title="Badge" description="Subtle (tinted) and solid (filled) status badges. Base shadcn styles are separate.">
            <Row label="Subtle (tinted)">
              <Badge variant="success">Success</Badge>
              <Badge variant="active">Active</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="pending">Pending</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="highlight">Highlight</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="neutral-subtle">Neutral subtle</Badge>
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
              <Badge variant="neutral-solid">Neutral</Badge>
            </Row>
            <Row label="Base (shadcn)">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </Row>
          </Section>

          {/* ALERTS */}
          <Section title="Alert" description="Filled and outline variants for inline notifications and messages.">
            <Row label="Outline variants (recommended for most uses)">
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
            <Row label="Filled variants (stronger emphasis)">
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
                <InputWithIcon
                  placeholder="Search..."
                  leadingIcon={<SearchInput size="default" />}
                />
                <InputWithIcon
                  placeholder="Email address"
                  leadingIcon={<MailIcon className="size-4" />}
                />
                <InputWithIcon
                  placeholder="Username"
                  leadingIcon={<UserIcon className="size-4" />}
                />
              </div>
            </Row>
            <Row label="Search input">
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
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger size="default"><SelectValue placeholder="Default select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger size="lg"><SelectValue placeholder="Large select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Row>
          </Section>

          {/* FORM ELEMENTS */}
          <Section title="Form elements" description="Checkbox, switch and label components.">
            <Row label="Checkbox">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="check1" />
                  <Label htmlFor="check1">Unchecked</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="check2" defaultChecked />
                  <Label htmlFor="check2">Checked</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="check3" disabled />
                  <Label htmlFor="check3">Disabled</Label>
                </div>
              </div>
            </Row>
            <Row label="Switch">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Switch id="sw1" />
                  <Label htmlFor="sw1">Off</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sw2" defaultChecked />
                  <Label htmlFor="sw2">On</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sw3" disabled />
                  <Label htmlFor="sw3">Disabled</Label>
                </div>
              </div>
            </Row>
          </Section>

          {/* RADIO GROUP */}
          <Section title="Radio group" description="Single-choice input; one option can be selected at a time.">
            <Row label="Default">
              <RadioGroup defaultValue="option-2" className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option-1" id="rg-opt-1" />
                  <Label htmlFor="rg-opt-1">First option</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option-2" id="rg-opt-2" />
                  <Label htmlFor="rg-opt-2">Second option</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option-3" id="rg-opt-3" />
                  <Label htmlFor="rg-opt-3">Third option</Label>
                </div>
              </RadioGroup>
            </Row>
            <Row label="States">
              <RadioGroup defaultValue="enabled" className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="enabled" id="rg-st-1" />
                  <Label htmlFor="rg-st-1">Selectable</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="rg-st-2" />
                  <Label htmlFor="rg-st-2">Also selectable</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="disabled" id="rg-st-3" disabled />
                  <Label htmlFor="rg-st-3">Disabled</Label>
                </div>
              </RadioGroup>
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
  )
}

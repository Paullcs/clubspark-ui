"use client"

import { useState, useEffect } from "react"
import { PreviewBar } from "@/components/ui/preview-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { InputGroup, InputGroupText, InputGroupInput } from "@/components/ui/input-group"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { SearchInput } from "@/components/ui/search-input"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { ImageUpload } from "@/components/ui/image-upload"
import { ImageUploadMultiple } from "@/components/ui/image-upload-multiple"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MailIcon, UserIcon, LockIcon, PhoneIcon, AlertCircleIcon, CheckCircleIcon, BuildingIcon } from "lucide-react"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-6 border-b border-border pb-3">
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
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  )
}

export default function FormsPage() {
  const [searchValue, setSearchValue] = useState("")
  const [sliderValue, setSliderValue] = useState([40])
  const [priceRange, setPriceRange] = useState([200, 800])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [capacity, setCapacity] = useState([4])
  const [basicHtml, setBasicHtml] = useState<string>("")
  const [richHtml, setRichHtml] = useState<string>("")

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <PreviewBar activePage="forms" />
      <div className="max-w-5xl mx-auto px-8 py-10">

        <Section title="Input" description="Text inputs with size variants and states.">
          <Row label="Sizes">
            <div className="w-full space-y-3 max-w-sm">
              <Input size="sm" placeholder="Small input (32px)" /><Input size="default" placeholder="Default input (40px)" /><Input size="lg" placeholder="Large input (48px)" /><Input size="xl" placeholder="X-Large input (56px)" />
            </div>
          </Row>
          <Row label="States">
            <div className="w-full space-y-3 max-w-sm">
              <Input placeholder="Default state" /><Input placeholder="Disabled state" disabled /><Input placeholder="Error state" aria-invalid />
            </div>
          </Row>
          <Row label="With icons">
            <div className="w-full space-y-3 max-w-sm">
              <InputWithIcon placeholder="Email address" leadingIcon={<MailIcon className="size-4" />} /><InputWithIcon placeholder="Username" leadingIcon={<UserIcon className="size-4" />} />
            </div>
          </Row>
          <Row label="Search">
            <div className="w-full max-w-sm">
              <SearchInput placeholder="Search bookings..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onClear={() => setSearchValue("")} />
            </div>
          </Row>
        </Section>

        <Section title="Input Group" description="Inputs with attached prefix or suffix labels.">
          <Row label="Prefix">
            <div className="w-full space-y-3 max-w-sm">
              <InputGroup><InputGroupText position="start">https://</InputGroupText><InputGroupInput placeholder="yourclub.clubspark.co.uk" /></InputGroup>
              <InputGroup><InputGroupText position="start">£</InputGroupText><InputGroupInput placeholder="0.00" type="number" /></InputGroup>
            </div>
          </Row>
          <Row label="Suffix">
            <div className="w-full space-y-3 max-w-sm">
              <InputGroup><InputGroupInput placeholder="Duration" type="number" /><InputGroupText position="end">mins</InputGroupText></InputGroup>
              <InputGroup><InputGroupInput placeholder="Capacity" type="number" /><InputGroupText position="end">players</InputGroupText></InputGroup>
            </div>
          </Row>
          <Row label="Sizes">
            <div className="w-full space-y-3 max-w-sm">
              <InputGroup size="sm"><InputGroupText position="start">£</InputGroupText><InputGroupInput placeholder="Small" type="number" /></InputGroup>
              <InputGroup size="default"><InputGroupText position="start">£</InputGroupText><InputGroupInput placeholder="Default" type="number" /></InputGroup>
              <InputGroup size="lg"><InputGroupText position="start">£</InputGroupText><InputGroupInput placeholder="Large" type="number" /></InputGroup>
              <InputGroup size="xl"><InputGroupText position="start">£</InputGroupText><InputGroupInput placeholder="X-Large" type="number" /></InputGroup>
            </div>
          </Row>
        </Section>

        <Section title="Textarea" description="Multiline text inputs — auto-expands with content.">
          <Row label="Sizes">
            <div className="w-full space-y-3 max-w-sm">
              <Textarea size="sm" placeholder="Small textarea" /><Textarea size="default" placeholder="Default textarea" /><Textarea size="lg" placeholder="Large textarea" />
            </div>
          </Row>
        </Section>

        <Section title="Rich Text Editor — Basic" description="Bold, italic, underline, lists and alignment. Use for short structured content like booking notes or member bios.">
          <Row label="Default">
            <div className="w-full">
              <RichTextEditor value={basicHtml} onChange={setBasicHtml} placeholder="Start typing your content..." />
            </div>
          </Row>
          {basicHtml && basicHtml !== "<p></p>" && (
            <Row label="HTML output">
              <pre className="w-full rounded-lg border border-border bg-muted p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">{basicHtml}</pre>
            </Row>
          )}
        </Section>

        <Section title="Rich Text Editor — Rich" description="Full formatting including headings, links, images, tables and code. Use for club descriptions, news articles and event pages.">
          <Row label="Default">
            <div className="w-full">
              <RichTextEditor variant="rich" value={richHtml} onChange={setRichHtml} placeholder="Start typing your content..." />
            </div>
          </Row>
          {richHtml && richHtml !== "<p></p>" && (
            <Row label="HTML output">
              <pre className="w-full rounded-lg border border-border bg-muted p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">{richHtml}</pre>
            </Row>
          )}
        </Section>

        <Section title="Select" description="Dropdown select with size variants.">
          <Row label="Sizes">
            <div className="w-full space-y-3 max-w-sm">
              <Select><SelectTrigger size="sm"><SelectValue placeholder="Small select" /></SelectTrigger><SelectContent><SelectItem value="o1">Option 1</SelectItem><SelectItem value="o2">Option 2</SelectItem></SelectContent></Select>
              <Select><SelectTrigger size="default"><SelectValue placeholder="Default select" /></SelectTrigger><SelectContent><SelectItem value="o1">Option 1</SelectItem><SelectItem value="o2">Option 2</SelectItem></SelectContent></Select>
              <Select><SelectTrigger size="lg"><SelectValue placeholder="Large select" /></SelectTrigger><SelectContent><SelectItem value="o1">Option 1</SelectItem><SelectItem value="o2">Option 2</SelectItem></SelectContent></Select>
            </div>
          </Row>
        </Section>

        <Section title="Slider" description="Single value and range sliders.">
          <Row label="Single value">
            <div className="w-full max-w-sm space-y-3">
              <Slider value={sliderValue} onValueChange={setSliderValue} min={0} max={100} step={1} tabIndex={-1} />
              <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
            </div>
          </Row>
          <Row label="Range">
            <div className="w-full max-w-sm space-y-3">
              <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={10} tabIndex={-1} />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>£{priceRange[0]}</span>
                <span>£{priceRange[1]}</span>
              </div>
            </div>
          </Row>
          <Row label="Disabled">
            <div className="w-full max-w-sm">
              <Slider defaultValue={[60]} min={0} max={100} step={1} disabled tabIndex={-1} />
            </div>
          </Row>
        </Section>

        <Section title="Form elements" description="Checkbox, radio and switch — all states.">
          <Row label="Checkbox">
            <div className="flex flex-wrap items-start gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                <div className="flex items-center gap-2"><Checkbox id="cb-unchecked" /><Label htmlFor="cb-unchecked">Unchecked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-checked" defaultChecked /><Label htmlFor="cb-checked">Checked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-indeterminate" checked="indeterminate" /><Label htmlFor="cb-indeterminate">Indeterminate</Label></div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                <div className="flex items-center gap-2"><Checkbox id="cb-d-un" disabled /><Label htmlFor="cb-d-un">Unchecked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-d-ch" disabled defaultChecked /><Label htmlFor="cb-d-ch">Checked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-d-in" disabled checked="indeterminate" /><Label htmlFor="cb-d-in">Indeterminate</Label></div>
              </div>
            </div>
          </Row>
          <Row label="Info — for table row selection">
            <div className="flex flex-wrap items-start gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                <div className="flex items-center gap-2"><Checkbox id="cb-info-un" variant="info" /><Label htmlFor="cb-info-un">Unchecked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-info-ch" variant="info" defaultChecked /><Label htmlFor="cb-info-ch">Checked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-info-in" variant="info" checked="indeterminate" /><Label htmlFor="cb-info-in">Indeterminate</Label></div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                <div className="flex items-center gap-2"><Checkbox id="cb-info-d-un" variant="info" disabled /><Label htmlFor="cb-info-d-un">Unchecked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-info-d-ch" variant="info" disabled defaultChecked /><Label htmlFor="cb-info-d-ch">Checked</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="cb-info-d-in" variant="info" disabled checked="indeterminate" /><Label htmlFor="cb-info-d-in">Indeterminate</Label></div>
              </div>
            </div>
          </Row>
          <Row label="Radio">
            <div className="flex flex-wrap items-start gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                <RadioGroup defaultValue="r-sel">
                  <div className="flex items-center gap-2"><RadioGroupItem value="r-un" id="r-un" /><Label htmlFor="r-un">Unselected</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="r-sel" id="r-sel" /><Label htmlFor="r-sel">Selected</Label></div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                <RadioGroup defaultValue="rd-sel">
                  <div className="flex items-center gap-2"><RadioGroupItem value="rd-un" id="rd-un" disabled /><Label htmlFor="rd-un">Unselected</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="rd-sel" id="rd-sel" disabled /><Label htmlFor="rd-sel">Selected</Label></div>
                </RadioGroup>
              </div>
            </div>
          </Row>
          <Row label="Switch">
            <div className="flex flex-wrap items-start gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default</p>
                <div className="flex items-center gap-2"><Switch id="sw-off" /><Label htmlFor="sw-off">Off</Label></div>
                <div className="flex items-center gap-2"><Switch id="sw-on" defaultChecked /><Label htmlFor="sw-on">On</Label></div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disabled</p>
                <div className="flex items-center gap-2"><Switch id="sw-d-off" disabled /><Label htmlFor="sw-d-off">Off</Label></div>
                <div className="flex items-center gap-2"><Switch id="sw-d-on" disabled defaultChecked /><Label htmlFor="sw-d-on">On</Label></div>
              </div>
            </div>
          </Row>
        </Section>

        <Section title="Avatar Upload" description="Profile photo upload — circular crop, locked to square aspect ratio.">
          <Row label="Sizes">
            <AvatarUpload size="sm" onUpload={(f: File) => toast.success(`Uploaded: ${f.name}`)} />
            <AvatarUpload size="default" onUpload={(f: File) => toast.success(`Uploaded: ${f.name}`)} />
            <AvatarUpload size="lg" onUpload={(f: File) => toast.success(`Uploaded: ${f.name}`)} />
            <AvatarUpload size="xl" onUpload={(f: File) => toast.success(`Uploaded: ${f.name}`)} />
          </Row>
        </Section>

        <Section title="Image Upload" description="Single image upload with drag and drop, preview, crop and remove.">
          <Row label="Default">
            <div className="w-full max-w-md"><ImageUpload placeholder="Drag & drop or click to upload club banner" onUpload={(file: File) => toast.success(`Uploaded: ${file.name}`)} /></div>
          </Row>
        </Section>

        <Section title="Image Upload — Multiple" description="Multi-image upload with grid preview, individual crop and remove.">
          <Row label="Default">
            <div className="w-full"><ImageUploadMultiple maxFiles={8} onUpload={(files: File[]) => toast.success(`Uploading ${files.length} images`)} /></div>
          </Row>
        </Section>

        <Section title="Field" description="Label, hint, error and required indicator — works with any input type.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <Field label="Full name" required hint="As it appears on your membership card"><Input placeholder="Rob Thomas" /></Field>
            <Field label="Email address" required><Input type="email" placeholder="rob@example.com" /></Field>
            <Field label="Sport">
              <Select><SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger><SelectContent><SelectItem value="tennis">Tennis</SelectItem><SelectItem value="padel">Padel</SelectItem><SelectItem value="squash">Squash</SelectItem><SelectItem value="pickleball">Pickleball</SelectItem></SelectContent></Select>
            </Field>
            <Field label="Notes" hint="Optional — visible to admins only"><Textarea placeholder="Any additional notes..." /></Field>
            <Field label="Email address" error="Please enter a valid email address" required><Input type="email" defaultValue="not-an-email" aria-invalid /></Field>
            <Field label="Username" disabled hint="Cannot be changed after registration"><Input defaultValue="robthomas" /></Field>
            <Field label="Booking window"><DateRangePicker value={dateRange} onChange={setDateRange} placeholder="Select dates" /></Field>
            <Field label="Profile photo" hint="JPG, PNG or WebP · max 2MB"><AvatarUpload size="default" onUpload={(f: File) => toast.success(`Uploaded: ${f.name}`)} /></Field>
          </div>
        </Section>

        <Section title="Single column layout" description="Stacked fields — suits narrow panels, drawers and modals.">
          <Card className="max-w-md">
            <CardHeader><CardTitle>Change password</CardTitle><CardDescription>Enter your current password to set a new one.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Field label="Current password" required><InputWithIcon type="password" placeholder="••••••••" leadingIcon={<LockIcon className="size-4" />} /></Field>
              <Field label="New password" required hint="Minimum 8 characters"><InputWithIcon type="password" placeholder="••••••••" leadingIcon={<LockIcon className="size-4" />} /></Field>
              <Field label="Confirm new password" required><InputWithIcon type="password" placeholder="••••••••" leadingIcon={<LockIcon className="size-4" />} /></Field>
            </CardContent>
            <CardFooter className="flex gap-3"><Button variant="outline" className="flex-1">Cancel</Button><Button className="flex-1">Update password</Button></CardFooter>
          </Card>
        </Section>

        <Section title="Two column layout" description="Side-by-side fields — suits wider pages and settings panels.">
          <Card>
            <CardHeader><CardTitle>Member profile</CardTitle><CardDescription>Update the member's personal details.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <FormRow>
                <Field label="First name" required><Input placeholder="Rob" /></Field>
                <Field label="Last name" required><Input placeholder="Thomas" /></Field>
              </FormRow>
              <FormRow>
                <Field label="Email address" required><InputWithIcon type="email" placeholder="rob@example.com" leadingIcon={<MailIcon className="size-4" />} /></Field>
                <Field label="Phone number"><InputWithIcon type="tel" placeholder="+44 7700 900000" leadingIcon={<PhoneIcon className="size-4" />} /></Field>
              </FormRow>
              <FormRow>
                <Field label="Membership type" required>
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="full">Full Member</SelectItem><SelectItem value="junior">Junior</SelectItem><SelectItem value="social">Social</SelectItem><SelectItem value="family">Family</SelectItem></SelectContent></Select>
                </Field>
                <Field label="Home club"><InputWithIcon placeholder="Wimbledon LTC" leadingIcon={<BuildingIcon className="size-4" />} /></Field>
              </FormRow>
              <Field label="Bio" hint="Displayed on the member's public profile"><Textarea placeholder="Tell us a bit about yourself..." className="min-h-[100px]" /></Field>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end"><Button variant="outline">Discard changes</Button><Button onClick={() => toast.success("Profile updated")}>Save profile</Button></CardFooter>
          </Card>
        </Section>

        <Section title="Sectioned layout" description="Groups of fields with headings — suits longer forms.">
          <Card>
            <CardHeader><CardTitle>Add court</CardTitle><CardDescription>Configure a new bookable court at this venue.</CardDescription></CardHeader>
            <CardContent className="space-y-8">
              <FormSection title="Court details">
                <FormRow>
                  <Field label="Court name" required><Input placeholder="Court 1" /></Field>
                  <Field label="Surface type" required>
                    <Select><SelectTrigger><SelectValue placeholder="Select surface" /></SelectTrigger><SelectContent><SelectItem value="hard">Hard court</SelectItem><SelectItem value="clay">Clay</SelectItem><SelectItem value="grass">Grass</SelectItem><SelectItem value="carpet">Carpet</SelectItem></SelectContent></Select>
                  </Field>
                </FormRow>
                <FormRow>
                  <Field label="Sport" required>
                    <Select><SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger><SelectContent><SelectItem value="tennis">Tennis</SelectItem><SelectItem value="padel">Padel</SelectItem><SelectItem value="squash">Squash</SelectItem></SelectContent></Select>
                  </Field>
                  <Field label="Max capacity" hint={`${capacity[0]} players`}>
                    <div className="pt-2"><Slider value={capacity} onValueChange={setCapacity} min={1} max={8} step={1} /></div>
                  </Field>
                </FormRow>
              </FormSection>
              <Separator />
              <FormSection title="Pricing">
                <FormRow>
                  <Field label="Peak rate (per hour)" required><InputGroup><InputGroupText position="start">£</InputGroupText><InputGroupInput type="number" placeholder="12.00" /></InputGroup></Field>
                  <Field label="Off-peak rate (per hour)"><InputGroup><InputGroupText position="start">£</InputGroupText><InputGroupInput type="number" placeholder="8.00" /></InputGroup></Field>
                </FormRow>
              </FormSection>
              <Separator />
              <FormSection title="Settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-foreground">Online booking</p><p className="text-xs text-muted-foreground">Allow members to book this court online</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-foreground">Require approval</p><p className="text-xs text-muted-foreground">Admin must approve each booking</p></div><Switch /></div>
                </div>
              </FormSection>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end"><Button variant="outline">Cancel</Button><Button onClick={() => toast.success("Court created")}>Create court</Button></CardFooter>
          </Card>
        </Section>

        <Section title="Validation states" description="Error and success feedback on form submission.">
          <div className="space-y-6 max-w-lg">
            <Alert variant="destructive-outline"><AlertCircleIcon className="size-4" /><AlertTitle>Please fix the errors below</AlertTitle><AlertDescription>3 fields require your attention before you can continue.</AlertDescription></Alert>
            <Field label="Email address" required error="Please enter a valid email address"><InputWithIcon type="email" defaultValue="not-an-email" leadingIcon={<MailIcon className="size-4" />} aria-invalid /></Field>
            <Field label="Username" required error="This username is already taken"><InputWithIcon defaultValue="robthomas" leadingIcon={<UserIcon className="size-4" />} aria-invalid /></Field>
            <Alert variant="success-outline"><CheckCircleIcon className="size-4" /><AlertTitle>All fields valid</AlertTitle><AlertDescription>Your form is ready to submit.</AlertDescription></Alert>
          </div>
        </Section>

        <Section title="Choice fields" description="Radio groups and checkbox groups in form context.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Field label="Membership type" required>
              <RadioGroup defaultValue="full" className="mt-1 space-y-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="full" id="m-full" /><Label htmlFor="m-full">Full Member</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="junior" id="m-junior" /><Label htmlFor="m-junior">Junior</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="social" id="m-social" /><Label htmlFor="m-social">Social</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="family" id="m-family" /><Label htmlFor="m-family">Family</Label></div>
              </RadioGroup>
            </Field>
            <Field label="Notifications" hint="Choose what you'd like to be notified about">
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2"><Checkbox id="n-bookings" defaultChecked /><Label htmlFor="n-bookings">Booking confirmations</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="n-reminders" defaultChecked /><Label htmlFor="n-reminders">Booking reminders</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="n-renewals" /><Label htmlFor="n-renewals">Membership renewals</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="n-marketing" /><Label htmlFor="n-marketing">News and offers</Label></div>
              </div>
            </Field>
          </div>
        </Section>

        <Section title="Media fields" description="Image and avatar upload in form context.">
          <Card className="max-w-lg">
            <CardHeader><CardTitle>Club branding</CardTitle><CardDescription>Upload your club logo and banner image.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <Field label="Club logo" hint="Square image recommended · max 2MB"><AvatarUpload size="lg" onUpload={(f: File) => toast.success(`Logo uploaded: ${f.name}`)} /></Field>
              <Field label="Club banner" hint="16:9 ratio recommended · max 2MB"><ImageUpload placeholder="Upload club banner" onUpload={(f: File) => toast.success(`Banner uploaded: ${f.name}`)} /></Field>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end"><Button variant="outline">Discard</Button><Button onClick={() => toast.success("Branding saved")}>Save branding</Button></CardFooter>
          </Card>
        </Section>

      </div>
    </div>
    </TooltipProvider>
  )
}

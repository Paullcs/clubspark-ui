"use client"

import { useState } from "react"
import { PreviewBar } from "@/components/ui/preview-bar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, RadialBar, RadialBarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
import { TrendingUpIcon } from "lucide-react"

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" }, bookings: { label: "Bookings", color: "var(--chart-2)" } } satisfies ChartConfig
const utilisationConfig = { confirmed: { label: "Confirmed", color: "var(--chart-1)" }, pending: { label: "Pending", color: "var(--chart-3)" }, cancelled: { label: "Cancelled", color: "var(--chart-4)" } } satisfies ChartConfig
const courtConfig = { bookings: { label: "Bookings", color: "var(--chart-1)" } } satisfies ChartConfig
const memberGrowthConfig = { members: { label: "Total Members", color: "var(--chart-1)" }, active: { label: "Active", color: "var(--chart-2)" }, new: { label: "New", color: "var(--chart-6)" } } satisfies ChartConfig
const membershipConfig = { full: { label: "Full Member", color: "var(--chart-1)" }, junior: { label: "Junior", color: "var(--chart-2)" }, social: { label: "Social", color: "var(--chart-3)" }, family: { label: "Family", color: "var(--chart-6)" } } satisfies ChartConfig
const utilisationRadialConfig = { utilisation: { label: "Utilisation", color: "var(--chart-1)" } } satisfies ChartConfig

const fullRevenueData = [
  { date: "2025-10-01", revenue: 3200, bookings: 84 }, { date: "2025-10-08", revenue: 2900, bookings: 76 },
  { date: "2025-11-01", revenue: 2800, bookings: 72 }, { date: "2025-11-08", revenue: 2600, bookings: 68 },
  { date: "2025-12-01", revenue: 2100, bookings: 55 }, { date: "2025-12-08", revenue: 1900, bookings: 50 },
  { date: "2026-01-01", revenue: 3600, bookings: 98 }, { date: "2026-01-08", revenue: 3800, bookings: 104 },
  { date: "2026-02-01", revenue: 4100, bookings: 112 }, { date: "2026-02-08", revenue: 4050, bookings: 110 },
  { date: "2026-03-01", revenue: 4280, bookings: 124 }, { date: "2026-03-08", revenue: 4300, bookings: 126 },
  { date: "2026-03-15", revenue: 4350, bookings: 128 }, { date: "2026-03-22", revenue: 4400, bookings: 130 },
]
const utilisationData = [{ day: "Mon", confirmed: 12, pending: 3, cancelled: 1 }, { day: "Tue", confirmed: 8, pending: 2, cancelled: 0 }, { day: "Wed", confirmed: 15, pending: 4, cancelled: 2 }, { day: "Thu", confirmed: 11, pending: 1, cancelled: 1 }, { day: "Fri", confirmed: 18, pending: 5, cancelled: 2 }, { day: "Sat", confirmed: 24, pending: 6, cancelled: 3 }, { day: "Sun", confirmed: 20, pending: 4, cancelled: 1 }]
const courtData = [{ court: "Court 1", bookings: 48 }, { court: "Court 2", bookings: 39 }, { court: "Court 3", bookings: 35 }, { court: "Court 4", bookings: 28 }, { court: "Court 5", bookings: 18 }]
const memberGrowthData = [
  { month: "Apr '25", members: 98,  active: 82,  new: 6  },
  { month: "May",     members: 104, active: 87,  new: 8  },
  { month: "Jun",     members: 109, active: 91,  new: 7  },
  { month: "Jul",     members: 112, active: 93,  new: 5  },
  { month: "Aug",     members: 118, active: 98,  new: 9  },
  { month: "Sep",     members: 122, active: 101, new: 7  },
  { month: "Oct",     members: 128, active: 106, new: 8  },
  { month: "Nov",     members: 134, active: 110, new: 9  },
  { month: "Dec",     members: 131, active: 107, new: 4  },
  { month: "Jan '26", members: 140, active: 115, new: 12 },
  { month: "Feb",     members: 148, active: 122, new: 10 },
  { month: "Mar",     members: 156, active: 129, new: 11 },
]
const membershipData = [{ type: "full", value: 82, fill: "var(--color-full)" }, { type: "junior", value: 34, fill: "var(--color-junior)" }, { type: "social", value: 28, fill: "var(--color-social)" }, { type: "family", value: 12, fill: "var(--color-family)" }]

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

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>
}

export default function ChartsPage() {
  const [timeRange, setTimeRange] = useState("90d")

  const filteredData = fullRevenueData.filter((d) => {
    const date = new Date(d.date)
    const now = new Date("2026-03-22")
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() - days)
    return date >= cutoff
  })

  const totalMembers = membershipData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="charts" />
      <div className="max-w-5xl mx-auto px-8 py-10">

        <Section title="Area Chart — Interactive" description="Revenue and bookings with time range selector.">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div><CardTitle>Revenue & Bookings</CardTitle><CardDescription>Showing totals for the selected period</CardDescription></div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger size="sm" className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="7d">Last 7 days</SelectItem><SelectItem value="30d">Last 30 days</SelectItem><SelectItem value="90d">Last 90 days</SelectItem></SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className="h-[300px] w-full">
                <AreaChart data={filteredData} accessibilityLayer>
                  <defs>
                    <linearGradient id="fillRevenue2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.0} /></linearGradient>
                    <linearGradient id="fillBookings2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-bookings)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0.0} /></linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(v) => new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} />
                  <YAxis yAxisId="revenue" tickLine={false} axisLine={false} tickFormatter={(v) => `£${(v/1000).toFixed(1)}k`} width={55} />
                  <YAxis yAxisId="bookings" orientation="right" tickLine={false} axisLine={false} width={35} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area yAxisId="revenue" dataKey="revenue" type="monotone" fill="url(#fillRevenue2)" stroke="var(--color-revenue)" strokeWidth={2} />
                  <Area yAxisId="bookings" dataKey="bookings" type="monotone" fill="url(#fillBookings2)" stroke="var(--color-bookings)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </Section>

        <Section title="Bar Charts" description="Vertical stacked and horizontal.">
          <Grid>
            <Card>
              <CardHeader><CardTitle>Bookings by Status</CardTitle><CardDescription>Stacked by day this week</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={utilisationConfig} className="h-[240px] w-full">
                  <BarChart data={utilisationData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="confirmed" fill="var(--color-confirmed)" stackId="a" radius={[0,0,0,0]} />
                    <Bar dataKey="pending" fill="var(--color-pending)" stackId="a" radius={[0,0,0,0]} />
                    <Bar dataKey="cancelled" fill="var(--color-cancelled)" stackId="a" radius={[4,4,0,0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground flex items-center gap-1.5"><TrendingUpIcon className="size-4 text-success" />Saturdays remain the busiest day</CardFooter>
            </Card>
            <Card>
              <CardHeader><CardTitle>Bookings by Court</CardTitle><CardDescription>Total bookings this month</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={courtConfig} className="h-[240px] w-full">
                  <BarChart data={courtData} layout="vertical" accessibilityLayer>
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="court" type="category" tickLine={false} axisLine={false} tickMargin={8} width={55} />
                    <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4}><LabelList dataKey="bookings" position="right" className="fill-foreground text-xs" /></Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground flex items-center gap-1.5"><TrendingUpIcon className="size-4 text-success" />Court 1 accounts for 28% of all bookings</CardFooter>
            </Card>
          </Grid>
        </Section>

        <Section title="Line Chart" description="Member growth over time.">
          <Card>
            <CardHeader><CardTitle>Member Growth</CardTitle><CardDescription>Active members — last 6 months</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={memberGrowthConfig} className="h-[240px] w-full">
                <LineChart data={memberGrowthData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[120, 165]} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="members" type="monotone" stroke="var(--color-members)" strokeWidth={2} dot={{ fill: "var(--color-members)", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground flex items-center gap-1.5"><TrendingUpIcon className="size-4 text-success" />Up 21.9% over the period</CardFooter>
          </Card>
        </Section>

        <Section title="Pie & Radial Charts" description="Proportions and single KPI gauges.">
          <Grid>
            <Card>
              <CardHeader><CardTitle>Membership Breakdown</CardTitle><CardDescription>By type — current period</CardDescription></CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer config={membershipConfig} className="h-[260px] w-full max-w-xs">
                  <PieChart accessibilityLayer>
                    <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
                    <Pie data={membershipData} dataKey="value" nameKey="type" innerRadius={72} outerRadius={108} paddingAngle={3} strokeWidth={0}>
                      {membershipData.map((entry) => (<Cell key={entry.type} fill={entry.fill} />))}
                      <LabelList dataKey="value" position="inside" className="fill-white text-xs font-medium" />
                    </Pie>
                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">{totalMembers}</text>
                    <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">Members</text>
                    <ChartLegend content={<ChartLegendContent nameKey="type" />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Court Utilisation</CardTitle><CardDescription>Average this week</CardDescription></CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer config={utilisationRadialConfig} className="h-[260px] w-full max-w-xs">
                  <RadialBarChart data={[{ name: "utilisation", value: 72, fill: "var(--color-utilisation)" }]} startAngle={90} endAngle={90 - (72 / 100) * 360} innerRadius={80} outerRadius={110} accessibilityLayer>
                    <RadialBar dataKey="value" background={{ fill: "var(--muted)" }} cornerRadius={8} />
                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">72%</text>
                    <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">Utilisation</text>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground flex items-center gap-1.5"><TrendingUpIcon className="size-4 text-success" />Up from 68% last week</CardFooter>
            </Card>
          </Grid>
        </Section>

      </div>
    </div>
  )
}

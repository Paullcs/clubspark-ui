"use client"

import * as React from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarIcon, UsersIcon, MoreHorizontalIcon } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts"

// ─── Sample data ──────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Oct", revenue: 4200, bookings: 38 },
  { month: "Nov", revenue: 3800, bookings: 34 },
  { month: "Dec", revenue: 5100, bookings: 46 },
  { month: "Jan", revenue: 4600, bookings: 41 },
  { month: "Feb", revenue: 5800, bookings: 52 },
  { month: "Mar", revenue: 6200, bookings: 58 },
]

const recentBookings = [
  { ref: "BK-3E83", name: "Rob Thomas",    initials: "RT", court: "Court 1 Full", date: "28 Mar", status: "confirmed", amount: "£12.00" },
  { ref: "BK-3E84", name: "Sarah Okafor",  initials: "SO", court: "Court 2 Half", date: "28 Mar", status: "pending",   amount: "£8.00"  },
  { ref: "BK-3E85", name: "James Whittle", initials: "JW", court: "Court 1 Full", date: "29 Mar", status: "confirmed", amount: "£18.00" },
  { ref: "BK-3E86", name: "Priya Nair",    initials: "PN", court: "Court 3 Full", date: "29 Mar", status: "cancelled", amount: "—"      },
  { ref: "BK-3E87", name: "Marcus Webb",   initials: "MW", court: "Court 2 Full", date: "29 Mar", status: "confirmed", amount: "£24.00" },
]

const statusVariant: Record<string, "success" | "pending" | "destructive"> = {
  confirmed: "success",
  pending:   "pending",
  cancelled: "destructive",
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Paul. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="size-4 mr-1.5" />
            Last 30 days
          </Button>
          <Button size="sm">New booking</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total bookings"
          value="58"
          description="This month"
          trend={{ value: "+12%", direction: "up" }}
        />
        <StatCard
          title="Active members"
          value="247"
          description="Registered members"
          trend={{ value: "+8", direction: "up" }}
        />
        <StatCard
          title="Revenue (Mar)"
          value="£6,200"
          description="vs £5,800 last month"
          trend={{ value: "+7%", direction: "up" }}
        />
        <StatCard
          title="Court utilisation"
          value="74%"
          description="Across all courts"
          trend={{ value: "-3%", direction: "down" }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">

        {/* Revenue bar chart */}
        <div className="col-span-2 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Revenue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `£${v}`} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 12 }}
                formatter={(v) => [`£${v}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings line chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Bookings</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 12 }}
              />
              <Line dataKey="bookings" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: "var(--chart-2)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent bookings */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recent bookings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest activity across all courts</p>
          </div>
          <Button variant="outline" size="sm">View all</Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-table-header-bg">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Court</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentBookings.map((b) => (
              <tr key={b.ref} className="hover:bg-table-row-hover transition-colors">
                <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{b.ref}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="xs">
                      <AvatarFallback>{b.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{b.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-muted-foreground">{b.court}</td>
                <td className="px-6 py-3.5 text-muted-foreground">{b.date}</td>
                <td className="px-6 py-3.5">
                  <Badge variant={statusVariant[b.status]} className="capitalize">
                    {b.status}
                  </Badge>
                </td>
                <td className="px-6 py-3.5 text-right font-medium text-foreground">{b.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

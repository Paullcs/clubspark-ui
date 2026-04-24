"use client"

import React, { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PricingCard, type PricingCardProps } from "./pricing-card"

const DEFAULT_PLANS: (Omit<PricingCardProps, "price" | "period" | "description"> & {
  monthlyPrice: string
  yearlyPrice: string
  period: { monthly: string; yearly: string }
  description: { monthly: string; yearly: string }
})[] = [
  {
    name: "Basic Plan",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: { monthly: "Per month/user", yearly: "Per year/user" },
    description: {
      monthly: "Ideal for individuals getting started with our service. No credit card required.",
      yearly:  "Ideal for individuals getting started with our service. No credit card required.",
    },
    buttonText: "Start for Free",
    highlighted: false,
    features: ["Limited Access Features", "Basic Support", "Weekly Blogs", "100GB Drive", "All framework support"],
  },
  {
    name: "Standard Plan",
    monthlyPrice: "$20",
    yearlyPrice: "$200",
    period: { monthly: "Per month/user", yearly: "Per year/user" },
    description: {
      monthly: "Perfect for small businesses looking to grow. Start with a 30-day free trial.",
      yearly:  "Perfect for small businesses looking to grow. Save 16% compared to monthly billing.",
    },
    buttonText: "Get Started",
    highlighted: true,
    badge: "Popular",
    features: ["Limited Access Features", "Basic Support", "Weekly Blogs", "100GB Drive", "All framework support"],
  },
  {
    name: "Premium Plan",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    period: { monthly: "Per month/user", yearly: "Per year/user" },
    description: {
      monthly: "Best for large organizations with advanced needs. Contact us for a custom quote.",
      yearly:  "Best for large organizations with advanced needs. Contact us for a custom quote.",
    },
    buttonText: "Get Started",
    highlighted: false,
    features: ["Limited Access Features", "Basic Support", "Weekly Blogs", "100GB Drive", "All framework support"],
  },
]

export function PricingTable() {
  const [billingCycle, setBillingCycle] = useState("monthly")

  return (
    <section className="flex flex-col gap-10 py-16">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-center text-5xl font-bold tracking-tight text-foreground">Simple Pricing Plans</h2>
        <ToggleGroup
          type="single"
          value={billingCycle}
          onValueChange={(value) => { if (value && value !== billingCycle) setBillingCycle(value) }}
          className="rounded-lg bg-muted p-1"
        >
          <ToggleGroupItem value="monthly" className="h-8 w-32 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm text-muted-foreground">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="yearly"  className="h-8 w-32 rounded-md data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm text-muted-foreground">Yearly</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl mx-auto">
        {DEFAULT_PLANS.map((plan, i) => (
          <PricingCard
            key={i}
            name={plan.name}
            price={billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
            period={billingCycle === "monthly" ? plan.period.monthly : plan.period.yearly}
            description={billingCycle === "monthly" ? plan.description.monthly : plan.description.yearly}
            buttonText={plan.buttonText}
            features={plan.features}
            highlighted={plan.highlighted}
            badge={plan.badge}
          />
        ))}
      </div>
    </section>
  )
}

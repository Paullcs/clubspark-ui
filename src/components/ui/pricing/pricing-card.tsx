"use client"

import { BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type PricingCardProps = {
  name: string
  price: string
  period: string
  description: string
  buttonText: string
  features: string[]
  highlighted?: boolean
  badge?: string
  onButtonClick?: () => void
  className?: string
}

export function PricingCard({
  name,
  price,
  period,
  description,
  buttonText,
  features,
  highlighted = false,
  badge,
  onButtonClick,
  className,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative w-full rounded-3xl shadow-sm",
        highlighted ? "border-2 border-primary" : "border-border",
        className
      )}
    >
      {badge && (
        <div className="absolute top-4 right-4">
          <Badge variant="default">{badge}</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
        <div className="mt-4">
          <div className="text-5xl font-semibold tracking-tight text-muted-foreground">{price}</div>
          <div className="text-xs text-muted-foreground">{period}</div>
        </div>
      </CardHeader>
      <CardContent className="px-7 pt-6">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button className="mt-6 w-full" onClick={onButtonClick}>{buttonText}</Button>
        <div className="relative mt-12 mb-4 flex items-center justify-center overflow-hidden">
          <Separator />
          <span className="px-3 text-xs text-muted-foreground opacity-50">FEATURES</span>
          <Separator />
        </div>
        <ul className="mt-6 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <BadgeCheck className="size-5 text-muted-foreground" />
              <span className="ml-3 text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

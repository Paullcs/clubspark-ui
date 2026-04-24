"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { FaqItem } from "./faq-section-1"

export interface FaqSection2Props {
  className?: string
  heading?: string
  description?: string
  items?: FaqItem[]
}

const defaultItems: FaqItem[] = [
  { question: "How do I set up online bookings?", answer: "You can enable online bookings from your venue settings. Once activated, members can book courts directly from your public booking page." },
  { question: "Can I manage multiple venues from one account?", answer: "Yes — Clubspark supports multi-venue management from a single admin portal with role-based access control per venue." },
  { question: "How do recurring bookings work?", answer: "Recurring bookings use iCal RRULE format. Set a frequency, count or end date and the system handles the rest automatically." },
  { question: "What payment methods are supported?", answer: "Clubspark supports card payments via Stripe, including Apple Pay and Google Pay. Bank transfer and pay-on-arrival options are also available." },
  { question: "Can members manage their own bookings?", answer: "Yes — members have their own account area where they can view, amend and cancel bookings subject to your venue's cancellation policy." },
]

export function FaqSection2({
  className,
  heading = "Frequently asked questions",
  description = "Everything you need to know about managing your club with Clubspark.",
  items = defaultItems,
}: FaqSection2Props) {
  return (
    <section className={cn("py-24", className)}>
      <div className="max-w-3xl mx-auto px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">{heading}</h2>
          {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
        </div>
        <Accordion type="single" collapsible variant="plus">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent><p className="text-muted-foreground">{item.answer}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

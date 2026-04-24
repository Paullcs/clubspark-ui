"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { FaqSection1, FaqSection2, FaqSection3 } from "@/blocks/faq"

const faqItems = [
  { question: "How do I set up online bookings?", answer: "You can enable online bookings from your venue settings. Once activated, members can book courts directly from your public booking page." },
  { question: "Can I manage multiple venues from one account?", answer: "Yes — Clubspark supports multi-venue management from a single admin portal with role-based access control per venue." },
  { question: "How do recurring bookings work?", answer: "Recurring bookings use iCal RRULE format. Set a frequency, count or end date and the system handles the rest automatically." },
  { question: "What payment methods are supported?", answer: "Clubspark supports card payments via Stripe, including Apple Pay and Google Pay. Bank transfer and pay-on-arrival options are also available." },
  { question: "Can members manage their own bookings?", answer: "Yes — members have their own account area where they can view, amend and cancel bookings subject to your venue's cancellation policy." },
]

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="mb-6 border-b border-border pb-3 px-8">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default function BlocksFaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="faq" />
      <div className="py-10">
        <Section title="FAQ Section 1" description="Standard accordion with chevron trigger.">
          <FaqSection1
            heading="Frequently asked questions"
            description="Everything you need to know about managing your club with Clubspark."
            items={faqItems}
          />
        </Section>
        <Section title="FAQ Section 2" description="Card style — each item in its own bordered card with plus/minus trigger.">
          <FaqSection2
            heading="Frequently asked questions"
            description="Everything you need to know about managing your club with Clubspark."
            items={faqItems}
          />
        </Section>
        <Section title="FAQ Section 3" description="Connected style — items share borders with rounded top and bottom.">
          <FaqSection3
            heading="Frequently asked questions"
            description="Everything you need to know about managing your club with Clubspark."
            items={faqItems}
          />
        </Section>
      </div>
    </div>
  )
}

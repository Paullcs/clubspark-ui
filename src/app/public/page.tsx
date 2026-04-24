"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { HeroSection1 } from "@/blocks/hero"
import { PricingTable } from "@/blocks/pricing"
import { FooterPublic1 } from "@/blocks/footer"

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="public" />
      <HeroSection1 />
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <PricingTable />
      </div>
      <FooterPublic1 />
    </div>
  )
}

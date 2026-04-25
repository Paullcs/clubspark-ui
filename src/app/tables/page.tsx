"use client"

import { PreviewBar } from "@/components/ui/preview-bar"
import { DataTable15 } from "@/components/ui/tables/data-table-fixed"

export default function TablesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PreviewBar activePage="tables" />
      <DataTable15 />
    </div>
  )
}

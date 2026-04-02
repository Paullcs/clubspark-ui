"use client"

// ─────────────────────────────────────────────────────────────────────────────
// DataTableProvider
//
// Wrap your app or layout with this to set default config for all tables.
// Individual tables can override any prop they need.
//
// Usage in your layout:
//
//   <DataTableProvider defaults={{
//     stickyHeader:    true,
//     maxHeight:       "480px",
//     defaultPageSize: 10,
//     exportable:      true,
//     resizable:       false,
//     emptyMessage:    "No results found.",
//   }}>
//     <App />
//   </DataTableProvider>
//
// Individual override — just pass the prop directly on the table:
//
//   <DataTableFixed defaultPageSize={5} exportable={false} ... />
//
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import { StickyColumns } from "@/components/ui/data-table-fixed"

// ─── Full config shape ────────────────────────────────────────────────────────
// Every configurable prop across DataTableFixed and DataTableFluid.

export type DataTableDefaults = {
  // ── Layout ──────────────────────────────────────────────────────────────────
  // Fixed only
  stickyHeader?:  boolean        // freeze header row when scrolling vertically
  stickyColumns?: StickyColumns  // pin columns: { start: 1 } or { start: 1, end: 1 }
  maxHeight?:     string         // e.g. "480px" — enables vertical scroll on the table
  resizable?:     boolean        // allow columns to be resized by dragging their edges

  // ── Pagination ───────────────────────────────────────────────────────────────
  defaultPageSize?:  number      // how many rows to show per page
  pageSizeOptions?:  number[]    // choices in the rows-per-page dropdown

  // ── Features ─────────────────────────────────────────────────────────────────
  exportable?:     boolean       // show the Export CSV button in the toolbar
  exportFilename?: string        // filename used when exporting (without .csv)
  loading?:        boolean       // show skeleton rows instead of data
  loadingRows?:    number        // how many skeleton rows to show when loading

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyMessage?:   string        // message shown when there are no rows to display
}

// ─── Fallback defaults ────────────────────────────────────────────────────────
// These apply when neither the provider nor the table prop supplies a value.

const fallbackDefaults: Required<DataTableDefaults> = {
  stickyHeader:    true,
  stickyColumns:   undefined as any,
  maxHeight:       "480px",
  resizable:       false,
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  exportable:      false,
  exportFilename:  "export",
  loading:         false,
  loadingRows:     8,
  emptyMessage:    "No results found.",
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DataTableContext = React.createContext<DataTableDefaults>(fallbackDefaults)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DataTableProvider({
  children,
  defaults,
}: {
  children: React.ReactNode
  defaults?: DataTableDefaults
}) {
  const value = React.useMemo(
    () => ({ ...fallbackDefaults, ...defaults }),
    [defaults]
  )
  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Used internally by DataTableFixed and DataTableFluid.
// Resolution order: table prop → provider default → fallback default

export function useDataTableDefaults(
  tableProps: DataTableDefaults
): Required<DataTableDefaults> {
  const ctx = React.useContext(DataTableContext)
  return {
    stickyHeader:    tableProps.stickyHeader    ?? ctx.stickyHeader    ?? fallbackDefaults.stickyHeader,
    stickyColumns:   tableProps.stickyColumns   ?? ctx.stickyColumns   ?? fallbackDefaults.stickyColumns,
    maxHeight:       tableProps.maxHeight       ?? ctx.maxHeight       ?? fallbackDefaults.maxHeight,
    resizable:       tableProps.resizable       ?? ctx.resizable       ?? fallbackDefaults.resizable,
    defaultPageSize: tableProps.defaultPageSize ?? ctx.defaultPageSize ?? fallbackDefaults.defaultPageSize,
    pageSizeOptions: tableProps.pageSizeOptions ?? ctx.pageSizeOptions ?? fallbackDefaults.pageSizeOptions,
    exportable:      tableProps.exportable      ?? ctx.exportable      ?? fallbackDefaults.exportable,
    exportFilename:  tableProps.exportFilename  ?? ctx.exportFilename  ?? fallbackDefaults.exportFilename,
    loading:         tableProps.loading         ?? ctx.loading         ?? fallbackDefaults.loading,
    loadingRows:     tableProps.loadingRows     ?? ctx.loadingRows     ?? fallbackDefaults.loadingRows,
    emptyMessage:    tableProps.emptyMessage    ?? ctx.emptyMessage    ?? fallbackDefaults.emptyMessage,
  }
}

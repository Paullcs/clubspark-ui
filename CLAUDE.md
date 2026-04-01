# Clubspark UI — Design System Context

## Project
- Next.js 15 + shadcn v4 + Tailwind v4.2.2 + Radix UI
- Location: ~/clubspark-ui
- GitHub: github.com/Paulics/clubspark-ui
- Font: DM Sans (Google Fonts)
- Icons: Lucide React

## Brand Colours
- Primary: #0026AF
- Accent: #02E075
- Success: #1A7A3C
- Active/Live: #169E8F
- Info: #004DEE
- Pending: #FFD177
- Warning: #DC5100
- Destructive: #D42F42
- Highlight: #6E56F2
- Neutral: #272F45

## Component Sizes
- Buttons/inputs: sm=32px, default=40px, lg=48px, xl=56px
- Avatar: 24/28/32/40/48/64/80/96px

## Completed Components
button, badge, alert, input, textarea, select, label, 
checkbox, switch, radio-group, avatar, progress, skeleton,
breadcrumb, table, dropdown-menu, tooltip, input-with-icon,
search-input, accordion, dialog, sheet, popover, tabs,
slider, separator, pagination, command, sonner, calendar,
navigation-menu, card

## Preview Page
- Located at src/app/components/page.tsx
- Viewable at http://localhost:3000/components

## Outstanding Items
- Fix preview page import errors (table, pagination, card, command)
- Button variants don't match Figma — need remapping
- Add TanStack table for advanced data tables
- Build demo screens (dashboard, bookings, orders)
- Consider Phosphor icons vs Lucide
- Shadcn studio for blocks (don't let it touch globals.css)
- Size variants for checkbox, radio, switch (deferred)
- Dark mode portal fix applied via document.documentElement

## Key Files
- src/app/globals.css — all design tokens
- src/app/components/page.tsx — preview page
- src/components/ui/ — all components
import fs from 'fs'
import path from 'path'

const base    = JSON.parse(fs.readFileSync('./tokens/base.json', 'utf8'))
const brandsDir  = './tokens/brands'
const brandFiles = fs.readdirSync(brandsDir).filter(f => f.endsWith('.json')).sort()
const brands     = brandFiles.map(f => ({
  filename: f,
  theme:    path.basename(f, '.json'),
  tokens:   JSON.parse(fs.readFileSync(path.join(brandsDir, f), 'utf8')),
}))

const cs = brands.find(b => b.theme === 'clubspark-admin').tokens

function flatTokens(obj, prefix = '', indent = '  ') {
  return Object.entries(obj)
    .filter(([k]) => !k.startsWith('$'))
    .flatMap(([key, val]) => {
      const cssKey = prefix ? `${prefix}-${key === 'DEFAULT' ? '' : key}`.replace(/-$/, '') : key
      if (val && typeof val === 'object' && val.$value === undefined) {
        return flatTokens(val, cssKey, indent).split('\n').filter(Boolean)
      }
      if (val?.$value !== undefined) return [`${indent}--${cssKey}: ${val.$value};`]
      return []
    }).join('\n')
}

function themeVars(tokens, indent = '  ') {
  return Object.entries(tokens)
    .filter(([k, v]) => !k.startsWith('$') && v?.$value !== undefined)
    .map(([k, v]) => `${indent}--${k}: ${v.$value};`)
    .join('\n')
}

function darkBlock(selector, tokens) {
  const n = s => tokens[`neutral-${s}`]?.$value ?? ''
  const p = s => tokens[`primary-${s}`]?.$value ?? ''
  return `${selector}.dark,\n${selector} .dark {\n` +
    `  --background: ${n(900)};\n  --foreground: ${n(100)};\n` +
    `  --card: ${n(800)};\n  --card-foreground: ${n(100)};\n` +
    `  --popover: ${n(800)};\n  --popover-foreground: ${n(100)};\n` +
    `  --primary: ${p(400)};\n  --primary-foreground: ${p(900)};\n` +
    `  --secondary: ${n(700)};\n  --secondary-foreground: ${n(100)};\n` +
    `  --muted: ${n(700)};\n  --muted-foreground: ${n(300)};\n` +
    `  --accent: ${n(700)};\n  --accent-foreground: ${n(100)};\n` +
    `  --border: ${n(700)};\n  --input: ${n(700)};\n` +
    `  --ring: ${p(400)};\n  --link: ${p(400)};\n  --link-hover: ${p(300)};\n` +
    `  --focus-ring: ${p(400)};\n` +
    `  --disabled-bg: ${n(700)};\n  --disabled-text: ${n(500)};\n  --disabled-border: ${n(700)};\n` +
    `  --placeholder: ${n(500)};\n` +
    `  --table-header-bg: ${n(800)};\n  --table-header-hover: ${n(700)};\n  --table-header-sticky-bg: ${n(800)};\n` +
    `  --table-row-bg: ${n(800)};\n` +
    `  --table-row-hover: ${n(700)};\n` +
    `  --table-row-selected: hsl(221 100% 20%);\n` +
    `  --table-row-selected-border: hsl(221 90% 62%);\n` +
    `  --table-row-expanded-bg: ${n(700)};\n` +
    `  --table-bulk-bar-bg: ${n(700)};\n` +
    `  --sidebar: ${n(800)};\n  --sidebar-foreground: ${n(100)};\n` +
    `  --sidebar-primary: ${p(400)};\n  --sidebar-primary-foreground: ${p(900)};\n` +
    `  --sidebar-accent: ${n(700)};\n  --sidebar-accent-foreground: ${n(100)};\n` +
    `  --sidebar-border: ${n(700)};\n  --sidebar-ring: ${p(400)};\n` +
    `  --chart-1: ${p(400)};\n  --chart-2: ${tokens['accent-400']?.$value ?? p(400)};\n` +
    `  --chart-3: ${p(300)};\n  --chart-4: ${tokens['accent-500']?.$value ?? p(500)};\n` +
    `  --chart-5: ${p(500)};\n  --chart-6: ${tokens['accent-300']?.$value ?? p(300)};\n` +
    `  --chart-7: ${p(200)};\n  --chart-8: ${tokens['accent-600']?.$value ?? p(600)};\n}\n`
}

const tableTokens = `
  --table-header-bg: var(--neutral-50);
  --table-header-hover: var(--neutral-100);
  --table-header-sticky-bg: var(--neutral-50);
  --table-header-resize: var(--primary);
  --table-row-bg: var(--background);
  --table-row-hover: var(--neutral-50);
  --table-row-expanded-bg: var(--muted);
  --table-bulk-bar-bg: var(--muted);
  --table-row-selected: var(--info-subtle);
  --table-row-selected-border: var(--info);
  --chart-1: var(--primary-600);
  --chart-2: var(--accent-500);
  --chart-3: var(--primary-400);
  --chart-4: var(--accent-700);
  --chart-5: var(--primary-700);
  --chart-6: var(--accent-400);
  --chart-7: var(--primary-300);
  --chart-8: var(--accent-600);
  --sidebar: hsl(0 0% 100%);
  --sidebar-foreground: var(--neutral-800);
  --sidebar-primary: var(--primary-500);
  --sidebar-primary-foreground: var(--primary-50);
  --sidebar-accent: var(--neutral-100);
  --sidebar-accent-foreground: var(--neutral-800);
  --sidebar-border: var(--neutral-200);
  --sidebar-ring: var(--primary-500);`

let css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

/* !! GENERATED FILE — do not edit manually !! */


/* 1. BASE TOKENS */
:root {
${flatTokens(base)}
}


/* 1b. DEFAULT SEMANTIC TOKENS — needed by @theme inline */
:root {
  --accent-btn: hsl(151 98% 44%);
  --accent-btn-foreground: hsl(0 0% 100%);
}

/* 2. DARK MODE BASE */
.dark {
  --success: hsl(141 60% 52%); --success-foreground: hsl(141 65% 8%); --success-subtle: hsl(141 65% 13%); --success-border: hsl(141 65% 23%); --success-text: hsl(141 60% 52%);
  --active: hsl(173 70% 52%); --active-foreground: hsl(173 76% 10%); --active-subtle: hsl(173 76% 15%); --active-border: hsl(173 76% 21%); --active-text: hsl(173 70% 52%);
  --warning: hsl(22 90% 56%); --warning-foreground: hsl(22 100% 12%); --warning-subtle: hsl(22 100% 19%); --warning-border: hsl(22 100% 27%); --warning-text: hsl(22 90% 56%);
  --pending: hsl(40 100% 68%); --pending-foreground: hsl(40 80% 14%); --pending-subtle: hsl(40 85% 24%); --pending-border: hsl(40 90% 36%); --pending-text: hsl(40 100% 68%);
  --info: hsl(221 90% 62%); --info-foreground: hsl(221 100% 13%); --info-subtle: hsl(221 100% 20%); --info-border: hsl(221 100% 29%); --info-text: hsl(221 90% 62%);
  --destructive: hsl(353 63% 60%); --destructive-foreground: hsl(353 66% 13%); --destructive-subtle: hsl(353 66% 21%); --destructive-border: hsl(353 66% 31%); --destructive-text: hsl(353 63% 60%);
  --highlight: hsl(249 80% 68%); --highlight-foreground: hsl(249 70% 17%); --highlight-subtle: hsl(249 75% 28%); --highlight-border: hsl(249 80% 40%); --highlight-text: hsl(249 80% 68%);
  --shadow-sm: 0 1px 2px 0 hsl(0 0% 0% / 0.20);
  --shadow-md: 0 2px 8px 0 hsl(0 0% 0% / 0.30), 0 1px 2px 0 hsl(0 0% 0% / 0.20);
  --shadow-lg: 0 4px 16px 0 hsl(0 0% 0% / 0.40), 0 2px 4px 0 hsl(0 0% 0% / 0.20);
  --chart-1: hsl(221 83% 65%); --chart-2: hsl(142 71% 55%); --chart-3: hsl(35 95% 65%); --chart-4: hsl(353 75% 65%);
  --chart-5: hsl(280 65% 70%); --chart-6: hsl(173 70% 55%); --chart-7: hsl(15 90% 65%); --chart-8: hsl(200 80% 62%);
  --neutral-btn: hsl(0 0% 100%); --neutral-btn-foreground: hsl(0 0% 0%);
}

`

// Theme classes — ALL brand tokens only in theme class, nothing in :root
brands.forEach(({ theme, tokens }, i) => {
  css += `/* ${i+3}. THEME — ${theme.toUpperCase()} */\n.theme-${theme} {\n${themeVars(tokens)}${tableTokens}\n}\n\n${darkBlock(`.theme-${theme}`, tokens)}\n`
})

// Club website
css += `.theme-club-website {
  --radius: 0.625rem; --height-sm: 2.25rem; --height-md: 2.75rem; --height-lg: 3.25rem; --height-xl: 4rem;
  --padding-sm: 0 1rem; --padding-md: 0 1.25rem; --padding-lg: 0 1.75rem; --padding-xl: 0 2.25rem;
}\n\n`

// @theme inline
css += `@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive-subtle: var(--destructive-subtle);
  --color-destructive-border: var(--destructive-border);
  --color-destructive-text: var(--destructive-text);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-link: var(--link);
  --color-link-hover: var(--link-hover);
  --color-link-visited: var(--link-visited);
  --color-focus-ring: var(--focus-ring);
  --color-disabled-bg: var(--disabled-bg);
  --color-disabled-text: var(--disabled-text);
  --color-disabled-border: var(--disabled-border);
  --color-placeholder: var(--placeholder);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-success-subtle: var(--success-subtle);
  --color-success-border: var(--success-border);
  --color-success-text: var(--success-text);
  --color-active: var(--active);
  --color-active-foreground: var(--active-foreground);
  --color-active-subtle: var(--active-subtle);
  --color-active-border: var(--active-border);
  --color-active-text: var(--active-text);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-warning-subtle: var(--warning-subtle);
  --color-warning-border: var(--warning-border);
  --color-warning-text: var(--warning-text);
  --color-pending: var(--pending);
  --color-pending-foreground: var(--pending-foreground);
  --color-pending-subtle: var(--pending-subtle);
  --color-pending-border: var(--pending-border);
  --color-pending-text: var(--pending-text);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-info-subtle: var(--info-subtle);
  --color-info-border: var(--info-border);
  --color-info-text: var(--info-text);
  --color-highlight: var(--highlight);
  --color-highlight-foreground: var(--highlight-foreground);
  --color-highlight-subtle: var(--highlight-subtle);
  --color-highlight-border: var(--highlight-border);
  --color-highlight-text: var(--highlight-text);
  --color-neutral-btn: var(--neutral-btn);
  --color-neutral-btn-foreground: var(--neutral-btn-foreground);
  --color-table-row-bg: var(--table-row-bg);
  --color-table-row-selected: var(--table-row-selected);
  --color-table-row-selected-border: var(--table-row-selected-border);
  --color-table-header-bg: var(--table-header-bg);
  --color-table-header-hover: var(--table-header-hover);
  --color-table-header-sticky-bg: var(--table-header-sticky-bg);
  --color-table-header-resize: var(--table-header-resize);
  --color-table-row-hover: var(--table-row-hover);
  --color-table-row-expanded-bg: var(--table-row-expanded-bg);
  --color-table-bulk-bar-bg: var(--table-bulk-bar-bg);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-accent-500: var(--accent-btn);
  --color-accent-400: var(--accent-btn);
  --color-accent-900: var(--accent-btn-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-chart-6: var(--chart-6);
  --color-chart-7: var(--chart-7);
  --color-chart-8: var(--chart-8);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 2);
  --font-sans: var(--font-body);
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);
}

.rdp-today button {
  background-color: var(--info-subtle) !important;
  color: var(--info-text) !important;
  border-radius: var(--radius-sm);
}

@layer utilities {
  .text-3xs { font-size: 0.625rem; line-height: 1rem; }
  .text-2xs { font-size: 0.6875rem; line-height: 1rem; }
  .icon-2xs { width: var(--icon-2xs); height: var(--icon-2xs); }
  .icon-xs  { width: var(--icon-xs);  height: var(--icon-xs);  }
  .icon-sm  { width: var(--icon-sm);  height: var(--icon-sm);  }
  .icon-md  { width: var(--icon-md);  height: var(--icon-md);  }
  .icon-lg  { width: var(--icon-lg);  height: var(--icon-lg);  }
  .icon-xl  { width: var(--icon-xl);  height: var(--icon-xl);  }
  .icon-2xl { width: var(--icon-2xl); height: var(--icon-2xl); }
  .avatar-2xs { width: var(--avatar-2xs); height: var(--avatar-2xs); }
  .avatar-xs  { width: var(--avatar-xs);  height: var(--avatar-xs);  }
  .avatar-sm  { width: var(--avatar-sm);  height: var(--avatar-sm);  }
  .avatar-md  { width: var(--avatar-md);  height: var(--avatar-md);  }
  .avatar-lg  { width: var(--avatar-lg);  height: var(--avatar-lg);  }
  .avatar-xl  { width: var(--avatar-xl);  height: var(--avatar-xl);  }
  .avatar-2xl { width: var(--avatar-2xl); height: var(--avatar-2xl); }
  .avatar-3xl { width: var(--avatar-3xl); height: var(--avatar-3xl); }
  .shadow-cs-sm { box-shadow: var(--shadow-sm); }
  .shadow-cs-md { box-shadow: var(--shadow-md); }
  .shadow-cs-lg { box-shadow: var(--shadow-lg); }
  .transition-fast { transition: all var(--transition-fast); }
  .transition-base { transition: all var(--transition-base); }
  .transition-slow { transition: all var(--transition-slow); }
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
  a { color: var(--link); transition: color var(--transition-fast); }
  a:hover { color: var(--link-hover); }
  a:visited { color: var(--link-visited); }
  [data-slot] a, [data-slot] a:hover, [data-slot] a:visited { color: inherit; }
  ::placeholder { color: var(--placeholder); opacity: 1; }
  :focus-visible { outline: var(--focus-ring-width) solid var(--focus-ring); outline-offset: var(--focus-ring-offset); }
  .text-3xs { font-weight: 700; }
  [data-radix-popper-content-wrapper] { z-index: var(--z-dropdown) !important; }
}

@layer components {
  h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.25; }
}
`

fs.writeFileSync('./src/app/globals.css', css)
console.log('✅ globals.css generated')
console.log('   Themes: ' + brands.map(b => `theme-${b.theme}`).join(', '))

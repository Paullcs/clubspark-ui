# Clubspark UI — Token System

## Source of truth

```
tokens/
  base.json              ← base tokens (status colours, shadows, spacing etc) — never change per brand
  brands/
    clubspark.json       ← Clubspark brand scales + admin/public theme values
    ecb.json             ← (future) ECB brand
    usta.json            ← (future) USTA brand
```

## Generated output

```
src/app/globals.css      ← GENERATED — never edit manually
```

## Workflow

**Edit tokens:**
1. Open `tokens/base.json` or `tokens/brands/[brand].json`
2. Make your changes
3. Run `npm run tokens`
4. `globals.css` is regenerated automatically

**Add a new brand:**
1. Create `tokens/brands/[brand].json`
2. Add primary, accent, neutral colour scales
3. Add `admin` and `public` semantic token groups
4. Run `npm run tokens`

## Adding a new brand — minimal example

```json
{
  "$description": "ECB brand tokens",

  "primary-500": { "$value": "hsl(14 90% 52%)", "$type": "color" },
  "primary-50":  { "$value": "hsl(14 60% 97%)", "$type": "color" },
  ... (full scale)

  "font-body":    { "$value": "'Inter', system-ui, sans-serif", "$type": "fontFamily" },
  "font-heading": { "$value": "'Cal Sans', system-ui, sans-serif", "$type": "fontFamily" },

  "admin": {
    "primary":            { "$value": "{primary-500}", "$type": "color" },
    "primary-foreground": { "$value": "{primary-50}",  "$type": "color" },
    "radius":             { "$value": "0.375rem",       "$type": "dimension" }
    ... (other semantic tokens)
  },

  "public": {
    "radius": { "$value": "0.75rem", "$type": "dimension" }
    ... (scale overrides only)
  }
}
```

## Token types

| Type | Used for |
|------|----------|
| `color` | All colour values |
| `fontFamily` | Font stack strings |
| `fontWeight` | Numeric weight values |
| `dimension` | px, rem, em values |
| `shadow` | Box shadow values |
| `duration` | Transition times |
| `number` | Z-index, unitless values |

## CSS class system

Themes are applied as a class on `<html>`:

```html
<html class="theme-clubspark-admin">      <!-- light -->
<html class="theme-clubspark-admin dark"> <!-- dark -->
<html class="theme-ecb-admin">            <!-- ECB light -->
```

The `ThemeProvider` component handles this automatically.

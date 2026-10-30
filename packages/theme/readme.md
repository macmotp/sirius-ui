# @sirius-ui/theme

Shared CSS tokens with independent accent, neutral background, and appearance choices. Teal and mist are the defaults. The package does not add a reset, load fonts, or style native elements automatically.

## Setup

Build the theme package first (`npm run build` from the repository root). With Tailwind CSS 4, import these files in the application's CSS entry processed by the Tailwind Vite plugin:

```css
@import 'tailwindcss';
@import '@sirius-ui/theme/tailwind.css';
```

The first import includes Tailwind Preflight. For an application without a reset, use:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@sirius-ui/theme/tailwind.css';
```

Without Tailwind, import `@sirius-ui/theme` and use the `--sirius-` CSS variables directly.

## Default font

`--sirius-font-sans` starts with `InterVariable`, followed by system fallbacks. The theme defines the font stack; applications load the font. The playground uses the official hosted stylesheet:

```html
<link rel="preconnect" href="https://rsms.me/" />
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

Applications can instead self-host InterVariable and declare their own `@font-face`. If the font cannot load, the system fallback remains usable. The monospace stack is unchanged.

## Accent, background, and appearance

Select one accent palette and one neutral background palette independently:

| Setting | Choices | Default |
| --- | --- | --- |
| Accent | teal, emerald, cyan, indigo, pink, orange | teal |
| Background | mist, slate, stone | mist |
| Appearance | light, dark | light |

```html
<html data-sirius-color="teal" data-sirius-background="mist" data-theme="light">
```

```js
document.documentElement.dataset.siriusColor = 'indigo'
document.documentElement.dataset.siriusBackground = 'slate'
document.documentElement.dataset.theme = 'dark' // or 'light'
```

When attributes are absent, the defaults apply. The accent supplies the primary colors and focus indicator. The background palette supplies dark page backgrounds, neutral surfaces, text, and borders. Light page and navigation backgrounds are white for all selections. Success, warning, and danger palettes stay fixed for every selection.

Applications own preference persistence and system preference detection. The playground remembers all three choices and offers a System appearance option. To initialize appearance from the system before first paint:

```js
document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'
```

The tokens set `color-scheme` so native controls follow appearance. Semantic colors also support nested regions with an explicit `data-theme`. When selecting accent or background palettes on a subtree, set `data-theme` there too so semantic aliases resolve in that scope. Optional Tailwind `dark:` variants follow the document's appearance; use semantic tokens for nested regions.

## Color roles

| Role | Palette | Fill in both modes |
| --- | --- | --- |
| Primary | Selected accent | Shade 400 |
| Success | Fixed green | green-400 |
| Warning | Fixed yellow | yellow-400 |
| Danger | Fixed red | red-400 |
| Neutrals | Selected background | Varies by semantic role and appearance |

Every color role exposes the same token family. Replace `primary` below with `success`, `warning`, or `danger`:

| CSS token | Tailwind example | Purpose |
| --- | --- | --- |
| `--sirius-primary` | `bg-primary` | Shade 400 filled background |
| `--sirius-primary-hover` | `hover:bg-primary-hover` | Shade 300 hover background |
| `--sirius-primary-active` | `active:bg-primary-active` | Shade 200 pressed background |
| `--sirius-on-primary` | `text-on-primary` | Dark foreground on filled backgrounds |
| `--sirius-primary-soft` | `bg-primary-soft` | Shade 50 in light mode, shade 950 in dark mode |
| `--sirius-primary-content` | `text-primary-content` | Readable foreground for soft backgrounds: shade 800 in light mode, shade 300 in dark mode |

Use `text-on-*` on filled backgrounds and `text-*-content` on soft backgrounds. The role fill is intentionally bright; it is not the foreground for an alert on a pale surface. These role foreground/background pairs are contrast-tested in both appearances. Solid buttons separately use the white `--sirius-on-solid` token (`text-on-solid`); white on shade-400 fills has insufficient normal-text contrast. See [the button guide](../vue/readme.md#accessibility-and-loading) for that limitation.

**Migration:** named themes and `data-sirius-theme` have been removed. Use `data-sirius-color` and `data-sirius-background` instead. Secondary and info tokens/utilities have been removed. For soft status backgrounds use `text-success-content`, `text-warning-content`, or `text-danger-content`, rather than the bright fill color as text. The `data-theme` appearance API is unchanged; old theme or brand preferences are not read.

## Surfaces and foundations

| Token suffix | Tailwind examples | Purpose |
| --- | --- | --- |
| `dialog`, `dialog-line` | `bg-dialog`, `border-dialog-line` | Dialog: white with neutral 200 border in light mode; neutral 950 with neutral 800 border in dark mode |
| `overlay` | `backdrop:bg-overlay` | Modal backdrop: selected neutral 500/75 in light mode, 700/75 in dark mode |
| `canvas` | `bg-canvas` | White in light mode; selected neutral 700 in dark mode |
| `skeleton` | `bg-skeleton` | Loading placeholders: neutral 200 in light mode, neutral 400/35 in dark mode |
| `surface`, `surface-muted`, `surface-hover` | `bg-surface`, `hover:bg-surface-hover` | Cards: selected neutral 200 at 10% in light mode, 600 at 80% in dark mode; additional muted/hover surfaces |
| `content`, `content-muted`, `content-subtle` | `text-content`, `text-content-muted` | Text hierarchy |
| `line`, `line-strong` | `border-line`, `ring-line`, `border-line-strong` | Decorative dividers and identifiable control outlines |
| `range-track` | `bg-range-track` | Remaining slider track: neutral 300 in light mode, neutral 600 in dark mode |
| `switch-track` | `bg-switch-track` | Off switch track: neutral 300 in light mode, neutral 600/80 in dark mode |
| `control`, `control-content` | `bg-control`, `text-control-content` | Input fill and foreground; white in light mode, neutral 600/80 with white text in dark mode |
| `control-line`, `control-placeholder`, `control-focus` | `ring-control-line`, `placeholder:text-control-placeholder`, `focus:ring-control-focus` | Input ring: neutral 300; placeholder: neutral 400; focus: accent 500 in light mode, 400 in dark mode |
| `control-valid`, `control-invalid` | `ring-control-valid`, `ring-control-invalid` | Fixed green-500 and red-500 validation rings in both appearances, including focus |
| `focus` | `outline-focus`, `ring-focus` | Keyboard focus color |
| `font-sans`, `font-mono` | `font-sans`, `font-mono` | InterVariable with system fallbacks; system monospace |
| `text-xs` through `text-2xl` | `text-sm`, `text-xl` | Type sizes |
| `spacing` | `p-4`, `gap-2` | Base spacing unit, 0.25rem |
| `shadow-sm`, `shadow-md`, `shadow-lg` | `shadow-sm` | Elevation |

Cards use `bg-surface ring-1 ring-inset ring-line`. The surface token is translucent and should normally sit over `bg-canvas`. This matches `bg-slate-200/10 dark:bg-slate-600/80 ring-1 ring-inset ring-slate-400/15` when slate is selected; mist and stone follow the same shade and opacity rules. `line` uses neutral 400 at 15% in both appearances. Navigation uses `bg-canvas` so it matches the page. The theme defines tokens and utilities without styling native elements automatically.

Use `line-strong` for controls that need a border. Inputs instead use `border-0 bg-control text-control-content shadow-xs ring-1 ring-inset ring-control-line placeholder:text-control-placeholder focus:ring-1 focus:ring-inset focus:ring-control-focus focus:outline-none`. The medium input uses `rounded-control py-1.5`; the control rounding token defaults to full. These tokens are shared without automatically styling inputs or selects. `shadow-xs` maps to the runtime `--sirius-shadow-xs` token. `--sirius-leading` is available as a plain CSS token; Tailwind retains its standard line-height utilities.

## Radius defaults

| CSS token | Tailwind utility | Value / use |
| --- | --- | --- |
| `--sirius-radius` | `rounded` | Default: aliases 2xl |
| `--sirius-radius-sm` | `rounded-sm` | 0.25rem |
| `--sirius-radius-md` | `rounded-md` | 0.5rem |
| `--sirius-radius-lg` | `rounded-lg` | 0.75rem |
| `--sirius-radius-xl` | `rounded-xl` | 1rem |
| `--sirius-radius-2xl` | `rounded-2xl` | 1.5rem, general default |
| `--sirius-radius-4xl` | `rounded-4xl`, corner variants | 2rem, selected bento card corners |
| `--sirius-radius-full` | `rounded-full` | 9999px, pill rounding |
| `--sirius-radius-control` | `rounded-control` | Aliases full; buttons, inputs, and selects |

Components and applications opt into these defaults with the semantic utilities. The theme does not automatically round every native element. `rounded-control` lets applications override the control shape independently of other full-radius elements.

```html
<section class="rounded bg-surface ring-1 ring-inset ring-line p-6 text-content">
  <label for="name" class="text-sm">Name</label>
  <input id="name" class="rounded-control border-0 bg-control px-4 py-1.5 text-control-content shadow-xs ring-1 ring-inset ring-control-line placeholder:text-control-placeholder focus:ring-control-focus focus:outline-none" />
  <button class="rounded-control bg-primary px-4 py-2 text-on-primary hover:bg-primary-hover active:bg-primary-active">
    Continue
  </button>
  <p class="rounded bg-warning-soft p-4 text-warning-content">Check your details.</p>
</section>
```

These native elements demonstrate tokens; shared Vue components are implemented separately.

## Application overrides

Defaults live in the low-specificity `theme` layer. Import the package first, then override variables in application CSS. For example:

```css
:root {
  --sirius-radius: var(--sirius-radius-2xl);
  --sirius-radius-control: var(--sirius-radius-full);
  --sirius-font-sans: 'My App Font', system-ui, sans-serif;
}
```

The selected accent's raw palette uses `--sirius-brand-50` through `--sirius-brand-950`; the background palette uses `--sirius-neutral-*`. Fixed status palettes use `--sirius-success-*`, `--sirius-warning-*`, and `--sirius-danger-*`. All palettes contain the eleven Tailwind shades. Components consume semantic roles rather than hard-coded palette shades.

Override semantic foreground/background pairs together when customizing colors, and check contrast in both appearances. Keep reusable palette definitions in the theme package and application-only overrides in the consuming app. Secondary, info, and named theme presets are not part of the public API.

# @sirius-ui/theme

Shared CSS tokens with teal and mist defaults. The package does not add a reset, load fonts, or style native elements. Applications choose where to apply the tokens.

## With Tailwind CSS 4

Build the theme package first (`npm run build` from the repository root). In an application's main CSS file, processed by the Tailwind Vite plugin:

```css
@import 'tailwindcss';
@import '@sirius-ui/theme/tailwind.css';
```

The first import includes Tailwind's own Preflight reset. If the application does not want a reset, use these imports instead:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@sirius-ui/theme/tailwind.css';
```

Use semantic utilities so the same markup works in both modes:

```html
<main class="bg-canvas font-sans text-content">
  <section class="rounded-lg border border-line bg-surface p-6 shadow-sm">
    <p class="text-sm text-content-muted">Your workspace</p>
    <button class="rounded-md bg-primary px-4 py-2 text-on-primary hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
      Continue
    </button>
  </section>
</main>
```

This is a token usage example; component behavior and accessibility will be implemented in `@sirius-ui/vue`.

## Without Tailwind

Import `@sirius-ui/theme` in the application's CSS or JavaScript entry and use the CSS custom properties directly:

```css
@import '@sirius-ui/theme';

.panel {
  background: var(--sirius-surface);
  color: var(--sirius-content);
  padding: calc(var(--sirius-spacing) * 6);
  border: 1px solid var(--sirius-line);
  border-radius: var(--sirius-radius-lg);
  font-family: var(--sirius-font-sans);
  line-height: var(--sirius-leading);
}
```

## Appearance

Light is the default. Set the document attribute to select a mode:

```js
document.documentElement.dataset.theme = 'dark' // or 'light'
```

Applications own preference persistence and system preference detection. To initialize from the system preference, set the attribute before first paint:

```js
document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'
```

The tokens set `color-scheme` so browser controls follow the selected mode. Semantic colors also support nested regions with `data-theme="light"` or `data-theme="dark"`. Optional Tailwind `dark:` variants follow the document's `data-theme` attribute; use semantic colors for nested regions.

## Token API

CSS tokens use the `--sirius-` prefix. Tailwind mappings use `@theme inline`, so utilities resolve the active runtime values.

| CSS token suffix | Tailwind examples | Purpose |
| --- | --- | --- |
| `canvas` | `bg-canvas` | Page background |
| `surface`, `surface-muted`, `surface-hover` | `bg-surface`, `hover:bg-surface-hover` | Panels and neutral interactive backgrounds |
| `content`, `content-muted`, `content-subtle` | `text-content`, `text-content-muted` | Text hierarchy |
| `line`, `line-strong` | `border-line`, `border-line-strong` | Dividers and control outlines |
| `primary`, `primary-hover`, `primary-active`, `on-primary` | `bg-primary`, `text-on-primary` | Brand action and its foreground |
| `primary-soft`, `primary-content` | `bg-primary-soft`, `text-primary-content` | Subtle brand surfaces and their text |
| `focus` | `outline-focus`, `ring-focus` | Keyboard focus color |
| `success`, `warning`, `danger`, `info` | `text-danger` | Status text and icons |
| `success-soft`, `warning-soft`, `danger-soft`, `info-soft` | `bg-danger-soft` | Corresponding status backgrounds |
| `font-sans`, `font-mono` | `font-sans`, `font-mono` | System font stacks |
| `text-xs` through `text-2xl` | `text-sm`, `text-xl` | Type sizes |
| `spacing` | `p-4`, `gap-2` | Base spacing unit, 0.25rem |
| `radius-sm` through `radius-xl` | `rounded-md` | Corner radii |
| `shadow-sm`, `shadow-md`, `shadow-lg` | `shadow-sm` | Elevation |

`line` is a subtle decorative divider; use `line-strong` where an outline is necessary to identify a control. Status colors are intended as text on their corresponding soft backgrounds, rather than filled button colors. `leading` is available as a plain CSS token; Tailwind retains its standard line-height utilities.

## Application overrides

Override tokens after importing the theme. Unlayered application CSS takes precedence over the theme layer.

Override the brand palette once at the document root to update both appearances. The semantic colors use shades 50, 100, 200, 300, 700, 800, 900, and 950; override all eleven shades to keep the palette complete:

```css
/* Example: an indigo brand for another application. */
:root {
  --sirius-brand-50: #eef2ff;
  --sirius-brand-100: #e0e7ff;
  --sirius-brand-200: #c7d2fe;
  --sirius-brand-300: #a5b4fc;
  --sirius-brand-400: #818cf8;
  --sirius-brand-500: #6366f1;
  --sirius-brand-600: #4f46e5;
  --sirius-brand-700: #4338ca;
  --sirius-brand-800: #3730a3;
  --sirius-brand-900: #312e81;
  --sirius-brand-950: #1e1b4b;
  --sirius-radius-md: 0.375rem;
}
```

For finer control, override a semantic token per mode:

```css
:root[data-theme='light'] {
  --sirius-primary: #4338ca;
  --sirius-primary-hover: #3730a3;
  --sirius-primary-active: #312e81;
  --sirius-on-primary: #fff;
}

:root[data-theme='dark'] {
  --sirius-primary: #a5b4fc;
  --sirius-primary-hover: #c7d2fe;
  --sirius-primary-active: #e0e7ff;
  --sirius-on-primary: #1e1b4b;
}
```

Keep foreground/background pairs together when customizing colors, and verify contrast for the resulting application. For a scoped palette override, place `data-theme="light"` or `data-theme="dark"` on the same element so semantic aliases are resolved within that scope.

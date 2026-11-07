# SDonutChart API

Use SDonutChart for **parts of one whole**: sales share by channel, order-status mix, traffic sources or budget allocation. Use a bar chart when precise comparisons between similar values matter more than composition. Supply a few nonnegative categories; keep sorting/aggregation, currency units, fetching and controls in the app. This private workspace package is not published to npm yet.

## Imports and example

```ts
// Application entry, once:
import '@sirius-ui/charts/style.css'
```

```vue
<script setup lang="ts">
import { SDonutChart } from '@sirius-ui/charts'
import type { SDonutChartItem, SDonutChartProps } from '@sirius-ui/charts'

const channels: readonly SDonutChartItem[] = [
  { id: 'online', label: 'Online', value: 3120, color: 'var(--sirius-primary-content)' },
  { id: 'store', label: 'In store', value: 2260, color: 'var(--store-color)' },
  { id: 'partners', label: 'Partners', value: 840, color: 'var(--partners-color)' },
]
const currency = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 })
</script>

<template>
  <SDonutChart class="channel-share" title="Sales share by channel" :data="channels" value-label="Sales" total-label="Total sales" :value-formatter="value => currency.format(value)" :inner-radius="0.65" />
</template>

<style scoped>
.channel-share {
  --store-color: light-dark(#4338ca, #a5b4fc);
  --partners-color: light-dark(#c2410c, #fdba74);
}
</style>
```

The Sirius theme supplies inherited color-scheme and default semantic tokens. App-owned palette variables should contrast in both appearances. No Tailwind requirement, chart engine, icon dependency or API client is introduced. Vue stays external. Exported API: `SDonutChart`, `SDonutChartProps`, `SDonutChartItem`.

## Every component parameter

Use camelCase in TypeScript and kebab-case in Vue templates. Only title is required; data must contain at least one finite positive value to show a donut. Props are readonly and input records are never mutated.

| Prop | Type | Default | Behavior |
| --- | --- | --- | --- |
| `title` | `string` | Required | Accessible figure/SVG name; surrounding visible heading belongs to the app |
| `data` | `readonly SDonutChartItem[]` | `[]` | Slice records in authoritative clockwise order, beginning at 12 o'clock |
| `description` | `string` | `undefined` | Optional visible context associated with the SVG |
| `height` | `number` | `280` | Plot height in pixels, clamped to 180–600; nonfinite input uses 280; excludes legend/description/table |
| `innerRadius` | `number` | `0.65` | Hole radius / outer radius, clamped to 0.35–0.85; nonfinite input uses 0.65; larger means thinner ring |
| `showTotal` | `boolean` | `true` | Show the fixed center total and totalLabel; table total remains available when false |
| `totalLabel` | `string` | `'Total'` | Center subtitle and table total-row heading |
| `valueLabel` | `string` | `'Value'` | Tooltip value label and table amount-column heading |
| `percentageLabel` | `string` | `'Share'` | Table percentage-column heading |
| `valueFormatter` | `(value: number) => string` | Intl number, maximum 2 fraction digits | Finite valid raw values in tooltip/table, and total unless totalFormatter is supplied |
| `totalFormatter` | `(value: number) => string` | valueFormatter, otherwise default number formatter | Center/table total text only; use a concise representation when needed to fit the hole |
| `percentageFormatter` | `(fraction: number) => string` | Intl percent, maximum 1 fraction digit | Shares in tooltip/live status/table; receives a fraction 0–1, **not** 0–100 |
| `loading` | `boolean` | `false` | Busy status replaces all graphics/data; wins over error |
| `error` | `string` | `undefined` | Nonempty message replaces graphics/data with an alert; empty string means no error |
| `loadingText` | `string` | `'Loading chart…'` | Localizable loading fallback |
| `emptyText` | `string` | `'No data to display.'` | Localizable empty fallback, including all-zero/all-invalid amounts |
| `dataTableLabel` | `string` | `'View data'` | Native details disclosure label |
| `categoryLabel` | `string` | `'Category'` | Table slice-name column heading |
| `instructions` | `string` | See below | Localizable keyboard help associated with the focusable plot |

Default instructions: `Use arrow keys to explore slices. Home and End jump to the first and last slice.`

Default formatters use the environment's locale; supply deterministic functions for locale-consistent SSR. Monetary units/conversion remain app-owned. The component never passes missing, negative or nonfinite values to valueFormatter/totalFormatter. Percentage callbacks receive finite shares. Labels and formatter output are escaped text, not HTML.

### Every slice field

| SDonutChartItem field | Type | Requirement / default | Behavior |
| --- | --- | --- | --- |
| `id` | `string` | Required | Stable unique identifier within this donut |
| `label` | `string` | Required | Legend, tooltip, live status and table name; need not be a numeric/date category |
| `value` | `number` or `null` | Required | Nonnegative finite amount; zero is valid but has no wedge; null, negatives and nonfinite values are missing |
| `color` | `string` | Optional; themed by position | Valid CSS color, including var(--your-color); applied consistently to slice and legend/tooltip keys |

Omitted colors cycle primary-content / content-muted / content and repeat after three records. Applications should provide explicit contrasting colors for more categories. Input order is preserved; categories are never sorted, grouped, merged or hidden as “Other.” The donut has one dataset/ring, not multiple concentric series. No slice click events, drill-down, selection model, custom patterns or pie-chart mode are provided.

### Slots, events and native attributes

| Slot | Slot parameters | Default |
| --- | --- | --- |
| `#loading` | None | loadingText in a busy status |
| `#error` | None | error in an alert; may contain an app-owned retry action |
| `#empty` | None | emptyText in a status |

State order: loading, error, empty, chart. No stale chart/table remains exposed while loading, errored or empty. Custom slots inherit state wrapper semantics. There are no emitted component events, v-models or exposed methods. Native attributes/class/style/DOM listeners fall through to the figure. Prefer title/description for naming rather than replacing ARIA associations. Font loading and resets are app-owned.

## Values, totals and geometry

- Shares use only strictly positive finite amounts. Missing/negative/nonfinite records do not contribute; they stay in the legend/table with em-dash amount/share if another positive slice exists. They are never converted to absolute values. Zero records stay in the legend/table as 0 and 0%, without a fabricated minimum wedge.
- All-zero, empty or all-invalid data uses the empty state. There is no empty-state ring implying a proportion.
- A single positive record draws a full ring and 100%. Every ring segment uses closed outer/inner arcs; a 100% slice does not disappear because its start/end coordinates coincide.
- Values normalize before summation, keeping proportions/geometry finite at extreme inputs. If the raw total exceeds Number.MAX_VALUE, the center/table total shows an em dash and totalFormatter is not called; valid slice values/shares remain available. Tiny ratios below floating-point precision may have no visible wedge and 0% while retaining their original amount in the table. Shares are independently formatted, so rounded percentages need not sum to exactly 100%.
- Width follows ResizeObserver, with window-resize fallback and 640 units before measurement/SSR. The ring fits the smaller of plot width/height with padding; the hole ratio scales with it. The measured width has the same 160-unit floor as the other charts. Center text is clipped with an ellipsis when long, while its title and table retain the full formatted total.
- A small gap separates slices without changing their reported amounts/shares; tiny wedges have proportionally smaller gaps and single-slice rings have no seam. Borders follow only the inner and outer curves, leaving radial edges between slices unbordered. Hover/focus draws those curves last in the inspected slice’s fill color. Inspection shows the tooltip without changing the center total or legend. There is no layout animation, 3D, exploding slices, separate radius per item or external chart dependency.

## Accessibility and inspection

The figure/SVG have unique generated names. One keyboard stop explores drawable slices: Right/Down move forward, Left/Up backward, Home/End reach boundaries, Escape dismisses. Zero/missing slices are skipped during inspection but retained in the table when a chart exists. Focus inspects the first slice; blur clears inspection. Data reference changes reset it. Pointer/touch hit testing follows the ring and ignores the hole/background; leaving the plot/tooltip viewport clears pointer inspection unless keyboard focus remains.

The shared floating tooltip shows a category, formatted raw amount and share, with a matching color key. It stays outside layout flow, flips/clamps within the viewport, updates on resize/scroll, supports long content and stays open while hovered. Escape dismisses it. Its visual content is aria-hidden because a visually hidden polite atomic status announces the same values. The center total is also visual only; the accessible data table includes its labelled total row.

View data is a native keyboard-accessible disclosure containing a captioned table with row/column headings, raw formatted amounts, shares and the total. It complements the colored legend and SVG; color alone is not the accessible data representation. Localize category labels and visible/announced strings in the app.

## Examples and validation

DemoDonutCharts on the dashboard Charts page shows a sales-channel mix with per-slice color and ring-thickness controls, plus an order-status mix with single-slice, all-zero, loading and error responses. The core Vue primitives and shared dashboard shell do not depend on charts. See [the charts guide](readme.md) for other simple chart types.

Run `npm run check` at repository root. Tests cover unique SVG/table naming, escaped labels, complete rings, totals/percentages, missing/zero/negative/extreme values, keyboard/pointer hit testing, states, colors, radius changes and resize cleanup. Renderer checks do not replace browser visual verification.

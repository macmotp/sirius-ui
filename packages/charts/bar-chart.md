# SBarChart API

Optional SVG bar chart from `@sirius-ui/charts`. Use it to compare categories (sales by product/category, requests by endpoint, counts by status), or compare multiple series within each category. Vertical bars suit short category names; horizontal bars leave more room for longer names. The app owns sorting, units, category/series order, fetching and controls. This package is private workspace scaffolding, not yet published to npm.

## Imports and examples

```ts
import '@sirius-ui/charts/style.css' // once in the application entry
import { SBarChart } from '@sirius-ui/charts'
import type { SBarChartPoint, SBarChartSeries, SBarChartProps } from '@sirius-ui/charts'
```

Single series:

```vue
<script setup lang="ts">
import { SBarChart } from '@sirius-ui/charts'
import type { SBarChartPoint } from '@sirius-ui/charts'

const data: readonly SBarChartPoint[] = [
  { label: 'Food & drink', value: 840 },
  { label: 'Apparel', value: 620 },
  { label: 'Home & living', value: null },
]
</script>

<template>
  <SBarChart title="Sales by category" series-label="Sales" :data="data" />
</template>
```

Grouped series and application colors:

```vue
<script setup lang="ts">
import { SBarChart } from '@sirius-ui/charts'
import type { SBarChartSeries } from '@sirius-ui/charts'

const series: readonly SBarChartSeries[] = [
  { id: 'online', label: 'Online', color: 'var(--sirius-primary-content)', data: [
    { label: 'Food & drink', value: 840 }, { label: 'Apparel', value: 620 },
  ] },
  { id: 'store', label: 'In store', color: 'var(--store-color)', data: [
    { label: 'Food & drink', value: 620 }, { label: 'Apparel', value: 740 },
  ] },
]
const currency = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 })
</script>

<template>
  <SBarChart class="category-sales" title="Sales by category and channel" orientation="horizontal" :series="series" :value-formatter="value => currency.format(value)" :height="320" />
</template>

<style scoped>
.category-sales {
  --store-color: light-dark(#4338ca, #a5b4fc);
}
</style>
```

## Every component parameter

Use camelCase in TypeScript and kebab-case in Vue templates. Only title is required; supply data or series for a nonempty chart. Props are readonly. SBarChartPoint is structurally identical to SLineChartPoint; applications can reuse records across chart types.

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | Required | Figure/SVG accessible name; add your own visible card heading |
| `data` | `readonly SBarChartPoint[]` | `[]` | Ordered single series; ignored when series is supplied |
| `series` | `readonly SBarChartSeries[]` | `undefined` | Full grouped-series input; replaces data/seriesLabel; explicit [] produces an empty state |
| `orientation` | `'vertical'` or `'horizontal'` | `'vertical'` | Category-axis direction; horizontal charts use Up/Down inspection |
| `description` | `string` | `undefined` | Optional visible context associated with the SVG |
| `seriesLabel` | `string` | `'Value'` | Single-series legend and table value heading |
| `height` | `number` | `280` | Plot viewport height in pixels, clamped to 180–600; nonfinite values use 280; does not include legend/description/table |
| `valueFormatter` | `(value: number) => string` | Intl number, maximum 2 fraction digits | Full tooltip/table text for finite raw values; missing values always display an em dash |
| `axisFormatter` | `(value: number) => string` | Intl compact number, maximum 1 fraction digit | Numeric-axis tick labels; Y for vertical, X for horizontal |
| `loading` | `boolean` | `false` | Busy status replaces SVG/table; wins over error |
| `error` | `string` | `undefined` | Nonempty message replaces SVG/table with an alert; empty string is not an error |
| `loadingText` | `string` | `'Loading chart…'` | Localizable loading fallback |
| `emptyText` | `string` | `'No data to display.'` | Localizable empty fallback |
| `dataTableLabel` | `string` | `'View data'` | Native details disclosure label |
| `categoryLabel` | `string` | `'Category'` | Table row-category heading |
| `instructions` | `string` | Orientation-specific help | Localizable keyboard help associated with the plot |

Default instructions are `Use Left and Right arrow keys to explore values. Home and End jump to the first and last category.` for vertical charts; horizontal charts replace `Left and Right` with `Up and Down`. Numeric formatters use the environment's locale; provide deterministic formatters for locale-consistent SSR. The app owns currency units and conversions.

### Every data field

| SBarChartPoint field | Type | Requirement | Meaning |
| --- | --- | --- | --- |
| `label` | `string` | Required | Category name; exact join key for grouped series |
| `value` | `number` or `null` | Required | Finite number, including zero/negative; null is missing; nonfinite runtime numbers are also missing |

| SBarChartSeries field | Type | Requirement / default | Meaning |
| --- | --- | --- | --- |
| `id` | `string` | Required | Unique stable series identifier |
| `label` | `string` | Required | Legend, inspection and table column heading |
| `data` | `readonly SBarChartPoint[]` | Required | Ordered records with unique category labels within the series |
| `color` | `string` | Optional; themed by position | Any valid CSS color, including var(--your-color); shared by bars, zero markers and legend |

Omitted colors cycle primary-content / content-muted / content, repeating after three series. Pass explicit contrasting colors for comparisons, especially more than three series. Use one series record when a single series needs a custom color. Verify custom palettes in light/dark appearance. Color selectors are demo/application UI, not part of this component. There is no per-bar color or series pattern parameter.

### Slots, events and attributes

| Slot | Slot parameters | Default |
| --- | --- | --- |
| `#loading` | None | loadingText in a status |
| `#error` | None | error in an alert; may contain an app-owned retry button |
| `#empty` | None | emptyText in a status |

State order: loading, error, empty, chart. No stale graphic/table remains exposed during loading or error. There are no emitted component events, v-models or exposed methods. Native attributes/class/style/DOM listeners fall through to the figure. Prefer the title/description contract for accessible names. Fonts and resets remain application-owned; the chart stylesheet has no Preflight.

## Comparison semantics and responsive layout

- Bars are grouped side by side in input series order, never stacked. All series share one numeric scale and zero baseline. Zero must remain included so lengths are meaningful; includeZero is deliberately absent from the bar API.
- First-series category order is authoritative. Categories appearing only in later series append in encounter order. Exact labels align series; category labels must be unique within a series (duplicate invalid input uses its last value). Sort and aggregate upstream.
- Missing/nonfinite values leave an empty slot, preserving series positions; zero draws a baseline marker and remains inspectable. Entirely missing series keep their legend/table column if another series has observations. An entirely missing dataset is empty.
- Negative bars extend below zero vertically or left of zero horizontally. Positive bars extend in the opposite direction. Single, flat, all-zero and extreme finite values receive a finite scale. Categories are equally spaced, not a continuous time scale.
- Every category and observation remains available. Vertical groups expand SVG width as needed and scroll inside the plot; horizontal groups expand SVG height and scroll inside the height-limited viewport. No label/record sampling occurs. Long labels may be truncated visually; SVG titles and the table retain complete text. Width uses ResizeObserver (window resize fallback), with 640 units before measurement/SSR. Very narrow horizontal plots use a 240-unit minimum and can also scroll horizontally.
- Rounded bar corners are fixed presentation; no smoothing, xLabels, stacking, zooming, animation, auto-sorting, hidden aggregation or backend fetching is provided. This is intended for small dashboard datasets.

## Accessibility and inspection

The figure/SVG have unique names. The plot is one keyboard stop with visible focus. Focus inspects the first category having any finite observation. Left/Right move through vertical categories; Up/Down move through horizontal categories. Home/End reach boundaries, Escape clears inspection, and unrelated keys retain browser behavior. Whole-category gaps are skipped; partial gaps appear as an em dash. Inspection scrolls the category into view, shows the full category and every series value in a floating tooltip, announces them in a visually hidden polite status, and highlights the group. Pointer/touch inspection follows the category axis and uses the same tooltip. The legend stays static and tooltip values never occupy layout space. Tooltip position flips/clamps within the visible plot and updates on scroll/resize; offscreen anchors hide it. Long labels/values wrap and many series can scroll within the panel. The visual panel is aria-hidden because the live status already announces its data. It stays open while hovered and Escape dismisses it. Leaving the plot/tooltip viewport clears it unless keyboard focus remains; blur clears it. Dataset/orientation changes reset inspection.

Grouping order, the full-value tooltip/status and captioned table complement the colored legend. The data disclosure is keyboard accessible, has column/row headings, and exposes every category/value. Do not treat the SVG as the sole accessible data representation. Loading/error/empty state messages and every visible series/category label should be localized by the application.

## Examples and validation

DemoBarCharts on the dashboard's Charts page shows vertical and horizontal grouped sales, a single/two/three-series selector and per-series colors. The primitive playground and shared dashboard shell do not gain a charts dependency. See [the package guide](readme.md) for package boundaries and SLineChart.

Run `npm run check` at repository root. Tests exercise named SVGs/tables, signed/zero/missing values, shared scales/colors, numeric extremes, orientation-specific keyboard/pointer inspection, state precedence, resize/scroll behavior and demo controls. Renderer checks do not replace browser visual verification.

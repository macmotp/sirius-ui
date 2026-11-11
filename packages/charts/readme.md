# @sirius-ui/charts

Release preparation targets `0.1.0-alpha.1`. After publication, install with `yarn add @sirius-ui/charts@alpha`. Vue components require Vue 3.5 or newer in the Vue 3 line.

For agents using an installed package, start at `node_modules/@sirius-ui/charts/dist/docs/readme.md`. It contains the component catalog, usage guides, and dashboard patterns for this version.

Optional, lightweight Vue charts for SiriusUI: line, bar and donut charts with SVG rendering and plain token-based CSS. These cover trends, category comparisons and part-to-whole composition. There is no chart engine, icon library, Tailwind requirement, API client or dependency on @sirius-ui/vue. Vue is external; @sirius-ui/theme supplies runtime tokens. This package is prepared for an initial alpha release.

- [SSparkline API](#ssparkline): a compact trend line for summary cards.
- [SLineChart API](#slinechart-contract): ordered trends, straight/rounded lines and per-series patterns.
- [SBarChart API](bar-chart.md): horizontal/vertical comparisons, single/grouped series, zero-based lengths and per-series colors.
- [SDonutChart API](donut-chart.md): part-to-whole slices, shares, center total and per-slice colors.

## Agent quick start

1. Import SLineChart from this package and import its compiled stylesheet once in the app entry.
2. Supply a meaningful title and an ordered array of `{ label, value }` records. Pass null for missing observations.
3. Supply valueFormatter/axisFormatter when units or locale matter. Keep axis labels short.
4. Let the application own fetching, dates, aggregation, loading/error state and period controls.
5. Compose inside SCard if needed. The chart has no built-in card or visible heading; its title names the figure and SVG accessibly.

```ts
// Application entry: compiled tokens and scoped chart styles, no Preflight.
import '@sirius-ui/charts/style.css'
```

```vue
<script setup lang="ts">
import { SLineChart } from '@sirius-ui/charts'
import type { SLineChartPoint } from '@sirius-ui/charts'

const sales: readonly SLineChartPoint[] = [
  { label: 'Mon', value: 420 },
  { label: 'Tue', value: 640 },
  { label: 'Wed', value: null },
  { label: 'Thu', value: 580 },
]
const currency = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat('en-SG', { notation: 'compact', maximumFractionDigits: 1 })
</script>

<template>
  <SLineChart
    title="Daily sales"
    description="Sales in SGD. Wednesday has no observation."
    series-label="Sales · SGD"
    :data="sales"
    :value-formatter="value => currency.format(value)"
    :axis-formatter="value => compact.format(value)"
  />
</template>
```

## SLineChart contract

All exports come from `@sirius-ui/charts`: `SLineChart`, `SLineChartProps`, `SLineChartPoint`, `SLineChartSeries`, and `SLineChartPattern`. The component requires `title` and either `data` or `series` for a nonempty chart. Neither array is mutated. In Vue templates use kebab-case (`x-labels`, `include-zero`, `value-formatter`); TypeScript uses the camelCase names below.

| Prop | Type | Default | Behavior |
| --- | --- | --- | --- |
| `title` | `string` | Required | Accessible figure/SVG name; not a second visible card heading |
| `data` | `readonly SLineChartPoint[]` | `[]` | Ordered single-series observations; ignored when `series` is supplied |
| `series` | `readonly SLineChartSeries[]` | `undefined` | Complete multi-series input, replacing `data` and `seriesLabel`; an explicit empty array produces an empty chart |
| `smooth` | `boolean` | `false` | Monotone cubic curves through observations, without overshoot or bridging gaps; applies to all series |
| `xLabels` | `'auto'` or `'all'` | `'auto'` | Auto samples labels to fit; all retains every category label and scrolls horizontally when needed |
| `description` | `string` | `undefined` | Optional visible context, also associated with the SVG |
| `seriesLabel` | `string` | `'Value'` | Single-series legend and table heading; multi-series labels belong to each series |
| `height` | `number` | `240` | SVG height in pixels, clamped to 180–600; nonfinite input uses 240; excludes legend, description and data disclosure |
| `includeZero` | `boolean` | `true` | Include zero in the shared Y domain; false fits data, with padding for flat values |
| `valueFormatter` | `(value: number) => string` | `Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })` | Full tooltip/table value text; receives raw finite values only; missing values remain an em dash |
| `axisFormatter` | `(value: number) => string` | `Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })` | Shared Y tick text; keep concise to fit the axis gutter |
| `loading` | `boolean` | `false` | Replaces graphics/table with busy state; wins over error |
| `error` | `string` | `undefined` | A nonempty message replaces graphics/table with an alert; empty string means no error |
| `loadingText` | `string` | `'Loading chart…'` | Localizable loading fallback |
| `emptyText` | `string` | `'No data to display.'` | Localizable empty fallback |
| `dataTableLabel` | `string` | `'View data'` | Native details disclosure label |
| `categoryLabel` | `string` | `'Period'` | Table category heading |
| `instructions` | `string` | See below | Localizable keyboard help associated with the focusable plot |

Default instructions: `Use Left and Right arrow keys to explore values. Home and End jump to the first and last value.`

### Data record parameters

| SLineChartPoint field | Type | Required | Behavior |
| --- | --- | --- | --- |
| `label` | `string` | Yes | Categorical X label and table row heading; exact label is the join key in multi-series charts |
| `value` | `number` or `null` | Yes | Finite numeric observation; null is missing, while 0 is real data; nonfinite runtime values also create gaps |

| SLineChartSeries field | Type | Required / default | Behavior |
| --- | --- | --- | --- |
| `id` | `string` | Required | Stable unique series identifier, independent of display label |
| `label` | `string` | Required | Legend, inspection and table column name |
| `data` | `readonly SLineChartPoint[]` | Required | Ordered observations; category labels must be unique within each series |
| `color` | `string` | Optional; themed by position | Valid CSS color, including `var(--your-color)`; applies to stroke, dots, inspected point and legend |
| `pattern` | `SLineChartPattern` | Optional; solid/dashed/dotted by position | `'solid'`, `'dashed'` or `'dotted'`; overrides only this series and matches its legend |

Omitted color cycles primary-content / content-muted / content. Omitted pattern cycles solid / dashed / dotted. Both cycles repeat every three series and are independent: choosing a color never changes a pattern. A one-series chart needing explicit color/pattern should use `series` with one record rather than `data`.

### Slots, events and native attributes

| Slot | Slot parameters | Default content |
| --- | --- | --- |
| `#loading` | None | `loadingText` in a busy status |
| `#empty` | None | `emptyText` in a status |
| `#error` | None | `error` in an alert; compose an app-owned retry button here if needed |

Loading takes precedence over error, then empty, then the chart. No chart/table remains exposed while loading or errored. Custom slot content inherits the state wrapper's role; no retry behavior is built in.

There are no emitted component events, v-models, exposed methods, selection models or network requests. Inspection stays local. Native attributes, class, style and DOM listeners fall through to the root figure. Prefer title/description for naming rather than overriding its ARIA associations. Color values and palette selection remain app-owned; the chart does not depend on Tailwind color names.

## Data and geometry

Input order is authoritative. Labels are categorical and **equally spaced**: a date label does not turn this into a continuous time scale. Applications must sort, aggregate and supply every intended interval. No downsampling, paging, automatic date parsing or hidden data aggregation occurs. Straight lines are the default. smooth=true uses monotone cubic curves through the observations, with zero tangent at extrema and no overshoot. This is presentation only; values and inspection remain unchanged. Gaps split curves just like straight segments.

Null and nonfinite values create gaps and appear as an em dash in the table. Zero is a real plotted observation. All-missing/invalid series are empty. Negative, flat, single-point and very large finite values receive finite coordinates. The default scale includes zero and uses rounded numeric ticks; includeZero=false can magnify small differences, so use it deliberately. One observation draws a point, not a fabricated trend. Line segments never bridge missing observations.

SVG width follows the plot through ResizeObserver, with window resize as a fallback. The server/initial render uses a 640-unit viewBox until measurement; layout recalculates at the measured width so labels remain legible. A 160-unit minimum protects very narrow layouts while the SVG follows the measured width. xLabels=auto estimates label width and samples/truncates labels to fit; xLabels=all expands the SVG when needed and keeps every category label in a horizontally scrollable plot. Very long label text can still be truncated, with the complete label in its SVG title and the table. Keyboard inspection scrolls the selected observation into view. The table retains every original label and value. Per series, up to 120 observations show individual dots; larger series retain the complete line/data table and show the inspected point. This is intended for small dashboard series, not large scientific datasets.

Default numeric formatting uses the environment's locale. Supply deterministic formatters when server/client locale consistency is required. Monetary units and whether values are cents or dollars belong to the app; the component never converts units. The demonstration uses illustrative daily SGD dollar values, independent of the Orders fixtures.

## Multiple series

Use series instead of data/seriesLabel. Each series has a stable unique id, a human-readable label, and its own `{ label, value }` data. Category labels must be unique within each series; duplicate labels are invalid input (the last value wins). Categories align by exact label, with the first series defining category order; categories found only in later series append in encounter order. Supply a complete ordered timeline in the first series when chronology matters. Missing categories produce gaps, never zeroes. All series share one Y scale and one pair of numeric formatters, so use comparable units. Empty series=[] explicitly shows the empty state even if data is supplied. An all-missing series keeps its legend/table column when other series have values.

```vue
<script setup lang="ts">
import { SLineChart } from '@sirius-ui/charts'
import type { SLineChartSeries } from '@sirius-ui/charts'

const channels: readonly SLineChartSeries[] = [
  { id: 'online', label: 'Online', color: 'var(--sirius-primary-content)', pattern: 'solid', data: [{ label: 'Mon', value: 40 }, { label: 'Tue', value: 60 }, { label: 'Wed', value: 50 }] },
  { id: 'store', label: 'In store', color: 'var(--my-store-color)', pattern: 'dashed', data: [{ label: 'Mon', value: 30 }, { label: 'Tue', value: null }, { label: 'Wed', value: 45 }] },
  { id: 'partners', label: 'Partners', color: 'var(--my-partners-color)', pattern: 'dotted', data: [{ label: 'Mon', value: 10 }, { label: 'Tue', value: 25 }, { label: 'Wed', value: 20 }] },
]
</script>

<template>
  <SLineChart class="sales-by-channel" title="Daily sales by channel" :series="channels" smooth x-labels="all" />
</template>

<style scoped>
.sales-by-channel {
  --my-store-color: light-dark(#4338ca, #a5b4fc);
  --my-partners-color: light-dark(#c2410c, #fdba74);
}
</style>
```

The application defines --my-store-color and --my-partners-color with suitable light/dark values; the Sirius theme supplies the inherited color-scheme. If custom colors/patterns are omitted, the first three series use primary-content, content-muted and content with solid, dashed and dotted strokes; the legend reproduces these patterns so color is not the only distinction. These defaults repeat after three series; this small chart is intended for a few series. Pass each series.color (for example `var(--my-chart-color)`) to use an application palette; the application must verify contrast in both appearances. Series are not stacked or independently toggled. The data disclosure has one row per category and one column per series. Inspection skips categories only when every series is missing there.

## Accessibility and interaction

The figure and SVG have unique generated names; description is optional. The plot is one keyboard stop. Focus inspects the first available observation. Left/Right inspect adjacent valid observations; Home/End reach the boundaries; Escape clears inspection; unrelated arrow keys keep normal page behavior. Missing observations are skipped, not announced as zero. Pointer/touch inspection selects the nearest available category and displays its full label/value (all series together when comparing) in a floating tooltip inside the plot viewport. Each series has its own row and color key. The legend is static: values never enter normal layout flow, so inspection does not move the plot. There is no per-point tab-stop list.

Values are also announced through a visually hidden polite atomic status; the visual tooltip is aria-hidden to avoid duplicate announcements. Keyboard focus/arrow inspection shows the same tooltip. It flips/clamps within the visible plot, wraps long labels/values and scrolls for many series. It stays open while hovered, is dismissible with Escape, and follows plot scrolling/resizing (hiding when its anchor scrolls outside view). Leaving the plot/tooltip viewport clears inspection unless the plot still has keyboard focus; blur and unavailable states clear it. View data is a native details disclosure containing a captioned table with row/column headings and all observations. Its scroll region is keyboard reachable. SVG alone is not treated as a complete accessibility solution.

The line uses --sirius-primary-content for clearer contrast than a shade-400 fill on light surfaces. Labels, grid, focus ring, surfaces and rounding use existing --sirius-* tokens, so accent/background/dark changes apply through CSS without chart reinitialization. No animation is added. Consumers own font loading, surrounding headings, meaningful descriptions and locale-specific text.

## Boundaries and examples

- packages/vue and packages/dashboard have no charts dependency. Applications opt into this package explicitly.
- apps/dashboard demonstrates Charts (#charts), a 7/14-day period selector, a two/three-series comparison with straight/rounded controls and independent per-series color/pattern selectors, gaps/negative/zero values and loading/empty/error states. Overview contains a reusable application-local sales chart card.
- The primitive playground does not install charts incidentally.
- Future chart types can share proven layout helpers; do not introduce chart-engine adapters or speculative plotting infrastructure before a real need exists.

Run `npm run check` from the repository root. Tests cover SVG/table naming and escaping, numerical edge cases, gaps, state precedence, keyboard/pointer inspection, resize/cleanup across state changes, CSS isolation and package boundaries. Renderer tests do not replace browser verification.


## SSparkline

Use SSparkline for a compact trend inside a metric card or another summary. It draws a responsive SVG line in the surrounding text color.

```vue
<SSparkline :data="[16, 21, 19, 27, 24, 33, 37]" label="Net sales generally rose over the past week" />
```

Import `SSparkline` and `SSparklineProps` from `@sirius-ui/charts` and import the package stylesheet once in the app.

| Prop | Default | Behavior |
| --- | --- | --- |
| `data` | Required | Readonly array of numbers or nulls in display order. Null and nonfinite values leave gaps. A single observation is shown as a dot. |
| `label` | Unset | Accessible text summary of the trend. When omitted, the graphic is decorative. |
| `height` | 44 | Height in pixels, with a 12px minimum |
| `smooth` | True | Use rounded curves. Set false for straight line segments. |
| `showValues` | False | Enable hover, tap and keyboard inspection of available observations. |
| `valueFormatter` | Locale-aware number | Optional function from a numeric observation to its displayed value. |

The vertical scale fits the series and horizontal positions are evenly spaced. For exact values and comparisons across series, use SLineChart. Enable showValues to highlight the nearest available point and show its value in a compact overlay. Tab to focus, use the arrow keys to inspect points, and press Escape to dismiss. Values are announced to assistive technology. The sparkline has no axes or legends.

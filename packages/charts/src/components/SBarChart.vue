<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef, watch } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import { chartData } from '../chartData'
import { barLayout } from '../barLayout'
import { useChartWidth } from '../composables/useChartWidth'
import type { SBarChartProps } from './SBarChart.types'

const props = withDefaults(defineProps<SBarChartProps>(), {
  data: () => [], orientation: 'vertical', seriesLabel: 'Value', height: 280, loading: false,
  loadingText: 'Loading chart…', emptyText: 'No data to display.',
  dataTableLabel: 'View data', categoryLabel: 'Category',
})
defineSlots<{ loading?(): unknown; empty?(): unknown; error?(): unknown }>()
const id = useId()
const plot = useTemplateRef<HTMLDivElement>('plot')
const svg = useTemplateRef<SVGSVGElement>('svg')
const width = useChartWidth(plot)
const height = computed(() => Number.isFinite(props.height) ? Math.min(600, Math.max(180, props.height)) : 280)
const horizontal = computed(() => props.orientation === 'horizontal')
const instructions = computed(() => props.instructions ?? `Use ${horizontal.value ? 'Up and Down' : 'Left and Right'} arrow keys to explore values. Home and End jump to the first and last category.`)
const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const compactFormat = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })
const format = (value: number) => props.valueFormatter ? props.valueFormatter(value) : numberFormat.format(value)
const formatAxis = (value: number) => props.axisFormatter ? props.axisFormatter(value) : compactFormat.format(value)
const displayValue = (value: number | null) => value !== null && Number.isFinite(value) ? format(value) : '—'
const chart = computed(() => chartData(props.data, props.series, props.seriesLabel))
const layout = computed(() => barLayout(chart.value, width.value, height.value, horizontal.value, formatAxis))
const active = shallowRef<number | null>(null)
const focused = shallowRef(false)
const activeCategory = computed(() => layout.value?.labels.find(label => label.index === active.value))
const readout = computed(() => {
  const row = active.value === null ? undefined : chart.value.rows[active.value]
  return row ? `${row.label} · ${chart.value.series.map((item, index) => `${item.label}: ${displayValue(row.values[index]!)}`).join(' · ')}` : '—'
})
const tooltipEntries = computed(() => chart.value.series.map((item, index) => ({ id: item.id, label: item.label, color: item.color, value: displayValue(active.value === null ? null : chart.value.rows[active.value]?.values[index] ?? null) })))
const tooltipAnchor = computed(() => !layout.value || !activeCategory.value ? null : {
  x: horizontal.value ? (layout.value.left + layout.value.right) / 2 : activeCategory.value.center,
  y: horizontal.value ? activeCategory.value.center : layout.value.top + 24,
})
const available = computed(() => !props.loading && !props.error && Boolean(layout.value))
watch([() => props.data, () => props.series, () => props.orientation], () => { active.value = null })
watch(available, value => { if (!value) { active.value = null; focused.value = false } })
function reveal(index: number) {
  const point = layout.value?.labels[index]
  if (!point) return
  plot.value?.scrollTo?.(horizontal.value ? { top: Math.max(0, point.center - height.value / 2) } : { left: Math.max(0, point.center - width.value / 2) })
}
function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing || !available.value || !layout.value) return
  const points = layout.value.points
  const current = points.findIndex(point => point.index === active.value)
  let next: number
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = points.length - 1
  else if (event.key === (horizontal.value ? 'ArrowDown' : 'ArrowRight')) next = Math.min(points.length - 1, current + 1)
  else if (event.key === (horizontal.value ? 'ArrowUp' : 'ArrowLeft')) next = Math.max(0, current < 0 ? points.length - 1 : current - 1)
  else if (event.key === 'Escape') { active.value = null; event.preventDefault(); return }
  else return
  event.preventDefault()
  active.value = points[next]!.index
  reveal(active.value)
}
function onPointermove(event: PointerEvent) {
  if (!layout.value || !svg.value) return
  const bounds = svg.value.getBoundingClientRect()
  const size = horizontal.value ? bounds.height : bounds.width
  if (!size) return
  const position = horizontal.value ? (event.clientY - bounds.top) * layout.value.height / size : (event.clientX - bounds.left) * layout.value.width / size
  const point = layout.value.points.reduce((best, item) => Math.abs(item.center - position) < Math.abs(best.center - position) ? item : best)
  active.value = point.index
}
function onFocus() {
  focused.value = true
  if (active.value === null && layout.value) { active.value = layout.value.points[0]!.index; reveal(active.value) }
}
function onBlur() { focused.value = false; active.value = null }
</script>

<template>
  <figure class="sirius-line-chart sirius-bar-chart" :aria-labelledby="`${id}-caption`" :aria-busy="loading">
    <figcaption :id="`${id}-caption`" class="sirius-line-chart__sr-only">{{ title }}</figcaption>
    <p v-if="description" :id="`${id}-description`" class="sirius-line-chart__description">{{ description }}</p>
    <div v-if="loading" class="sirius-line-chart__state" :style="{ height: `${height}px` }" role="status"><slot name="loading">{{ loadingText }}</slot></div>
    <div v-else-if="error" class="sirius-line-chart__state sirius-line-chart__error" :style="{ height: `${height}px` }" role="alert"><slot name="error">{{ error }}</slot></div>
    <div v-else-if="!layout" class="sirius-line-chart__state" :style="{ height: `${height}px` }" role="status"><slot name="empty">{{ emptyText }}</slot></div>
    <template v-else>
      <div class="sirius-line-chart__legend"><span v-for="item in chart.series" :key="item.id" class="sirius-line-chart__series"><span aria-hidden="true" class="sirius-bar-chart__key" :style="{ backgroundColor: item.color }"></span>{{ item.label }}</span></div>
      <p class="sirius-line-chart__sr-only" role="status" aria-atomic="true">{{ readout }}</p>
      <p :id="`${id}-instructions`" class="sirius-line-chart__sr-only">{{ instructions }}</p>
      <div class="sirius-chart__viewport" @pointerleave="!focused && (active = null)">
        <div ref="plot" role="group" :aria-label="`Explore ${title}`" :aria-describedby="`${id}-instructions`" tabindex="0" class="sirius-line-chart__plot" :style="horizontal ? { maxHeight: `${height}px` } : undefined" @keydown="onKeydown" @focus="onFocus" @blur="onBlur">
          <svg ref="svg" :viewBox="`0 0 ${layout.width} ${layout.height}`" :style="{ width: `${layout.width}px`, height: `${layout.height}px` }" role="img" :aria-labelledby="`${id}-svg-title`" :aria-describedby="description ? `${id}-description` : undefined" focusable="false" @pointermove="onPointermove" @pointerdown="onPointermove">
            <title :id="`${id}-svg-title`">{{ title }}</title>
            <g aria-hidden="true">
              <g v-for="(tick, tickIndex) in layout.ticks" :key="tick.value">
                <line :x1="horizontal ? tick.position : layout.left" :x2="horizontal ? tick.position : layout.right" :y1="horizontal ? layout.top : tick.position" :y2="horizontal ? layout.bottom : tick.position" class="sirius-line-chart__grid" />
                <text :x="horizontal ? tick.position : layout.left - 10" :y="horizontal ? layout.height - 8 : tick.position" :text-anchor="horizontal ? tickIndex === 0 ? 'start' : tickIndex === layout.ticks.length - 1 ? 'end' : 'middle' : 'end'" :dominant-baseline="horizontal ? undefined : 'middle'" class="sirius-line-chart__label">{{ tick.label }}</text>
              </g>
              <rect v-if="activeCategory" :x="horizontal ? layout.left : activeCategory.center - layout.band / 2" :y="horizontal ? activeCategory.center - layout.band / 2 : layout.top" :width="horizontal ? layout.right - layout.left : layout.band" :height="horizontal ? layout.band : layout.bottom - layout.top" class="sirius-bar-chart__highlight" />
              <template v-for="bar in layout.bars" :key="`${bar.seriesId}-${bar.index}`">
                <rect v-if="bar.value !== 0" :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" rx="3" :fill="bar.color" />
                <line v-else :x1="bar.x" :x2="bar.x + bar.width" :y1="bar.y" :y2="bar.y + bar.height" :stroke="bar.color" stroke-width="2" />
              </template>
              <line :x1="horizontal ? layout.zero : layout.left" :x2="horizontal ? layout.zero : layout.right" :y1="horizontal ? layout.top : layout.zero" :y2="horizontal ? layout.bottom : layout.zero" class="sirius-bar-chart__baseline" />
              <text v-for="label in layout.labels" :key="label.index" :x="horizontal ? layout.left - 10 : label.center" :y="horizontal ? label.center : layout.height - 8" :text-anchor="horizontal ? 'end' : 'middle'" :dominant-baseline="horizontal ? 'middle' : undefined" class="sirius-line-chart__label"><title>{{ label.label }}</title>{{ label.text }}</text>
            </g>
          </svg>
        </div>
        <ChartTooltip v-if="activeCategory && tooltipAnchor" :category="activeCategory.label" :entries="tooltipEntries" :anchor="tooltipAnchor" :plot="plot" :width="width" :height="height" @dismiss="active = null" />
      </div>
      <details class="sirius-line-chart__data"><summary>{{ dataTableLabel }}</summary><div class="sirius-line-chart__table-scroll" role="region" :aria-label="`${title} data`" tabindex="0"><table><caption class="sirius-line-chart__sr-only">{{ title }}</caption><thead><tr><th scope="col">{{ categoryLabel }}</th><th v-for="item in chart.series" :key="item.id" scope="col">{{ item.label }}</th></tr></thead><tbody><tr v-for="(row, index) in chart.rows" :key="index"><th scope="row">{{ row.label }}</th><td v-for="(value, column) in row.values" :key="column">{{ displayValue(value) }}</td></tr></tbody></table></div></details>
    </template>
  </figure>
</template>

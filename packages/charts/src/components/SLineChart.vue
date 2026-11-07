<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef, watch } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import { categorySpacing, lineLayout } from '../lineLayout'
import { chartData } from '../chartData'
import { useChartWidth } from '../composables/useChartWidth'
import type { SLineChartProps } from './SLineChart.types'

const props = withDefaults(defineProps<SLineChartProps>(), {
  data: () => [], smooth: false, xLabels: 'auto', seriesLabel: 'Value', height: 240, includeZero: true, loading: false,
  loadingText: 'Loading chart…', emptyText: 'No data to display.',
  dataTableLabel: 'View data', categoryLabel: 'Period',
  instructions: 'Use Left and Right arrow keys to explore values. Home and End jump to the first and last value.',
})
defineSlots<{ loading?(): unknown; empty?(): unknown; error?(): unknown }>()
const id = useId()
const plot = useTemplateRef<HTMLDivElement>('plot')
const svg = useTemplateRef<SVGSVGElement>('svg')
const width = useChartWidth(plot)
const height = computed(() => Number.isFinite(props.height) ? Math.min(600, Math.max(180, props.height)) : 240)
const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const compactFormat = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })
const format = (value: number) => props.valueFormatter ? props.valueFormatter(value) : numberFormat.format(value)
const formatAxis = (value: number) => props.axisFormatter ? props.axisFormatter(value) : compactFormat.format(value)
const chart = computed(() => chartData(props.data, props.series, props.seriesLabel))
const plotWidth = computed(() => props.xLabels === 'all' ? Math.max(width.value, chart.value.rows.length * categorySpacing(chart.value.inspection) + 100) : width.value)
const layoutOptions = computed(() => ({ values: chart.value.values, smooth: props.smooth, allLabels: props.xLabels === 'all' }))
const layout = computed(() => lineLayout(chart.value.inspection, plotWidth.value, height.value, props.includeZero, formatAxis, layoutOptions.value))
const lines = computed(() => chart.value.series.map(item => ({
  ...item,
  layout: lineLayout(item.data, plotWidth.value, height.value, props.includeZero, formatAxis, layoutOptions.value),
})))
const activeLines = computed(() => lines.value.map(item => ({ ...item, point: item.layout?.points.find(point => point.index === active.value) })))
const readout = computed(() => active.value === null ? '—' : `${chart.value.rows[active.value]?.label} · ${activeLines.value.map(item => `${item.label}: ${displayValue(item.point?.value ?? null)}`).join(' · ')}`)
const active = shallowRef<number | null>(null)
const focused = shallowRef(false)
const activePoint = computed(() => layout.value?.points.find(point => point.index === active.value))
const tooltipEntries = computed(() => activeLines.value.map(item => ({ id: item.id, label: item.label, color: item.color, value: displayValue(item.point?.value ?? null) })))
const available = computed(() => !props.loading && !props.error && Boolean(layout.value))
watch([() => props.data, () => props.series], () => { active.value = null })
watch(available, value => { if (!value) { active.value = null; focused.value = false } })
function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing || !available.value || !layout.value) return
  const points = layout.value.points
  const current = points.findIndex(point => point.index === active.value)
  let next: number
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = points.length - 1
  else if (event.key === 'ArrowRight') next = Math.min(points.length - 1, current + 1)
  else if (event.key === 'ArrowLeft') next = Math.max(0, current < 0 ? points.length - 1 : current - 1)
  else if (event.key === 'Escape') { active.value = null; event.preventDefault(); return }
  else return
  event.preventDefault()
  active.value = points[next]!.index
  plot.value?.scrollTo?.({ left: Math.max(0, points[next]!.x - width.value / 2) })
}
function onPointermove(event: PointerEvent) {
  if (!layout.value || !svg.value) return
  const bounds = svg.value.getBoundingClientRect()
  if (!bounds.width) return
  const x = (event.clientX - bounds.left) * plotWidth.value / bounds.width
  const nearest = layout.value.points.reduce((best, point) => Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best)
  active.value = nearest.index
}
function onFocus() {
  focused.value = true
  if (active.value === null && layout.value) {
    const point = layout.value.points[0]!
    active.value = point.index
    plot.value?.scrollTo?.({ left: Math.max(0, point.x - width.value / 2) })
  }
}
function onBlur() { focused.value = false; active.value = null }
function displayValue(value: number | null) { return value !== null && Number.isFinite(value) ? format(value) : '—' }
</script>

<template>
  <figure class="sirius-line-chart" :aria-labelledby="`${id}-caption`" :aria-busy="loading">
    <figcaption :id="`${id}-caption`" class="sirius-line-chart__sr-only">{{ title }}</figcaption>
    <p v-if="description" :id="`${id}-description`" class="sirius-line-chart__description">{{ description }}</p>
    <div v-if="loading" class="sirius-line-chart__state" :style="{ height: `${height}px` }" role="status"><slot name="loading">{{ loadingText }}</slot></div>
    <div v-else-if="error" class="sirius-line-chart__state sirius-line-chart__error" :style="{ height: `${height}px` }" role="alert"><slot name="error">{{ error }}</slot></div>
    <div v-else-if="!layout" class="sirius-line-chart__state" :style="{ height: `${height}px` }" role="status"><slot name="empty">{{ emptyText }}</slot></div>
    <template v-else>
      <div class="sirius-line-chart__legend"><span v-for="item in lines" :key="item.id" class="sirius-line-chart__series" :style="{ '--sirius-chart-color': item.color }"><span aria-hidden="true" class="sirius-line-chart__key" :style="{ borderTopStyle: item.pattern }"></span>{{ item.label }}</span></div>
      <p class="sirius-line-chart__sr-only" role="status" aria-atomic="true">{{ lines.length === 1 && activePoint ? `${activePoint.label} · ${format(activePoint.value)}` : readout }}</p>
      <p :id="`${id}-instructions`" class="sirius-line-chart__sr-only">{{ instructions }}</p>
      <div class="sirius-chart__viewport" @pointerleave="!focused && (active = null)">
        <div ref="plot" role="group" :aria-label="`Explore ${title}`" :aria-describedby="`${id}-instructions`" tabindex="0" class="sirius-line-chart__plot" @keydown="onKeydown" @focus="onFocus" @blur="onBlur">
          <svg ref="svg" :viewBox="`0 0 ${plotWidth} ${height}`" :style="{ height: `${height}px`, width: `${plotWidth}px` }" role="img" :aria-labelledby="`${id}-svg-title`" :aria-describedby="description ? `${id}-description` : undefined" focusable="false" @pointermove="onPointermove" @pointerdown="onPointermove">
            <title :id="`${id}-svg-title`">{{ title }}</title>
            <g aria-hidden="true">
              <g v-for="tick in layout.ticks" :key="tick.value"><line :x1="layout.left" :x2="layout.right" :y1="tick.y" :y2="tick.y" class="sirius-line-chart__grid" /><text :x="layout.left - 10" :y="tick.y" text-anchor="end" dominant-baseline="middle" class="sirius-line-chart__label">{{ tick.label }}</text></g>
              <text v-for="label in layout.labels" :key="label.index" :x="label.x" :y="height - 8" :text-anchor="label.anchor" class="sirius-line-chart__label"><title>{{ label.label }}</title>{{ label.text }}</text>
              <g v-for="item in lines" :key="item.id" :style="{ '--sirius-chart-color': item.color }">
                <template v-if="item.layout">
                  <path v-for="(segment, index) in item.layout.segments" :key="index" :d="segment" :stroke-dasharray="item.dash" class="sirius-line-chart__line" />
                  <template v-if="item.layout.points.length <= 120"><circle v-for="point in item.layout.points" :key="point.index" :cx="point.x" :cy="point.y" r="3" class="sirius-line-chart__point" /></template>
                </template>
              </g>
              <line v-if="activePoint" :x1="activePoint.x" :x2="activePoint.x" :y1="layout.top" :y2="layout.bottom" class="sirius-line-chart__guide" />
              <template v-for="item in activeLines" :key="item.id"><circle v-if="item.point" :cx="item.point.x" :cy="item.point.y" r="5" class="sirius-line-chart__active" :style="{ '--sirius-chart-color': item.color }" /></template>
            </g>
          </svg>
        </div>
        <ChartTooltip v-if="activePoint" :category="activePoint.label" :entries="tooltipEntries" :anchor="activePoint" :plot="plot" :width="width" :height="height" @dismiss="active = null" />
      </div>
      <details class="sirius-line-chart__data"><summary>{{ dataTableLabel }}</summary><div class="sirius-line-chart__table-scroll" role="region" :aria-label="`${title} data`" tabindex="0"><table><caption class="sirius-line-chart__sr-only">{{ title }}</caption><thead><tr><th scope="col">{{ categoryLabel }}</th><th v-for="item in lines" :key="item.id" scope="col">{{ item.label }}</th></tr></thead><tbody><tr v-for="(row, index) in chart.rows" :key="index"><th scope="row">{{ row.label }}</th><td v-for="(value, column) in row.values" :key="column">{{ displayValue(value) }}</td></tr></tbody></table></div></details>
    </template>
  </figure>
</template>

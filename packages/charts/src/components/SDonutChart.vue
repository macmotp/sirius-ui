<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef, watch } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import { donutLayout } from '../donutLayout'
import { useChartWidth } from '../composables/useChartWidth'
import type { SDonutChartProps } from './SDonutChart.types'

const props = withDefaults(defineProps<SDonutChartProps>(), {
  data: () => [], height: 280, innerRadius: .65, showTotal: true,
  totalLabel: 'Total', valueLabel: 'Value', percentageLabel: 'Share', loading: false,
  loadingText: 'Loading chart…', emptyText: 'No data to display.',
  dataTableLabel: 'View data', categoryLabel: 'Category',
  instructions: 'Use arrow keys to explore slices. Home and End jump to the first and last slice.',
})
defineSlots<{ loading?(): unknown; empty?(): unknown; error?(): unknown }>()
const id = useId()
const plot = useTemplateRef<HTMLDivElement>('plot')
const svg = useTemplateRef<SVGSVGElement>('svg')
const width = useChartWidth(plot)
const height = computed(() => Number.isFinite(props.height) ? Math.min(600, Math.max(180, props.height)) : 280)
const layout = computed(() => donutLayout(props.data, width.value, height.value, props.innerRadius))
const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 1 })
const format = (value: number) => props.valueFormatter ? props.valueFormatter(value) : numberFormat.format(value)
const percentage = (share: number) => props.percentageFormatter ? props.percentageFormatter(share) : percentFormat.format(share)
const displayValue = (value: number | null) => value === null ? '—' : format(value)
const total = computed(() => layout.value.total === null ? '—' : props.totalFormatter ? props.totalFormatter(layout.value.total) : format(layout.value.total))
const active = shallowRef<number | null>(null)
const focused = shallowRef(false)
const activeSlice = computed(() => layout.value.slices.find(slice => slice.index === active.value))
const tooltipEntries = computed(() => activeSlice.value ? [{ id: activeSlice.value.id, label: props.valueLabel, color: activeSlice.value.color, value: `${format(activeSlice.value.value!)} · ${percentage(activeSlice.value.share)}` }] : [])
const readout = computed(() => activeSlice.value ? `${activeSlice.value.label} · ${format(activeSlice.value.value!)} · ${percentage(activeSlice.value.share)}` : '—')
const available = computed(() => !props.loading && !props.error && layout.value.slices.length > 0)
watch(() => props.data, () => { active.value = null })
watch(available, value => { if (!value) { active.value = null; focused.value = false } })
function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing || !available.value) return
  const slices = layout.value.slices
  const current = slices.findIndex(slice => slice.index === active.value)
  let next: number
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = slices.length - 1
  else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(slices.length - 1, current + 1)
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, current < 0 ? slices.length - 1 : current - 1)
  else if (event.key === 'Escape') { active.value = null; event.preventDefault(); return }
  else return
  event.preventDefault()
  active.value = slices[next]!.index
}
function onFocus() { focused.value = true; if (active.value === null) active.value = layout.value.slices[0]?.index ?? null }
function onBlur() { focused.value = false; active.value = null }
function onPointermove(event: PointerEvent) {
  if (!svg.value || !available.value) return
  const bounds = svg.value.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  const x = (event.clientX - bounds.left) * width.value / bounds.width - layout.value.cx
  const y = (event.clientY - bounds.top) * height.value / bounds.height - layout.value.cy
  const distance = Math.hypot(x, y)
  if (distance < layout.value.inner || distance > layout.value.radius) { if (!focused.value) active.value = null; return }
  let angle = Math.atan2(y, x)
  if (angle < -Math.PI / 2) angle += 2 * Math.PI
  active.value = layout.value.slices.find(slice => angle >= slice.start && angle <= slice.end)?.index ?? null
}
</script>

<template>
  <figure class="sirius-line-chart sirius-donut-chart" :aria-labelledby="`${id}-caption`" :aria-busy="loading">
    <figcaption :id="`${id}-caption`" class="sirius-line-chart__sr-only">{{ title }}</figcaption>
    <p v-if="description" :id="`${id}-description`" class="sirius-line-chart__description">{{ description }}</p>
    <div v-if="loading" class="sirius-line-chart__state" :style="{ height: `${height}px` }" role="status"><slot name="loading">{{ loadingText }}</slot></div>
    <div v-else-if="error" class="sirius-line-chart__state sirius-line-chart__error" :style="{ height: `${height}px` }" role="alert"><slot name="error">{{ error }}</slot></div>
    <div v-else-if="!layout.slices.length" class="sirius-line-chart__state" :style="{ height: `${height}px` }" role="status"><slot name="empty">{{ emptyText }}</slot></div>
    <template v-else>
      <div class="sirius-line-chart__legend"><span v-for="item in layout.rows" :key="item.id" class="sirius-line-chart__series"><span aria-hidden="true" class="sirius-bar-chart__key" :style="{ backgroundColor: item.color }"></span>{{ item.label }}</span></div>
      <p class="sirius-line-chart__sr-only" role="status" aria-atomic="true">{{ readout }}</p>
      <p :id="`${id}-instructions`" class="sirius-line-chart__sr-only">{{ instructions }}</p>
      <div class="sirius-chart__viewport" @pointerleave="!focused && (active = null)">
        <div ref="plot" role="group" :aria-label="`Explore ${title}`" :aria-describedby="`${id}-instructions`" tabindex="0" class="sirius-line-chart__plot" @keydown="onKeydown" @focus="onFocus" @blur="onBlur">
          <svg ref="svg" :viewBox="`0 0 ${width} ${height}`" :style="{ width: `${width}px`, height: `${height}px` }" role="img" :aria-labelledby="`${id}-svg-title`" :aria-describedby="description ? `${id}-description` : undefined" focusable="false" @pointermove="onPointermove" @pointerdown="onPointermove">
            <title :id="`${id}-svg-title`">{{ title }}</title>
            <g aria-hidden="true">
              <path v-for="slice in layout.slices" :key="slice.id" :d="slice.path" :fill="slice.color" class="sirius-donut-chart__slice" />
              <path v-for="slice in layout.slices" :key="`border-${slice.id}`" :d="slice.curves" stroke="var(--sirius-canvas)" class="sirius-donut-chart__curves" />
              <path v-if="activeSlice" :d="activeSlice.curves" :stroke="activeSlice.color" class="sirius-donut-chart__curves sirius-donut-chart__curves--active" />
            </g>
          </svg>
        </div>
        <div v-if="showTotal" aria-hidden="true" class="sirius-donut-chart__center" :style="{ left: `${layout.cx}px`, top: `${layout.cy}px`, width: `${layout.inner * 1.7}px` }"><p class="sirius-donut-chart__total" :title="total">{{ total }}</p><p class="sirius-donut-chart__total-label" :title="totalLabel">{{ totalLabel }}</p></div>
        <ChartTooltip v-if="activeSlice" :category="activeSlice.label" :entries="tooltipEntries" :anchor="activeSlice" :plot="plot" :width="width" :height="height" @dismiss="active = null" />
      </div>
      <details class="sirius-line-chart__data"><summary>{{ dataTableLabel }}</summary><div class="sirius-line-chart__table-scroll" role="region" :aria-label="`${title} data`" tabindex="0"><table><caption class="sirius-line-chart__sr-only">{{ title }}</caption><thead><tr><th scope="col">{{ categoryLabel }}</th><th scope="col">{{ valueLabel }}</th><th scope="col">{{ percentageLabel }}</th></tr></thead><tbody><tr v-for="item in layout.rows" :key="item.id"><th scope="row">{{ item.label }}</th><td>{{ displayValue(item.value) }}</td><td>{{ item.value === null ? '—' : percentage(item.share) }}</td></tr></tbody><tfoot><tr><th scope="row">{{ totalLabel }}</th><td>{{ total }}</td><td>{{ percentage(1) }}</td></tr></tfoot></table></div></details>
    </template>
  </figure>
</template>

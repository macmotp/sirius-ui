<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef, watch } from 'vue'
import type { PropType } from 'vue'
import { linePath } from '../lineLayout'
import { numericPosition } from '../numericScale'
import type { SSparklineProps } from './SSparkline.types'

const props = defineProps({
  data: { type: Array as PropType<SSparklineProps['data']>, required: true },
  label: String,
  height: { type: Number, default: 44 },
  smooth: { type: Boolean, default: true },
  showValues: Boolean,
  valueFormatter: Function as PropType<SSparklineProps['valueFormatter']>,
})
const width = 240
const height = computed(() => Number.isFinite(props.height) ? Math.max(12, props.height) : 44)
const svg = useTemplateRef<SVGSVGElement>('svg')
const instructionsId = useId()
const active = shallowRef<number | null>(null)
const focused = shallowRef(false)
const numberFormat = new Intl.NumberFormat()

const points = computed(() => {
  const valid = (value: number | null): value is number => typeof value === 'number' && Number.isFinite(value)
  const values = props.data.filter(valid)
  if (!values.length) return []

  const min = values.reduce((a, b) => Math.min(a, b))
  const max = values.reduce((a, b) => Math.max(a, b))
  return props.data.flatMap((value, index) => {
    if (!valid(value)) return []
    const x = props.data.length === 1 ? width / 2 : 3 + index / (props.data.length - 1) * (width - 6)
    const y = min === max ? height.value / 2 : numericPosition(value, { min, max }, height.value - 3, 3)
    return [{ x, y, index, value }]
  })
})

const segments = computed(() => {
  const groups: (typeof points.value)[] = []
  for (const point of points.value) {
    const group = groups.at(-1)
    if (group && group.at(-1)!.index + 1 === point.index) group.push(point)
    else groups.push([point])
  }
  return groups.map(points => ({
    first: points[0]!,
    path: points.length > 1 ? linePath(points, props.smooth) : '',
  }))
})

const inspectable = computed(() => props.showValues && points.value.length > 0)
const selected = computed(() => inspectable.value && active.value !== null ? points.value[active.value] : undefined)
const displayValue = computed(() => {
  if (!selected.value) return ''
  const value = selected.value.value
  return props.valueFormatter ? props.valueFormatter(value) : numberFormat.format(value)
})

watch([() => props.data, () => props.showValues], () => { active.value = null })
watch(() => Boolean(selected.value), (visible, _, onCleanup) => {
  if (!visible || typeof window === 'undefined') return
  const dismiss = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !event.isComposing) active.value = null
  }
  window.addEventListener('keydown', dismiss)
  onCleanup(() => window.removeEventListener('keydown', dismiss))
})

function inspectPointer(event: PointerEvent) {
  if (!inspectable.value) return
  const bounds = svg.value?.getBoundingClientRect()
  if (!bounds?.width) return

  const x = (event.clientX - bounds.left) / bounds.width * width
  active.value = points.value.reduce((nearest, point, index) =>
    Math.abs(point.x - x) < Math.abs(points.value[nearest]!.x - x) ? index : nearest, 0)
}

function onFocus() {
  if (!inspectable.value) return
  focused.value = true
  active.value ??= 0
}

function onBlur() {
  focused.value = false
  active.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (!inspectable.value || event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return

  const last = points.value.length - 1
  switch (event.key) {
    case 'Home': active.value = 0; break
    case 'End': active.value = last; break
    case 'ArrowLeft': active.value = Math.max(0, (active.value ?? 1) - 1); break
    case 'ArrowRight': active.value = Math.min(last, (active.value ?? -1) + 1); break
    case 'Escape': active.value = null; break
    default: return
  }
  event.preventDefault()
}
</script>

<template>
  <div
    class="sirius-sparkline__frame"
    :tabindex="inspectable ? 0 : undefined"
    :role="inspectable ? 'group' : undefined"
    :aria-label="inspectable ? label || 'Trend values' : undefined"
    :aria-describedby="inspectable ? instructionsId : undefined"
    @pointerleave="!focused && (active = null)"
    @focus="onFocus"
    @blur="onBlur"
    @keydown="onKeydown"
  >
    <svg
      ref="svg"
      class="sirius-sparkline"
      :viewBox="`0 0 ${width} ${height}`"
      :height="height"
      preserveAspectRatio="none"
      :role="!inspectable && label ? 'img' : undefined"
      :aria-label="inspectable ? undefined : label"
      :aria-hidden="inspectable || !label ? true : undefined"
      focusable="false"
      @pointermove="inspectPointer"
      @pointerdown="inspectPointer"
    >
      <template v-for="(segment, index) in segments" :key="index">
        <path v-if="segment.path" :d="segment.path" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <circle v-else :cx="segment.first.x" :cy="segment.first.y" r="2" fill="currentColor" />
      </template>
      <line v-if="selected" :x1="selected.x" :x2="selected.x" :y1="0" :y2="height" class="sirius-sparkline__guide" vector-effect="non-scaling-stroke" />
      <circle v-if="selected" :cx="selected.x" :cy="selected.y" r="2.5" fill="currentColor" />
    </svg>
    <template v-if="inspectable">
      <span :id="instructionsId" class="sirius-line-chart__sr-only">Use the left and right arrow keys to inspect values.</span>
      <span class="sirius-line-chart__sr-only" role="status" aria-atomic="true">{{ displayValue }}</span>
      <span v-if="selected" class="sirius-sparkline__readout" aria-hidden="true">{{ displayValue }}</span>
    </template>
  </div>
</template>

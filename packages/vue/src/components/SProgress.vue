<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { nativeControlAttrs } from './controlStyles'
import type { SProgressProps } from './SProgress.types'

defineOptions({ inheritAttrs: false })
const { label, value = null, max = 100, color = 'primary', size = 'md', showLabel = true, showValue = false, valueText } = defineProps<SProgressProps>()
defineSlots<{}>()
const attrs = useAttrs()
const limit = computed(() => Number.isFinite(max) && max > 0 ? max : 100)
const current = computed(() => typeof value === 'number' && Number.isFinite(value) ? Math.min(limit.value, Math.max(0, value)) : undefined)
const percentage = computed(() => current.value === undefined ? undefined : current.value / limit.value * 100)
const fillStyle = computed(() => percentage.value === undefined ? undefined : { width: `${percentage.value}%` })
const colors = { primary: 'bg-primary', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' }
const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }
</script>

<template>
  <div :class="attrs.class" :style="attrs.style" class="min-w-0 font-sans text-sm text-content">
    <div v-if="showLabel || showValue" class="mb-2 flex items-start justify-between gap-3" aria-hidden="true">
      <span v-if="showLabel" class="min-w-0 break-words font-medium">{{ label }}</span>
      <span v-if="showValue" class="shrink-0 text-content-muted" :class="{ 'ms-auto': !showLabel }">{{ percentage === undefined ? 'Loading…' : `${Math.round(percentage)}%` }}</span>
    </div>
    <div
      v-bind="nativeControlAttrs(attrs)"
      role="progressbar"
      :aria-label="label"
      :aria-valuemin="0"
      :aria-valuemax="limit"
      :aria-valuenow="current"
      :aria-valuetext="valueText"
      class="overflow-hidden rounded-full bg-range-track"
      :class="heights[size]"
    >
      <div aria-hidden="true" class="h-full rounded-[inherit] transition-[width] duration-200 motion-reduce:transition-none" :class="[colors[color], { 'sirius-progress-indeterminate': percentage === undefined }]" :style="fillStyle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SSkeletonProps } from './SSkeleton.types'

const props = withDefaults(defineProps<SSkeletonProps>(), { shape: 'text', animated: true })
defineSlots<{}>()
function dimension(value: string | number | undefined, fallback: string) { return typeof value === 'number' ? `${value}px` : value ?? fallback }
const dimensions = computed(() => ({
  width: dimension(props.width, props.shape === 'circle' ? 'calc(var(--sirius-spacing) * 10)' : '100%'),
  height: dimension(props.height, props.shape === 'text' ? 'calc(var(--sirius-spacing) * 4)' : props.shape === 'circle' ? 'calc(var(--sirius-spacing) * 10)' : 'calc(var(--sirius-spacing) * 24)'),
}))
</script>

<template>
  <span aria-hidden="true" class="block shrink-0 bg-skeleton" :class="[shape === 'rounded' ? 'rounded-2xl' : 'rounded-full', { 'motion-safe:animate-pulse': animated }]" :style="dimensions"></span>
</template>

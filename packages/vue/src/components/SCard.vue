<script setup lang="ts">
import { computed } from 'vue'
import type { SCardCorner, SCardProps } from './SCard.types'

const props = defineProps<SCardProps>()
defineSlots<{ default?(): unknown; header?(): unknown; footer?(): unknown }>()
const corners: Record<SCardCorner, string> = {
  'top-left': 'rounded-tl-4xl',
  'top-right': 'rounded-tr-4xl',
  'bottom-left': 'rounded-bl-4xl',
  'bottom-right': 'rounded-br-4xl',
}
const bentoClasses = computed(() => {
  const selected = props.bento === undefined ? [] : typeof props.bento === 'string' ? [props.bento] : props.bento
  return selected.map((corner) => corners[corner])
})
</script>

<template>
  <div class="relative min-w-0 rounded-2xl bg-surface text-content after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line" :class="bentoClasses">
    <div v-if="$slots.header" class="px-6 pt-6"><slot name="header" /></div>
    <div v-if="$slots.default" class="p-6"><slot /></div>
    <div v-if="$slots.footer" class="px-6 pb-6"><slot name="footer" /></div>
  </div>
</template>

<script setup lang="ts">
import type { SBadgeColor, SBadgeProps, SBadgeVariant } from './SBadge.types'

withDefaults(defineProps<SBadgeProps>(), { color: 'primary', variant: 'soft', size: 'md' })
defineSlots<{ default?(): unknown; leading?(): unknown; trailing?(): unknown }>()
const sizes = {
  sm: 'gap-1 px-2 py-0.5 text-xs leading-4',
  md: 'gap-1.5 px-2.5 py-1 text-xs leading-4',
  lg: 'gap-1.5 px-3 py-1 text-sm leading-5',
}
const colors: Record<SBadgeColor, Record<SBadgeVariant, string>> = {
  primary: { soft: 'bg-primary-soft text-primary-content', solid: 'bg-primary text-on-primary', outline: 'text-primary-content ring-1 ring-inset ring-primary' },
  success: { soft: 'bg-success-soft text-success-content', solid: 'bg-success text-on-success', outline: 'text-success-content ring-1 ring-inset ring-success' },
  warning: { soft: 'bg-warning-soft text-warning-content', solid: 'bg-warning text-on-warning', outline: 'text-warning-content ring-1 ring-inset ring-warning' },
  danger: { soft: 'bg-danger-soft text-danger-content', solid: 'bg-danger text-on-danger', outline: 'text-danger-content ring-1 ring-inset ring-danger' },
}
</script>

<template>
  <span class="inline-flex max-w-full items-center rounded-full align-middle font-medium" :class="[sizes[size], colors[color][variant]]">
    <span v-if="$slots.leading" aria-hidden="true" class="inline-flex size-3.5 shrink-0 items-center justify-center [&>svg]:size-full"><slot name="leading" /></span>
    <span class="min-w-0 break-words"><slot /></span>
    <span v-if="$slots.trailing" aria-hidden="true" class="inline-flex size-3.5 shrink-0 items-center justify-center [&>svg]:size-full"><slot name="trailing" /></span>
  </span>
</template>

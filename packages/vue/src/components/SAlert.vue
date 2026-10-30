<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@lucide/vue'
import type { SAlertColor, SAlertProps, SAlertVariant } from './SAlert.types'

withDefaults(defineProps<SAlertProps>(), {
  color: 'primary',
  variant: 'soft',
  icon: true,
  dismissible: false,
  dismissLabel: 'Dismiss alert',
  role: 'status',
})
const open = defineModel<boolean>('open', { default: true })
const emit = defineEmits<{ dismiss: [event: MouseEvent] }>()
defineSlots<{ default?(): unknown; title?(): unknown; icon?(): unknown; actions?(): unknown }>()
const icons = { primary: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert }
const colors: Record<SAlertColor, Record<SAlertVariant, string>> = {
  primary: { soft: 'bg-primary-soft text-primary-content', solid: 'bg-primary text-on-primary', outline: 'bg-canvas text-primary-content ring-1 ring-inset ring-primary' },
  success: { soft: 'bg-success-soft text-success-content', solid: 'bg-success text-on-success', outline: 'bg-canvas text-success-content ring-1 ring-inset ring-success' },
  warning: { soft: 'bg-warning-soft text-warning-content', solid: 'bg-warning text-on-warning', outline: 'bg-canvas text-warning-content ring-1 ring-inset ring-warning' },
  danger: { soft: 'bg-danger-soft text-danger-content', solid: 'bg-danger text-on-danger', outline: 'bg-canvas text-danger-content ring-1 ring-inset ring-danger' },
}

function dismiss(event: MouseEvent) {
  open.value = false
  emit('dismiss', event)
}
</script>

<template>
  <div v-if="open" :role="role" aria-atomic="true" class="flex min-w-0 items-start gap-3 rounded-2xl p-4 text-sm leading-6" :class="colors[color][variant]">
    <span v-if="icon" aria-hidden="true" class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-full">
      <slot name="icon"><component :is="icons[color]" focusable="false" /></slot>
    </span>
    <div class="min-w-0 flex-1 break-words">
      <div v-if="title || $slots.title" class="font-semibold"><slot name="title">{{ title }}</slot></div>
      <div v-if="$slots.default" :class="{ 'mt-1': title || $slots.title }"><slot /></div>
      <div v-if="$slots.actions" class="mt-3 flex flex-wrap items-center gap-3"><slot name="actions" /></div>
    </div>
    <button v-if="dismissible" type="button" :aria-label="dismissLabel" class="-m-0.5 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current" @click="dismiss">
      <X aria-hidden="true" focusable="false" class="size-4" />
    </button>
  </div>
</template>

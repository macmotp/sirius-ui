<script setup lang="ts">
import SToast from './SToast.vue'
import type { SToastDismissReason, SToastItem, SToasterProps } from './SToast.types'

const { toasts, position = 'bottom-right', label = 'Notifications' } = defineProps<SToasterProps>()
const emit = defineEmits<{ dismiss: [id: string, reason: SToastDismissReason] }>()
defineSlots<{ actions?(props: { toast: SToastItem }): unknown }>()
const positions = {
  'top-left': 'left-4 top-[max(1rem,env(safe-area-inset-top))]',
  'top-right': 'right-4 top-[max(1rem,env(safe-area-inset-top))]',
  'bottom-left': 'left-4 bottom-[max(1rem,env(safe-area-inset-bottom))]',
  'bottom-right': 'right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]',
}
</script>

<template>
  <div role="region" :aria-label="label" class="pointer-events-none fixed z-50 flex max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-sm flex-col gap-3 overflow-y-auto p-1" :class="positions[position]">
    <SToast v-for="toast in toasts" :key="toast.id" :title="toast.title" :description="toast.description" :color="toast.color" :duration="toast.duration" :role="toast.role" @dismiss="reason => emit('dismiss', toast.id, reason)">
      <template v-if="$slots.actions" #actions><slot name="actions" :toast="toast" /></template>
    </SToast>
  </div>
</template>

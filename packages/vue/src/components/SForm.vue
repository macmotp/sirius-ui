<script setup lang="ts">
import type { SFormProps } from './SForm.types'

withDefaults(defineProps<SFormProps>(), { columns: 1 })
const emit = defineEmits<{ submit: [event: SubmitEvent]; reset: [event: Event] }>()
defineSlots<{ default?(): unknown; actions?(): unknown }>()

const layouts = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}
</script>

<template>
  <form class="grid min-w-0 items-start gap-6" :class="layouts[columns]" @submit="emit('submit', $event)" @reset="emit('reset', $event)">
    <slot />
    <div v-if="$slots.actions" class="col-span-full flex flex-wrap items-center gap-3"><slot name="actions" /></div>
  </form>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import type { SDividerProps } from './SDivider.types'

const props = withDefaults(defineProps<SDividerProps>(), { orientation: 'horizontal', decorative: false })
const slots = defineSlots<{ default?(): unknown }>()
const id = useId()
function hasLabel() { return !!(props.label || slots.default) }
</script>

<template>
  <hr v-if="orientation === 'horizontal' && !hasLabel()" :aria-hidden="decorative || undefined" class="m-0 w-full border-0 border-t border-solid border-line" />
  <div v-else role="separator" :aria-orientation="orientation" :aria-labelledby="hasLabel() && !decorative ? `${id}-label` : undefined" :aria-hidden="decorative || undefined" class="flex shrink-0 items-center gap-3" :class="orientation === 'vertical' ? 'min-h-6 flex-col self-stretch' : 'w-full min-w-0'">
    <span aria-hidden="true" class="flex-1 border-0 border-solid border-line" :class="orientation === 'vertical' ? 'min-h-3 border-s' : 'min-w-4 border-t'"></span>
    <span v-if="hasLabel()" :id="`${id}-label`" class="min-w-0 break-words text-center font-sans text-xs font-medium leading-5 text-content-muted"><slot>{{ label }}</slot></span>
    <span v-if="hasLabel()" aria-hidden="true" class="flex-1 border-0 border-solid border-line" :class="orientation === 'vertical' ? 'min-h-3 border-s' : 'min-w-4 border-t'"></span>
  </div>
</template>

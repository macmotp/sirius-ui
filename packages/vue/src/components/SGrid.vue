<script setup lang="ts">
import type { SGridProps } from './SGrid.types'

withDefaults(defineProps<SGridProps>(), { columns: 1 })
defineSlots<{ default?(): unknown }>()

const layouts = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}
</script>

<template>
  <div class="grid min-w-0 gap-6 [&>*]:min-w-0" :class="layouts[columns]">
    <slot />
  </div>
</template>

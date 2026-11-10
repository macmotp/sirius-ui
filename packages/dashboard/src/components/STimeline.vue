<script setup lang="ts" generic="T extends STimelineItem">
import type { STimelineItem, STimelineProps } from './STimeline.types'

withDefaults(defineProps<STimelineProps<T>>(), {
  label: 'Timeline',
  emptyText: 'No activity yet.',
})
defineSlots<{ marker?(props: { item: T }): unknown; detail?(props: { item: T }): unknown }>()
</script>

<template>
  <div class="min-w-0">
    <ol v-if="items.length" role="list" :aria-label="label" class="m-0 list-none p-0">
      <li
        v-for="item in items"
        :key="item.id"
        class="relative flex items-start gap-3 pb-5 last:pb-0 before:absolute before:start-4 before:top-4 before:-bottom-4 before:w-px before:bg-line-strong last:before:hidden"
      >
        <span aria-hidden="true" class="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-content-muted">
          <slot name="marker" :item="item"><span class="size-2 rounded-full bg-primary"></span></slot>
        </span>
        <div class="min-w-0 flex-1 pt-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p class="m-0 min-w-0 text-sm font-medium text-content wrap-anywhere">{{ item.title }}</p>
            <time v-if="item.time" :datetime="item.time.datetime" class="text-xs text-content-muted">{{ item.time.label }}</time>
          </div>
          <div v-if="item.detail || $slots.detail" class="mt-2 text-sm text-content-muted wrap-anywhere">
            <slot name="detail" :item="item">{{ item.detail }}</slot>
          </div>
        </div>
      </li>
    </ol>
    <p v-else class="m-0 text-sm text-content-muted">{{ emptyText }}</p>
  </div>
</template>

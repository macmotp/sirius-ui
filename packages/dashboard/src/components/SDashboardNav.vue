<script setup lang="ts" generic="T extends SDashboardNavItem">
import { computed, useId } from 'vue'
import type { SDashboardNavItem, SDashboardNavProps } from './SDashboardNav.types'

const { groups, current, linkAs = 'a' } = defineProps<SDashboardNavProps<T>>()
const emit = defineEmits<{ select: [item: T, event: MouseEvent] }>()
defineSlots<{ badge?(props: { item: T; active: boolean }): unknown }>()
const id = useId()
const visibleGroups = computed(() => groups.filter(group => group.items.length > 0))
function active(item: T) { return !item.disabled && item.id === current }
function itemClasses(item: T) {
  if (item.disabled) return 'cursor-not-allowed text-content-muted opacity-50'
  return active(item) ? 'text-primary-content bg-primary-soft' : 'text-content-muted hover:bg-surface-hover hover:text-content'
}
function select(item: T, event: MouseEvent) { if (!item.disabled) emit('select', item, event) }
</script>

<template>
  <div class="min-w-0 space-y-8 font-sans text-sm">
    <div v-for="(group, index) in visibleGroups" :key="group.id" class="min-w-0">
      <p v-if="group.label" :id="`${id}-group-${index}`" class="m-0 mb-3 break-words px-3 text-xs font-medium tracking-widest text-content-subtle uppercase">{{ group.label }}</p>
      <ul :aria-labelledby="group.label ? `${id}-group-${index}` : undefined" class="m-0 list-none space-y-1.5 p-0">
        <li v-for="item in group.items" :key="item.id" class="min-w-0">
          <component
            :is="item.disabled ? 'span' : linkAs"
            v-bind="item.disabled ? undefined : item.linkProps"
            :href="item.disabled ? undefined : item.href"
            :target="item.disabled ? undefined : item.target"
            :rel="item.disabled ? undefined : item.rel"
            :role="item.disabled ? 'link' : undefined"
            :aria-disabled="item.disabled || undefined"
            :aria-current="active(item) ? 'page' : undefined"
            class="box-border flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium leading-6 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            :class="itemClasses(item)"
            @click="select(item, $event)"
          >
            <component :is="item.icon" v-if="item.icon" aria-hidden="true" focusable="false" class="size-5 shrink-0" />
            <span class="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">{{ item.label }}</span>
            <slot name="badge" :item="item" :active="active(item)">
              <span v-if="item.badge !== undefined" class="shrink-0 rounded-control bg-surface px-2 py-0.5 text-xs text-content-muted"><span aria-hidden="true">{{ item.badge }}</span><span class="sr-only">{{ item.badgeLabel ?? item.badge }}</span></span>
            </slot>
          </component>
        </li>
      </ul>
    </div>
  </div>
</template>

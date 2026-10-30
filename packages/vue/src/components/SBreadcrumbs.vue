<script setup lang="ts" generic="T extends SBreadcrumbsItem">
import { ChevronRight } from '@lucide/vue'
import type { SBreadcrumbsItem, SBreadcrumbsProps } from './SBreadcrumbs.types'

const { items = [], label = 'Breadcrumb', linkAs = 'a' } = defineProps<SBreadcrumbsProps<T>>()
defineSlots<{
  item?(props: { item: T; index: number; current: boolean }): unknown
  separator?(): unknown
}>()
</script>

<template>
  <nav :aria-label="label" class="min-w-0 font-sans text-sm leading-6">
    <ol class="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
      <li
        v-for="(item, index) in items"
        :key="item.value"
        class="flex min-w-0 max-w-full items-center gap-2"
      >
        <span v-if="index > 0" aria-hidden="true" class="inline-flex shrink-0 text-content-subtle">
          <slot name="separator">
            <ChevronRight class="size-4 rtl:rotate-180" focusable="false" />
          </slot>
        </span>
        <component
          :is="index < items.length - 1 && item.href !== undefined ? linkAs : 'span'"
          v-bind="index < items.length - 1 && item.href !== undefined ? item.linkProps : undefined"
          :href="index < items.length - 1 ? item.href : undefined"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
          class="inline-flex min-w-0 items-center gap-1.5 rounded-sm"
          :class="index === items.length - 1
            ? 'font-medium text-content'
            : item.href !== undefined
              ? 'text-content-muted no-underline hover:text-primary-content hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'
              : 'text-content-muted'"
        >
          <slot name="item" :item="item" :index="index" :current="index === items.length - 1">
            <component :is="item.icon" v-if="item.icon" aria-hidden="true" focusable="false" class="size-4 shrink-0" />
            <span class="min-w-0 break-words [overflow-wrap:anywhere]">{{ item.label }}</span>
          </slot>
        </component>
      </li>
    </ol>
  </nav>
</template>

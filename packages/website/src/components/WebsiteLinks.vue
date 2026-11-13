<script setup lang="ts">
import type { Component } from 'vue'
import type { SWebsiteNavItem } from '../website.types'

withDefaults(defineProps<{ items: readonly SWebsiteNavItem[]; current?: string; linkAs?: 'a' | Component }>(), { linkAs: 'a' })
const emit = defineEmits<{ select: [item: SWebsiteNavItem, event: MouseEvent] }>()
</script>

<template>
  <ul class="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
    <li v-for="item in items" :key="item.id" class="min-w-0">
      <component :is="linkAs" v-bind="item.linkProps" :href="item.href" :target="item.target" :rel="item.rel" :aria-current="item.id === current ? 'page' : undefined" class="block rounded-md py-2 text-sm font-medium wrap-anywhere no-underline hover:text-primary-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus" :class="item.id === current ? 'text-primary-content' : 'text-content-muted'" @click="emit('select', item, $event)">{{ item.label }}</component>
    </li>
  </ul>
</template>

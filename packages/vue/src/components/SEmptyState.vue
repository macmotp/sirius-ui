<script setup lang="ts">
import { computed } from 'vue'
import { Inbox } from '@lucide/vue'
import type { SEmptyStateProps } from './SEmptyState.types'

const props = withDefaults(defineProps<SEmptyStateProps>(), { title: 'Nothing here yet', headingLevel: 3, icon: undefined })
defineSlots<{ icon?(): unknown; title?(): unknown; description?(): unknown; default?(): unknown; actions?(): unknown }>()
const iconComponent = computed(() => props.icon === false ? undefined : props.icon ?? Inbox)
</script>

<template>
  <div class="flex min-w-0 flex-col items-center px-6 py-8 text-center font-sans text-content sm:px-10 sm:py-10">
    <div v-if="icon !== false" aria-hidden="true" class="mb-4 inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary-content [&>svg]:size-6"><slot name="icon"><component :is="iconComponent" focusable="false" /></slot></div>
    <component :is="`h${headingLevel}`" v-if="title || $slots.title" class="m-0 max-w-full break-words text-lg font-semibold leading-7"><slot name="title">{{ title }}</slot></component>
    <div v-if="description || $slots.description" class="mt-2 max-w-md break-words text-sm leading-6 text-content-muted"><slot name="description">{{ description }}</slot></div>
    <div v-if="$slots.default" class="mt-4 max-w-full break-words text-sm leading-6"><slot /></div>
    <div v-if="$slots.actions" class="mt-6 flex max-w-full flex-wrap items-center justify-center gap-3"><slot name="actions" /></div>
  </div>
</template>

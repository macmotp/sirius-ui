<script setup lang="ts">
import { SBreadcrumbs } from '@sirius-ui/vue'
import type { SDashboardPageHeaderProps } from './SDashboardPageHeader.types'

withDefaults(defineProps<SDashboardPageHeaderProps>(), { breadcrumbs: () => [], breadcrumbLabel: 'Breadcrumb', breadcrumbLinkAs: 'a' })
defineSlots<{ title?(): unknown; description?(): unknown; breadcrumbs?(): unknown; actions?(): unknown }>()
</script>

<template>
  <header class="min-w-0 font-sans text-content">
    <div v-if="breadcrumbs.length || $slots.breadcrumbs" class="mb-4 min-w-0"><slot name="breadcrumbs"><SBreadcrumbs :items="breadcrumbs" :label="breadcrumbLabel" :link-as="breadcrumbLinkAs" /></slot></div>
    <div class="flex min-w-0 flex-wrap items-start justify-between gap-4">
      <div class="min-w-0 flex-1 basis-64">
        <p v-if="eyebrow" class="m-0 mb-2 break-words text-xs font-medium tracking-widest text-primary-content uppercase">{{ eyebrow }}</p>
        <h1 class="m-0 max-w-2xl break-words text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-3xl"><slot name="title">{{ title }}</slot></h1>
        <div v-if="description || $slots.description" class="mt-3 max-w-xl text-sm leading-relaxed text-content-muted"><slot name="description">{{ description }}</slot></div>
      </div>
      <div v-if="$slots.actions" class="flex max-w-full min-w-0 flex-wrap items-center gap-3"><slot name="actions" /></div>
    </div>
  </header>
</template>

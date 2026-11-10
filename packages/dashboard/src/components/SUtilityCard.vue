<script setup lang="ts">
import { SCard } from '@sirius-ui/vue'
import type { SUtilityCardProps, SUtilityCardRow } from './SUtilityCard.types'

defineProps<SUtilityCardProps>()
defineSlots<{
  identity?(): unknown
  actions?(): unknown
  value?(props: { row: SUtilityCardRow }): unknown
}>()
</script>

<template>
  <SCard>
    <template #header>
      <div class="-mx-6 -mt-6 flex items-center gap-3 rounded-t-2xl border-b border-line bg-surface-muted px-6 py-4">
        <div v-if="$slots.identity" class="shrink-0"><slot name="identity" /></div>
        <p class="m-0 min-w-0 flex-1 text-sm font-semibold text-content wrap-anywhere">{{ title }}</p>
        <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
      </div>
    </template>
    <dl class="m-0 divide-y divide-line text-sm">
      <div v-for="row in rows" :key="row.id" class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
        <dt class="min-w-0 text-content-muted wrap-anywhere">{{ row.label }}</dt>
        <dd class="m-0 ms-auto flex min-w-0 flex-wrap items-center justify-end gap-2 text-end font-medium text-content wrap-anywhere">
          <slot name="value" :row="row">{{ row.value }}</slot>
        </dd>
      </div>
    </dl>
  </SCard>
</template>

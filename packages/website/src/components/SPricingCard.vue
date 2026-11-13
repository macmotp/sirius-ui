<script setup lang="ts">
import { useId } from 'vue'
import { SBadge, SIcon } from '@sirius-ui/vue'
import type { SPricingCardProps } from '../website.types'

withDefaults(defineProps<SPricingCardProps>(), { headingLevel: 3 })
defineSlots<{ actions?(): unknown }>()
const id = useId()
</script>

<template>
  <article :aria-labelledby="id" class="flex h-full min-w-0 flex-col rounded-2xl border p-6 sm:p-8" :class="highlighted ? 'border-primary bg-primary-soft' : 'border-line bg-surface'">
    <div class="flex flex-wrap items-center justify-between gap-3"><component :is="`h${headingLevel}`" :id="id" class="m-0 text-lg font-semibold text-content">{{ title }}</component><SBadge v-if="badge" size="sm">{{ badge }}</SBadge></div>
    <p v-if="description" class="mt-3 mb-0 text-sm leading-6 text-content-muted">{{ description }}</p>
    <p class="mt-8 mb-0 text-content"><span class="text-4xl font-semibold tracking-tight wrap-anywhere">{{ price }}</span><span v-if="period" class="ms-1 text-sm text-content-muted">{{ period }}</span></p>
    <p v-if="billingNote" class="mt-2 mb-0 text-xs leading-5 text-content-muted">{{ billingNote }}</p>
    <ul class="mt-8 mb-0 flex-1 list-none space-y-4 p-0"><li v-for="(feature, index) in features" :key="index" class="flex items-start gap-3 text-sm leading-6 text-content"><SIcon name="check" class="mt-1 size-4 shrink-0 text-primary-content" /><span>{{ feature }}</span></li></ul>
    <div v-if="$slots.actions" class="mt-8"><slot name="actions" /></div>
  </article>
</template>

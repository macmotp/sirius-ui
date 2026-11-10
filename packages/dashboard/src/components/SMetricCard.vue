<script setup lang="ts">
import { SBadge, SCard, SSkeleton } from '@sirius-ui/vue'
import type { SMetricCardProps } from './SMetricCard.types'

withDefaults(defineProps<SMetricCardProps>(), {
  loading: false,
  loadingLabel: 'Loading metric',
})
defineSlots<{ icon?(): unknown; chart?(): unknown }>()
</script>

<template>
  <SCard
    :aria-busy="loading || undefined"
    :style="color ? { backgroundColor: `var(--sirius-${color}-soft)` } : undefined"
  >
    <dl class="m-0">
      <dt class="flex items-center justify-between gap-3 text-sm font-medium text-content-muted">
        <span class="min-w-0 wrap-anywhere">{{ label }}</span>
        <span v-if="$slots.icon" aria-hidden="true" class="inline-flex size-5 shrink-0 items-center justify-center text-content-subtle [&>svg]:size-full">
          <slot name="icon" />
        </span>
      </dt>
      <dd class="m-0 mt-4 space-y-2">
        <div v-if="loading" class="flex min-h-10 items-center">
          <SSkeleton width="min(6rem, 100%)" :height="28" />
          <span class="sr-only">{{ loadingLabel }}</span>
        </div>
        <p v-else class="m-0 text-4xl font-semibold tracking-tight tabular-nums wrap-anywhere">{{ value ?? '—' }}</p>
        <div v-if="comparison" class="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
          <SSkeleton v-if="loading" width="min(4rem, 100%)" :height="16" />
          <template v-else>
            <SBadge size="sm" :color="comparison.color" class="wrap-anywhere">{{ comparison.value }}</SBadge>
            <span v-if="comparison.label" class="min-w-0 text-xs text-content-muted wrap-anywhere">{{ comparison.label }}</span>
          </template>
        </div>
        <p v-if="detail" class="m-0 text-xs leading-relaxed text-content-muted wrap-anywhere">{{ detail }}</p>
      </dd>
    </dl>
    <div v-if="$slots.chart" class="mt-4" :style="{ color: `var(--sirius-${color ?? 'primary'}-content)` }">
      <SSkeleton v-if="loading" shape="rounded" :height="44" />
      <slot v-else name="chart" />
    </div>
  </SCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SButton, SDateRange, SField, SForm, SInput, SSelect } from '@sirius-ui/vue'
import type { SDateRangePreset } from '@sirius-ui/vue'
import { Search } from '../../../../shared/icons'
import { filterError, statusOptions } from '../../data/orders'
import type { OrderFilters } from '../../data/orders'
const filters = defineModel<OrderFilters>({ required: true })
defineProps<{ loading: boolean; disabled: boolean }>()
const emit = defineEmits<{ apply: [filters: OrderFilters]; clear: [] }>()
// Relative to the final day in the fictional orders dataset.
const presets: readonly SDateRangePreset[] = [
  { id: 'week', label: 'Last 7 days', range: { from: '2026-10-31', to: '2026-11-06' } },
  { id: 'month', label: 'This month', range: { from: '2026-11-01', to: '2026-11-06' } },
]
const dates = computed({
  get: () => ({ from: filters.value.from, to: filters.value.to }),
  set: range => { filters.value = { ...filters.value, ...range } },
})
const hasFilters = computed(() => Object.values(filters.value).some(Boolean))
function update(key: 'q' | 'status', value: string) {
  filters.value = { ...filters.value, [key]: value }
}
function apply() {
  if (!filterError(filters.value)) emit('apply', { ...filters.value })
}

</script>

<template>
  <SForm aria-label="Filter orders" class="gap-4" @submit.prevent="apply">
    <div class="grid items-end gap-5">
      <SField v-slot="{ control }" label="Search orders"><SInput v-bind="control" :model-value="filters.q" name="orderSearch" type="search" placeholder="Order number or customer…" autocomplete="off" :disabled="disabled" @update:model-value="update('q', $event)"><template #leading><Search /></template></SInput></SField>
      <SField v-slot="{ control }" label="Status"><SSelect v-bind="control" :model-value="filters.status || 'all'" :options="statusOptions" :disabled="disabled" @update:model-value="update('status', $event === 'all' ? '' : $event)" /></SField>
      <SDateRange v-model="dates" :presets="presets" :disabled="disabled" />
      <SButton type="submit" :loading="loading" :disabled="disabled" size="sm" class="min-h-9">Apply filters</SButton>
    </div>
    <template v-if="hasFilters" #actions><SButton size="sm" variant="ghost" :disabled="disabled || loading" @click="emit('clear')">Clear filters</SButton></template>
  </SForm>
</template>

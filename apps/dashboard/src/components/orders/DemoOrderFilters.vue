<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SButton, SField, SForm, SInput, SSelect } from '@sirius-ui/vue'
import { Search } from '../../../../shared/icons'
import { filterError, statusOptions } from '../../data/orders'
import type { OrderFilters } from '../../data/orders'
const filters = defineModel<OrderFilters>({ required: true })
defineProps<{ loading: boolean; disabled: boolean }>()
const emit = defineEmits<{ apply: [filters: OrderFilters]; clear: [] }>()
const error = shallowRef('')
const hasFilters = computed(() => Object.values(filters.value).some(Boolean))
function update(key: keyof OrderFilters, value: string) { filters.value = { ...filters.value, [key]: value }; error.value = '' }
function apply() { error.value = filterError(filters.value); if (!error.value) emit('apply', { ...filters.value }) }
function clear() { error.value = ''; emit('clear') }
</script>

<template>
  <SForm aria-label="Filter orders" class="gap-4" novalidate @submit.prevent="apply">
    <div class="grid items-end gap-5">
      <SField v-slot="{ control }" label="Search orders"><SInput v-bind="control" :model-value="filters.q" name="orderSearch" type="search" placeholder="Order number or customer…" autocomplete="off" :disabled="disabled" @update:model-value="update('q', $event)"><template #leading><Search /></template></SInput></SField>
      <SField v-slot="{ control }" label="Status"><SSelect v-bind="control" :model-value="filters.status || 'all'" :options="statusOptions" :disabled="disabled" @update:model-value="update('status', $event === 'all' ? '' : $event)" /></SField>
      <SField v-slot="{ control }" label="From date" :error="error || undefined"><SInput v-bind="control" :model-value="filters.from" type="date" :max="filters.to || undefined" :disabled="disabled" @update:model-value="update('from', $event)" /></SField>
      <SField v-slot="{ control }" label="To date"><SInput v-bind="control" :model-value="filters.to" type="date" :min="filters.from || undefined" :disabled="disabled" :invalid="Boolean(error)" @update:model-value="update('to', $event)" /></SField>
      <SButton type="submit" :loading="loading" :disabled="disabled" size="sm" class="min-h-9">Apply filters</SButton>
    </div>
    <template v-if="hasFilters" #actions><SButton size="sm" variant="ghost" :disabled="disabled || loading" @click="clear">Clear filters</SButton></template>
  </SForm>
</template>

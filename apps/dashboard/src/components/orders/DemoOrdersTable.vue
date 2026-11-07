<script setup lang="ts">
import { computed } from 'vue'
import { SAvatar, SBadge, SButton, SCheckbox, SEmptyState, SSkeleton, STable } from '@sirius-ui/vue'
import type { STableColumn, STableSort } from '@sirius-ui/vue'
import DemoOrderActions from './DemoOrderActions.vue'
import { orderDate, orderMoney, orderQuantity, statusColors, statusLabels } from '../../data/orders'
import type { Order } from '../../data/orders'
const props = defineProps<{ rows: readonly Order[]; loading: boolean; sort: STableSort; selected: readonly number[] }>()
const emit = defineEmits<{ sort: [value: STableSort]; select: [id: number, checked: boolean]; selectPage: [checked: boolean]; view: [order: Order]; fulfill: [ids: number[]]; clear: [] }>()
const columns: STableColumn<Order>[] = [
  { key: 'selection', label: 'Selection', align: 'center' },
  { key: 'id', label: 'Order', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'created_at', label: 'Placed', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'quantity', label: 'Items', align: 'end' },
  { key: 'total', label: 'Total', sortable: true, align: 'end' },
  { key: 'actions', label: 'Actions', align: 'end' },
]
const all = computed(() => props.rows.length > 0 && props.rows.every(row => props.selected.includes(row.id)))
const partial = computed(() => props.selected.length > 0 && !all.value)
</script>

<template>
  <STable :rows="rows" :columns="columns" row-key="id" caption="Customer orders" :loading="loading" :sort="sort" @sort="emit('sort', $event)">
    <template #header="{ column }"><SCheckbox v-if="column.key === 'selection'" :model-value="all" :indeterminate="partial" :disabled="loading || !rows.length" aria-label="Select all orders on this page" @update:model-value="emit('selectPage', $event)" /><span v-else-if="column.key === 'actions'" class="sr-only">Actions</span><span v-else>{{ column.label }}</span></template>
    <template #cell="{ row, column }">
      <SCheckbox v-if="column.key === 'selection'" :model-value="selected.includes(row.id)" :disabled="loading" :aria-label="`Select order #${row.id}`" @update:model-value="emit('select', row.id, $event)" />
      <SButton v-else-if="column.key === 'id'" variant="ghost" size="sm" :disabled="loading" :aria-label="`View order #${row.id}`" @click="emit('view', row)">#{{ row.id }}</SButton>
      <div v-else-if="column.key === 'customer'" class="flex min-w-48 items-center gap-3"><SAvatar :name="row.customer" size="sm" aria-hidden="true" /><div><p class="whitespace-nowrap font-medium">{{ row.customer }}</p><p class="text-xs text-content-muted">{{ row.email }}</p></div></div>
      <span v-else-if="column.key === 'created_at'" class="whitespace-nowrap text-content-muted">{{ orderDate(row.created_at) }}</span>
      <SBadge v-else-if="column.key === 'status'" :color="statusColors[row.status]" size="sm">{{ statusLabels[row.status] }}</SBadge>
      <span v-else-if="column.key === 'quantity'" class="tabular-nums text-content-muted">{{ orderQuantity(row) }}</span>
      <span v-else-if="column.key === 'total'" class="whitespace-nowrap font-medium tabular-nums">{{ orderMoney(row.total) }}</span>
      <DemoOrderActions v-else :order="row" :disabled="loading" @view="emit('view', $event)" @fulfill="emit('fulfill', $event)" />
    </template>
    <template #loading><div role="status" class="space-y-4"><span>Loading orders…</span><SSkeleton v-for="index in 3" :key="index" class="h-10 w-full" /></div></template>
    <template #empty><SEmptyState :heading-level="2" title="No orders found" description="Try a different search or widen the date range."><template #actions><SButton size="sm" variant="outline" @click="emit('clear')">Clear filters</SButton></template></SEmptyState></template>
  </STable>
</template>

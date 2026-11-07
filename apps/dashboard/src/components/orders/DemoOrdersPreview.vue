<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SAlert, SBadge, SButton, SCard, SPagination, STable } from '@sirius-ui/vue'
import type { STableColumn } from '@sirius-ui/vue'
import { ArrowUpRight } from '../../../../shared/icons'
import { useDemoOrders } from '../../composables/useDemoOrders'
import { orderMoney, statusColors, statusLabels } from '../../data/orders'
import type { Order, OrdersApi } from '../../data/orders'
import DemoOrderDetails from './DemoOrderDetails.vue'
const props = defineProps<{ api: OrdersApi }>()
const emit = defineEmits<{ browse: [] }>()
const { page, busy, query, error, navigate, reload, sort } = useDemoOrders(props.api, { per_page: 5 })
const tableSort = computed(() => ({ key: query.value.sort, direction: query.value.direction }))
const selectedOrder = shallowRef<Order>()
const open = shallowRef(false)
const columns: STableColumn<Order>[] = [
  { key: 'id', label: 'Order' }, { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' }, { key: 'total', label: 'Total', sortable: true, align: 'end' },
]
function view(order: Order) { selectedOrder.value = order; open.value = true }
</script>

<template>
  <SCard class="mt-6">
    <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Recent orders</h2><SButton size="sm" variant="ghost" @click="emit('browse')">Open Tables<template #trailing><ArrowUpRight /></template></SButton></div></template>
    <SAlert v-if="error" color="danger" title="Orders unavailable">{{ error }}<template #actions><SButton size="sm" variant="outline" @click="reload">Try again</SButton></template></SAlert>
    <STable v-else :rows="page?.data ?? []" :columns="columns" row-key="id" caption="Recent orders preview" :loading="busy" :sort="tableSort" @sort="sort">
      <template #cell="{ row, column }"><SButton v-if="column.key === 'id'" variant="ghost" size="sm" :disabled="busy" :aria-label="`Preview order #${row.id}`" @click="view(row)">#{{ row.id }}</SButton><span v-else-if="column.key === 'customer'" class="whitespace-nowrap">{{ row.customer }}</span><SBadge v-else-if="column.key === 'status'" :color="statusColors[row.status]" size="sm">{{ statusLabels[row.status] }}</SBadge><span v-else class="whitespace-nowrap tabular-nums">{{ orderMoney(row.total) }}</span></template>
    </STable>
    <template #footer><SPagination v-if="page && !error" :pagination="page" :loading="busy" mode="event" label="Recent orders pagination" @navigate="navigate" /></template>
  </SCard>
  <DemoOrderDetails v-model:open="open" :order="selectedOrder" />
</template>

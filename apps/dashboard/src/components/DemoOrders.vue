<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useId, useTemplateRef } from 'vue'
import { SAlert, SBadge, SButton, SDialog, SDrawer, SDropdown, SPagination, SSelect } from '@sirius-ui/vue'
import type { SDropdownItem } from '@sirius-ui/vue'
import { Check, Download, Package, Settings2 } from '../../../shared/icons'
import { useDemoOrders } from '../composables/useDemoOrders'
import { useOrderSelection } from '../composables/useOrderSelection'
import { downloadOrdersCsv, emptyOrderFilters, orderMoney, pageSizeOptions, statusLabels } from '../data/orders'
import type { Order, OrdersApi } from '../data/orders'
import DemoOrderFilters from './orders/DemoOrderFilters.vue'
import DemoOrdersTable from './orders/DemoOrdersTable.vue'
import DemoOrderDetails from './orders/DemoOrderDetails.vue'

const props = defineProps<{ api: OrdersApi }>()
const emit = defineEmits<{ notice: [title: string, description: string]; simulateError: [] }>()
const { query, page, loading, busy, error, mutationError, reload, applyFilters, sort, navigate, pageSize, fulfill, clearMutationError } = useDemoOrders(props.api)
const rows = computed(() => page.value?.data ?? [])
const selection = useOrderSelection(() => rows.value, () => busy.value)
const { selected, selectedRows, fulfillable } = selection
const filters = ref(emptyOrderFilters())
const filtersOpen = shallowRef(false)
const filterDrawerId = useId()
const root = useTemplateRef<HTMLDivElement>('root')
const resultStatus = useTemplateRef<HTMLParagraphElement>('resultStatus')
const details = shallowRef<Order>()
const detailsOpen = shallowRef(false)
const confirmation = shallowRef(false)
const pendingIds = shallowRef<number[]>([])
let focusResultsAfterClose = false
const tableSort = computed(() => ({ key: query.value.sort, direction: query.value.direction }))
const bulkActions = computed<SDropdownItem[]>(() => [
  { id: 'fulfill', label: `Mark ${fulfillable.value.length} as fulfilled`, icon: Check, disabled: !fulfillable.value.length },
  { id: 'export', label: 'Export selected orders', icon: Download },
])
const pageActions = computed<SDropdownItem[]>(() => [
  { id: 'export-page', label: 'Export current page', icon: Download, disabled: !rows.value.length || Boolean(error.value) },
  { id: 'export-selected', label: 'Export selected orders', icon: Download, disabled: !selectedRows.value.length || Boolean(error.value) },
  { id: 'refresh', label: 'Refresh table' },
])
const activeFilters = computed(() => [
  query.value.q ? `Search: ${query.value.q}` : '',
  query.value.status ? statusLabels[query.value.status as keyof typeof statusLabels] : '',
  query.value.from ? `From ${query.value.from}` : '',
  query.value.to ? `To ${query.value.to}` : '',
].filter(Boolean))
function openFilters() {
  const { q, status, from, to } = query.value
  filters.value = { q, status, from, to }
  filtersOpen.value = true
}
async function applyFromDrawer(value: typeof filters.value) {
  if (await applyFilters(value)) filtersOpen.value = false
}
async function choosePageAction(item: SDropdownItem) {
  await nextTick()
  if (item.id === 'export-page') exportRows(rows.value)
  else if (item.id === 'export-selected') exportRows(selectedRows.value)
  else void reload()
}
function view(order: Order) { details.value = order; detailsOpen.value = true }
function requestFulfillment(ids: number[]) { clearMutationError(); pendingIds.value = [...ids]; confirmation.value = true }
async function chooseBulk(item: SDropdownItem) {
  await nextTick() // Let the action menu close before opening a modal.
  if (item.id === 'fulfill') requestFulfillment(fulfillable.value)
  else exportRows(selectedRows.value)
}
function exportRows(value: readonly Order[]) {
  if (busy.value || !value.length) return
  downloadOrdersCsv(value)
  emit('notice', 'Export ready', `Downloaded ${value.length} order${value.length === 1 ? '' : 's'} as CSV.`)
}
async function confirmFulfillment() {
  const count = pendingIds.value.length
  if (await fulfill(pendingIds.value)) {
    focusResultsAfterClose = true
    confirmation.value = false
    emit('notice', 'Orders updated', `${count} order${count === 1 ? '' : 's'} marked as fulfilled in this demo.`)
  }
}
async function afterConfirmationClose() {
  if (!focusResultsAfterClose) return
  focusResultsAfterClose = false
  await nextTick()
  resultStatus.value?.focus()
}
async function clearSelection() {
  selection.clear()
  await nextTick()
  root.value?.querySelector<HTMLInputElement>('thead input')?.focus()
}
async function clearFilters() { filters.value = emptyOrderFilters(); if (await applyFilters(filters.value)) filtersOpen.value = false }
function simulateError() { emit('simulateError'); void reload() }
</script>

<template>
  <div ref="root" class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="space-y-1"><p ref="resultStatus" role="status" tabindex="-1" class="text-sm font-medium outline-none">{{ loading ? 'Loading orders…' : error ? 'Orders unavailable' : `${page?.total ?? 0} orders` }}<span v-if="selected.length" class="ml-2 text-primary-content">· {{ selected.length }} selected on this page</span></p><p v-if="page && !error" class="text-xs text-content-muted">{{ page.summary.processing }} processing · {{ orderMoney(page.summary.sales) }} SGD across matching orders</p></div>
      <div class="flex items-center gap-2"><SButton size="sm" variant="outline" :disabled="busy" aria-haspopup="dialog" :aria-expanded="filtersOpen" :aria-controls="filterDrawerId" @click="openFilters"><template #leading><Settings2 /></template>Filters<span v-if="activeFilters.length" class="ml-1 text-xs">({{ activeFilters.length }})</span></SButton><SDropdown label="Actions" :items="pageActions" :disabled="busy" size="sm" variant="outline" @select="choosePageAction" /></div>
    </div>
    <div v-if="activeFilters.length" class="flex flex-wrap items-center gap-2"><SBadge v-for="filter in activeFilters" :key="filter" size="sm">{{ filter }}</SBadge><SButton size="sm" variant="ghost" :disabled="busy" @click="clearFilters">Clear filters</SButton></div>
    <div v-if="selected.length && !error" class="flex flex-wrap items-center gap-3 rounded-2xl bg-primary-soft p-4 text-sm text-primary-content">
      <SBadge>{{ selected.length }} selected</SBadge>
      <SDropdown label="Bulk actions" :items="bulkActions" :disabled="busy" size="sm" variant="outline" align="start" @select="chooseBulk" />
      <SButton size="sm" variant="ghost" :disabled="busy" @click="clearSelection">Clear selection</SButton>
      <span class="text-xs">This page only</span>
    </div>
    <SAlert v-if="error" color="danger" title="We couldn’t load your orders" role="alert">{{ error }}<template #actions><SButton size="sm" variant="outline" @click="reload">Try again</SButton></template></SAlert>
    <template v-else>
      <DemoOrdersTable :rows="rows" :loading="busy" :sort="tableSort" :selected="selected" @sort="sort" @select="selection.toggle" @select-page="selection.all" @view="view" @fulfill="requestFulfillment" @clear="clearFilters" />
      <div v-if="page" class="space-y-4">
        <SPagination :pagination="page" mode="event" :loading="busy" label="Orders pagination" @navigate="navigate" />
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs text-content-subtle"><p>Totals reflect all matching orders. Dates use UTC.</p><div class="flex items-center gap-2"><label for="orders-page-size">Rows per page</label><SSelect id="orders-page-size" :model-value="String(query.per_page)" :options="pageSizeOptions" :disabled="busy" size="sm" class="w-20" @update:model-value="pageSize" /></div></div>
      </div>
    </template>
    <details class="text-xs text-content-subtle"><summary class="w-fit cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-focus">Demo controls</summary><div class="mt-3 flex flex-wrap items-center gap-3"><SButton size="sm" variant="ghost" :disabled="busy" @click="simulateError">Simulate request error</SButton><span>Local fixtures · Changes reset when the demo reloads.</span></div></details>
    <SDrawer :id="filterDrawerId" v-model:open="filtersOpen" title="Filter orders" description="Choose the orders you want to see." side="right" size="sm">
      <SAlert v-if="error" color="danger" class="mb-5">{{ error }}</SAlert>
      <DemoOrderFilters v-model="filters" :loading="loading" :disabled="busy" @apply="applyFromDrawer" @clear="clearFilters" />
    </SDrawer>
    <DemoOrderDetails v-model:open="detailsOpen" :order="details" />
    <SDialog v-model:open="confirmation" title="Mark orders as fulfilled?" :close-on-escape="!busy" :close-on-backdrop="!busy" :show-close="!busy" @close="afterConfirmationClose">
      <div class="flex items-start gap-3"><span aria-hidden="true" class="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary-content"><Package class="size-5" /></span><p class="text-sm leading-relaxed text-content-muted">{{ pendingIds.length }} processing order{{ pendingIds.length === 1 ? '' : 's' }} will be marked as fulfilled. This updates the local demo records.</p></div>
      <SAlert v-if="mutationError" color="danger" role="alert" class="mt-4">{{ mutationError }}</SAlert>
      <template #footer><div class="flex flex-wrap justify-end gap-2"><SButton variant="ghost" :disabled="busy" @click="confirmation = false">Cancel</SButton><SButton :loading="busy" @click="confirmFulfillment">Mark as fulfilled</SButton></div></template>
    </SDialog>
  </div>
</template>

<script setup lang="ts">
import { SAvatar, SBadge, SButton, SDrawer } from '@sirius-ui/vue'
import { orderDate, orderMoney, statusColors, statusLabels } from '../../data/orders'
import type { Order } from '../../data/orders'
defineProps<{ order?: Order }>()
const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <SDrawer v-model:open="open" :title="order ? `Order #${order.id}` : 'Order details'" side="right" size="md">
    <div v-if="order" class="space-y-7">
      <div class="flex items-center justify-between gap-3"><p class="text-sm text-content-muted">Placed {{ orderDate(order.created_at) }}</p><SBadge :color="statusColors[order.status]">{{ statusLabels[order.status] }}</SBadge></div>
      <section aria-label="Customer" class="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-inset ring-line"><SAvatar :name="order.customer" aria-hidden="true" /><div class="min-w-0"><p class="font-medium">{{ order.customer }}</p><p class="mt-1 break-all text-sm text-content-muted">{{ order.email }}</p></div></section>
      <section aria-label="Order items"><h3 class="text-sm font-semibold">Items</h3><ul class="mt-3 divide-y divide-line"><li v-for="item in order.items" :key="item.name" class="flex items-start justify-between gap-4 py-4"><div><p class="text-sm font-medium">{{ item.name }}</p><p class="mt-1 text-xs text-content-muted">{{ item.quantity }} × {{ orderMoney(item.price) }}</p></div><span class="whitespace-nowrap text-sm tabular-nums">{{ orderMoney(item.quantity * item.price) }}</span></li></ul><dl class="flex justify-between gap-3 border-t border-line pt-5 font-semibold"><dt>Total <span class="text-xs font-normal text-content-muted">SGD</span></dt><dd>{{ orderMoney(order.total) }}</dd></dl></section>
      <p class="text-xs leading-relaxed text-content-subtle">Example order. No live customer or payment data.</p>
    </div>
    <template #footer><SButton variant="outline" size="sm" @click="open = false">Close order</SButton></template>
  </SDrawer>
</template>

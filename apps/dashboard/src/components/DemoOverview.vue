<script setup lang="ts">
import { ArrowUpRight, Check, Package, Users } from '../../../shared/icons'
import { SMetricCard } from '@sirius-ui/dashboard'
import { SBadge, SButton, SCard, SGrid } from '@sirius-ui/vue'
import DemoLineChartCard from './DemoLineChartCard.vue'
import DemoOrdersPreview from './orders/DemoOrdersPreview.vue'
import type { OrdersApi } from '../data/orders'
defineProps<{ api: OrdersApi }>()
const emit = defineEmits<{ activity: []; tables: []; charts: [] }>()
const metrics = [
  { label: 'Orders this week', value: '128', detail: 'Across your online store', icon: Package },
  { label: 'Ready to dispatch', value: '18', detail: 'Packed and ready to go', icon: Check },
  { label: 'Returning customers', value: '42', detail: 'A familiar face at the door', icon: Users },
]
const tasks = [
  { title: 'Dispatch this morning’s orders', detail: '18 packages · Labels prepared', status: 'Ready' },
  { title: 'Review the spring collection', detail: 'Six products · Drafts saved', status: 'Review' },
  { title: 'Reply to a customer enquiry', detail: 'Delivery question · Received today', status: 'Pending' },
]
</script>

<template>
  <SGrid :columns="3">
    <SMetricCard v-for="metric in metrics" :key="metric.label" :label="metric.label" :value="metric.value" :detail="metric.detail">
      <template #icon><component :is="metric.icon" /></template>
    </SMetricCard>
  </SGrid>
  <DemoLineChartCard class="mt-6" preview @browse="emit('charts')" />
  <DemoOrdersPreview :api="api" @browse="emit('tables')" />
  <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
    <SCard bento="bottom-left">
      <template #header><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="font-semibold">A little attention, a lot of progress</h2><p class="mt-1 text-xs text-content-muted">Three things to keep the day moving.</p></div><SBadge>Today</SBadge></div></template>
      <ul class="divide-y divide-line"><li v-for="(task, index) in tasks" :key="task.title" class="flex min-w-0 items-start gap-4 py-5 first:pt-0 last:pb-0"><span aria-hidden="true" class="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-content">0{{ index + 1 }}</span><div class="min-w-0 flex-1"><h3 class="break-words text-sm font-medium">{{ task.title }}</h3><p class="mt-1 break-words text-xs leading-relaxed text-content-muted">{{ task.detail }}</p></div><SBadge size="sm" :color="task.status === 'Ready' ? 'success' : 'primary'">{{ task.status }}</SBadge></li></ul>
      <template #footer><SButton variant="ghost" size="sm" @click="emit('activity')">View activity<template #trailing><ArrowUpRight /></template></SButton></template>
    </SCard>
    <SCard bento="top-right">
      <template #header><h2 class="font-semibold">Make room for what matters</h2></template>
      <p class="text-sm leading-relaxed text-content-muted">A calm place to manage your business, look after customers, and prepare for what comes next.</p>
      <div class="mt-6 rounded-2xl bg-primary-soft p-5"><p class="text-xs font-semibold tracking-widest text-primary-content uppercase">Acme workspace</p><p class="mt-3 text-sm leading-relaxed text-primary-content">Stay on top of orders, customer enquiries, and the work that keeps your business moving.</p></div>
      <p class="mt-5 text-xs leading-relaxed text-content-subtle">All numbers and tasks are local demo fixtures.</p>
    </SCard>
  </div>
</template>

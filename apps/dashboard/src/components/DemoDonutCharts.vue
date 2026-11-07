<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'
import { SDonutChart } from '@sirius-ui/charts'
import type { SDonutChartItem } from '@sirius-ui/charts'
import { SCard, SGrid, SSelect } from '@sirius-ui/vue'
import { chartColors, chartColorOptions, salesMoney } from '../data/chartExamples'
import type { ChartColor } from '../data/chartExamples'

const thickness = shallowRef('regular')
const thicknessOptions = [{ value: 'regular', label: 'Regular ring' }, { value: 'thin', label: 'Thin ring' }, { value: 'thick', label: 'Thick ring' }]
const innerRadius = computed(() => thickness.value === 'thin' ? .8 : thickness.value === 'thick' ? .45 : .65)
const channels = reactive<{ id: string; label: string; color: ChartColor; value: number }[]>([
  { id: 'online', label: 'Online', color: 'theme', value: 3120 },
  { id: 'store', label: 'In store', color: 'indigo', value: 2260 },
  { id: 'partners', label: 'Partners', color: 'orange', value: 840 },
])
const sales = computed<readonly SDonutChartItem[]>(() => channels.map(item => ({ ...item, color: chartColors[item.color] })))
const state = shallowRef('ready')
const states = [{ value: 'ready', label: 'With data' }, { value: 'single', label: 'Single slice' }, { value: 'empty', label: 'All zero' }, { value: 'loading', label: 'Loading' }, { value: 'error', label: 'Error' }]
const orders: readonly SDonutChartItem[] = [
  { id: 'completed', label: 'Completed', value: 160, color: 'var(--sirius-success-content)' },
  { id: 'processing', label: 'Processing', value: 40, color: 'var(--sirius-primary-content)' },
  { id: 'refunded', label: 'Refunded', value: 20, color: 'var(--sirius-warning-content)' },
  { id: 'cancelled', label: 'Cancelled', value: 10, color: 'var(--sirius-danger-content)' },
]
const orderData = computed(() => state.value === 'single' ? orders.slice(0, 1) : state.value === 'empty' ? orders.map(item => ({ ...item, value: 0 })) : orders)
</script>

<template>
  <SGrid :columns="2">
    <SCard class="acme-chart-comparison">
      <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Sales by channel</h2><SSelect v-model="thickness" :options="thicknessOptions" size="sm" aria-label="Donut ring thickness" class="w-36" /></div></template>
      <SDonutChart title="Sales share by channel" :data="sales" :inner-radius="innerRadius" :value-formatter="salesMoney" total-label="Total sales" value-label="Sales" />
      <template #footer><div class="grid gap-3 sm:grid-cols-3"><label v-for="item in channels" :key="item.id" class="min-w-0 space-y-2"><span class="flex items-center gap-2 text-xs font-medium"><span aria-hidden="true" class="size-2.5 rounded-full" :style="{ backgroundColor: chartColors[item.color] }"></span>{{ item.label }}</span><SSelect v-model="item.color" :options="chartColorOptions" size="sm" :aria-label="`${item.label} donut color`" /></label></div></template>
    </SCard>
    <SCard>
      <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Order status mix</h2><SSelect v-model="state" :options="states" size="sm" aria-label="Donut request state" class="w-36" /></div></template>
      <SDonutChart title="Orders by status" :data="orderData" total-label="Orders" value-label="Orders" :loading="state === 'loading'" :error="state === 'error' ? 'We couldn’t load the order mix. Please try again.' : undefined" />
      <template #footer><p class="text-xs text-content-subtle">Illustrative counts · Try a single slice or an all-zero response.</p></template>
    </SCard>
  </SGrid>
</template>

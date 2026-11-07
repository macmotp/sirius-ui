<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'
import { SBarChart } from '@sirius-ui/charts'
import type { SBarChartSeries } from '@sirius-ui/charts'
import { SCard, SGrid, SSelect } from '@sirius-ui/vue'
import { chartColors, chartColorOptions, salesAxis, salesMoney } from '../data/chartExamples'
import type { ChartColor } from '../data/chartExamples'

const count = shallowRef('three')
const counts = [{ value: 'one', label: 'Single series' }, { value: 'two', label: '2 series' }, { value: 'three', label: '3 series' }]
const categories = ['Food & drink', 'Apparel', 'Home & living', 'Beauty', 'Accessories']
const channels = reactive<{ id: string; label: string; color: ChartColor; values: readonly number[] }[]>([
  { id: 'online', label: 'Online', color: 'theme', values: [840, 620, 410, 560, 330] },
  { id: 'store', label: 'In store', color: 'indigo', values: [620, 740, 520, 390, 460] },
  { id: 'partners', label: 'Partners', color: 'orange', values: [320, 180, 280, 240, 190] },
])
const visibleChannels = computed(() => channels.slice(0, count.value === 'one' ? 1 : count.value === 'two' ? 2 : 3))
const series = computed<readonly SBarChartSeries[]>(() => visibleChannels.value.map(item => ({ id: item.id, label: item.label, color: chartColors[item.color], data: categories.map((label, index) => ({ label, value: item.values[index]! })) })))
</script>

<template>
  <SCard class="acme-chart-comparison">
    <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Sales by category</h2><SSelect v-model="count" :options="counts" size="sm" aria-label="Bar chart series count" class="w-36" /></div></template>
    <SGrid :columns="2">
      <section class="min-w-0 space-y-4"><h3 class="text-sm font-medium">Vertical bars</h3><SBarChart title="Sales by category, vertical" :series="series" :height="320" :value-formatter="salesMoney" :axis-formatter="salesAxis" /></section>
      <section class="min-w-0 space-y-4"><h3 class="text-sm font-medium">Horizontal bars</h3><SBarChart title="Sales by category, horizontal" orientation="horizontal" :series="series" :height="320" :value-formatter="salesMoney" :axis-formatter="salesAxis" /></section>
    </SGrid>
    <template #footer>
      <div class="grid gap-4 sm:grid-cols-3">
        <label v-for="item in visibleChannels" :key="item.id" class="min-w-0 space-y-2"><span class="flex items-center gap-2 text-xs font-medium"><span aria-hidden="true" class="size-2.5 rounded-full" :style="{ backgroundColor: chartColors[item.color] }"></span>{{ item.label }}</span><SSelect v-model="item.color" :options="chartColorOptions" size="sm" :aria-label="`${item.label} bar color`" /></label>
      </div>
      <p class="mt-3 text-xs text-content-subtle">Illustrative SGD sales · All bars share a zero baseline.</p>
    </template>
  </SCard>
</template>

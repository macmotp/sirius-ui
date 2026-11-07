<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'
import { SLineChart } from '@sirius-ui/charts'
import type { SLineChartPattern, SLineChartSeries } from '@sirius-ui/charts'
import { SCard, SSelect } from '@sirius-ui/vue'
import { chartColors as colors, chartColorOptions as colorOptions, weeklySales } from '../data/chartExamples'
import type { ChartColor } from '../data/chartExamples'

interface ChannelSettings extends Omit<SLineChartSeries, 'color' | 'pattern'> {
  color: ChartColor
  pattern: SLineChartPattern
}
const channels = reactive<ChannelSettings[]>([
  { id: 'online', label: 'Online', color: 'theme', pattern: 'solid', data: weeklySales },
  { id: 'store', label: 'In store', color: 'indigo', pattern: 'dashed', data: [520, 430, 620, 560, 840, 710, 890].map((value, index) => ({ label: weeklySales[index]!.label, value })) },
  { id: 'partners', label: 'Partners', color: 'orange', pattern: 'dotted', data: [180, 290, 240, 380, 310, 460, 390].map((value, index) => ({ label: weeklySales[index]!.label, value })) },
])
const seriesCount = shallowRef('three')
const lineStyle = shallowRef('rounded')
const countOptions = [{ value: 'two', label: '2 series' }, { value: 'three', label: '3 series' }]
const styleOptions = [{ value: 'rounded', label: 'Rounded' }, { value: 'straight', label: 'Straight' }]
const patternOptions = [{ value: 'solid', label: 'Solid' }, { value: 'dashed', label: 'Dashed' }, { value: 'dotted', label: 'Dotted' }]
const visibleChannels = computed(() => channels.slice(0, seriesCount.value === 'two' ? 2 : 3))
const series = computed<readonly SLineChartSeries[]>(() => visibleChannels.value.map(item => ({ ...item, color: colors[item.color] })))
</script>

<template>
  <SCard class="acme-chart-comparison">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-semibold">Sales by channel</h2>
        <div class="flex flex-wrap items-center gap-2">
          <SSelect v-model="seriesCount" :options="countOptions" size="sm" aria-label="Comparison series count" class="w-28" />
          <SSelect v-model="lineStyle" :options="styleOptions" size="sm" aria-label="Comparison line style" class="w-32" />
        </div>
      </div>
    </template>
    <SLineChart title="Daily sales by channel" :series="series" :smooth="lineStyle === 'rounded'" x-labels="all" :height="280" description="Sales channels on one shared scale. Inspect a day to compare all values." />
    <template #footer>
      <div class="grid gap-4 md:grid-cols-3">
        <fieldset v-for="item in visibleChannels" :key="item.id" class="min-w-0">
          <legend class="mb-2 flex items-center gap-2 text-xs font-medium"><span aria-hidden="true" class="size-2.5 rounded-full" :style="{ backgroundColor: colors[item.color] }"></span>{{ item.label }}</legend>
          <div class="grid grid-cols-2 gap-2">
            <SSelect v-model="item.color" :options="colorOptions" size="sm" :aria-label="`${item.label} line color`" />
            <SSelect v-model="item.pattern" :options="patternOptions" size="sm" :aria-label="`${item.label} line pattern`" />
          </div>
        </fieldset>
      </div>
    </template>
  </SCard>
</template>

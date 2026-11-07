<script setup lang="ts">
import { shallowRef } from 'vue'
import { SLineChart } from '@sirius-ui/charts'
import { SCard, SGrid, SSelect } from '@sirius-ui/vue'
import DemoLineChartCard from './DemoLineChartCard.vue'
import DemoChartComparison from './DemoChartComparison.vue'
import DemoBarCharts from './DemoBarCharts.vue'
import DemoDonutCharts from './DemoDonutCharts.vue'
import { weeklySales } from '../data/chartExamples'
const state = shallowRef('ready')
const states = [{ value: 'ready', label: 'With data' }, { value: 'loading', label: 'Loading' }, { value: 'empty', label: 'Empty' }, { value: 'error', label: 'Error' }]
const balance = [12, 18, null, -6, 0, 9].map((value, index) => ({ label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]!, value }))
</script>

<template>
  <div class="space-y-6">
    <DemoLineChartCard />
    <DemoChartComparison />
    <SGrid :columns="2">
      <SCard><template #header><h2 class="font-semibold">Gaps and negative values</h2></template><SLineChart title="Daily net change" series-label="Net change" :data="balance" description="Wednesday has no observation. Friday is a real zero." /></SCard>
      <SCard><template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Request states</h2><SSelect v-model="state" :options="states" size="sm" aria-label="Chart request state" class="w-32" /></div></template><SLineChart title="Example request state" series-label="Sales" :data="state === 'empty' ? [] : weeklySales" :loading="state === 'loading'" :error="state === 'error' ? 'We couldn’t load this chart. Please try again.' : undefined" /></SCard>
    </SGrid>
    <DemoBarCharts />
    <DemoDonutCharts />
  </div>
</template>

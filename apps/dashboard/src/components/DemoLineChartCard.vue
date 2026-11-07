<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SLineChart } from '@sirius-ui/charts'
import { SButton, SCard, SSelect } from '@sirius-ui/vue'
import { ArrowUpRight } from '../../../shared/icons'
import { fortnightSales, salesAxis, salesMoney, weeklySales } from '../data/chartExamples'
defineProps<{ preview?: boolean }>()
const emit = defineEmits<{ browse: [] }>()
const period = shallowRef('week')
const data = computed(() => period.value === 'fortnight' ? fortnightSales : weeklySales)
const total = computed(() => data.value.reduce((sum, point) => sum + (point.value ?? 0), 0))
const periods = [{ value: 'week', label: '7 days' }, { value: 'fortnight', label: '14 days' }]
</script>

<template>
  <SCard>
    <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-semibold">Sales over time</h2><div class="flex items-center gap-2"><SSelect v-model="period" :options="periods" size="sm" aria-label="Sales chart period" class="w-28" /><SButton v-if="preview" size="sm" variant="ghost" @click="emit('browse')">Open Charts<template #trailing><ArrowUpRight /></template></SButton></div></div></template>
    <p class="mb-5 text-2xl font-semibold tracking-tight tabular-nums">{{ salesMoney(total) }} <span class="text-xs font-normal text-content-muted">SGD in this period</span></p>
    <SLineChart title="Daily sales" series-label="Sales · SGD" smooth x-labels="all" :data="data" :height="preview ? 220 : 280" :value-formatter="salesMoney" :axis-formatter="salesAxis" />
    <template #footer><p class="text-xs text-content-subtle">Illustrative daily sales · {{ period === 'week' ? '1–7 Nov' : '25 Oct–7 Nov' }} 2026</p></template>
  </SCard>
</template>

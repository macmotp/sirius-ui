<script setup lang="ts">
import { shallowRef } from 'vue'
import { SSparkline } from '@sirius-ui/charts'
import { SMetricCard, SUserCard } from '@sirius-ui/dashboard'
import type { SMetricCardProps } from '@sirius-ui/dashboard'
import { SBadge, SButton, SCard, SGrid, SProgress, SSwitch } from '@sirius-ui/vue'
import { Activity, Check, Cloud, Mail, Package, Phone } from '../../../shared/icons'
import { salesMoney } from '../data/chartExamples'
import DemoUtilityCards from './DemoUtilityCards.vue'
import DemoPeopleCard from './DemoPeopleCard.vue'
import DemoActivityCards from './DemoActivityCards.vue'
import type { demoUser } from '../data/demo'

defineProps<{ account: typeof demoUser }>()

const loading = shallowRef(false)
const tinted = shallowRef(false)
const smooth = shallowRef(true)
const showSubtitles = shallowRef(false)
const sales = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 2 })
const revenue = {
  label: 'Net sales',
  value: sales.format(12480.50),
  comparison: { value: '+8.4%', label: 'vs. previous week', color: 'success' },
} satisfies SMetricCardProps
const refunds = {
  label: 'Refunds',
  value: salesMoney(360),
  comparison: { value: '+2.1%', label: 'vs. previous week', color: 'warning' },
} satisfies SMetricCardProps
const revenueTrend = [1280, 1620, 1450, 1880, 1630, 2190, 2430.50]
const refundTrend = [40, 45, 35, 55, 40, 60, 85]
const shipmentTrend = [12, 10, 10, 7, 5, 2, 0]

const people = [
  { name: 'Alex Morgan', title: 'Operations manager', access: 'Admin', color: 'success', email: 'alex@acme.example', phone: '+12025550170' },
  { name: 'Jamie Lim', title: 'Customer support specialist', access: 'Member', color: 'primary', email: 'jamie@acme.example', phone: '+12025550114' },
  { name: 'Sam Chen', title: 'Inventory coordinator', access: 'Member', color: 'primary', email: 'sam@acme.example', phone: '+12025550143' },
] as const
const contactLink = 'flex min-h-12 items-center justify-center gap-2 px-2 py-3 text-sm font-medium text-content no-underline hover:bg-surface-muted first:rounded-bl-2xl last:rounded-br-2xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus'

</script>

<template>
  <div class="space-y-8">
    <section aria-labelledby="metric-card-examples">
      <div class="mb-5">
        <h2 id="metric-card-examples" class="text-lg font-semibold">Metric cards</h2>
        <p class="mt-1 text-sm text-content-muted">Summary values, comparisons and a compact view of the latest trend.</p>
      </div>
      <fieldset class="mb-5 flex min-w-0 flex-wrap gap-x-6 gap-y-3 border-0 p-0">
        <legend class="sr-only">Metric card options</legend>
        <SSwitch v-model="tinted" label="Tinted backgrounds" size="sm" />
        <SSwitch v-model="smooth" label="Rounded lines" size="sm" />
        <SSwitch v-model="showSubtitles" label="Show subtitles" size="sm" />
        <SSwitch v-model="loading" label="Show loading state" size="sm" />
      </fieldset>
      <SGrid :columns="3">
        <SMetricCard v-bind="revenue" :detail="showSubtitles ? 'After refunds and discounts' : undefined" :color="tinted ? 'success' : undefined" :loading="loading">
          <template #icon><Activity /></template>
          <template #chart><SSparkline :data="revenueTrend" :smooth="smooth" show-values :value-formatter="value => sales.format(value)" label="Net sales generally rose over the past week" /></template>
        </SMetricCard>
        <SMetricCard v-bind="refunds" :detail="showSubtitles ? 'Across all sales channels' : undefined" :color="tinted ? 'warning' : undefined" :loading="loading">
          <template #icon><Package /></template>
          <template #chart><SSparkline :data="refundTrend" :smooth="smooth" show-values :value-formatter="salesMoney" label="Refunds fluctuated and ended the week higher" /></template>
        </SMetricCard>
        <SMetricCard label="Orders awaiting dispatch" :value="0" :detail="showSubtitles ? 'All orders are up to date' : undefined" :color="tinted ? 'primary' : undefined" :loading="loading">
          <template #icon><Check /></template>
          <template #chart><SSparkline :data="shipmentTrend" :smooth="smooth" show-values label="Orders awaiting dispatch fell to zero over the past week" /></template>
        </SMetricCard>
      </SGrid>
    </section>

    <section aria-labelledby="user-card-examples">
      <h2 id="user-card-examples" class="mb-5 text-lg font-semibold">User cards</h2>
      <ul role="list" class="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="person in people" :key="person.email" class="min-w-0">
          <SUserCard :name="person.name" :role="person.title" layout="stacked" class="h-full">
            <template #badge><SBadge :color="person.color" size="sm">{{ person.access }}</SBadge></template>
            <template #actions>
              <a :href="`mailto:${person.email}`" :aria-label="`Email ${person.name}`" :class="contactLink">
                <Mail aria-hidden="true" class="size-4 shrink-0 text-content-subtle" />
                Email
              </a>
              <a :href="`tel:${person.phone}`" :aria-label="`Call ${person.name}`" :class="contactLink">
                <Phone aria-hidden="true" class="size-4 shrink-0 text-content-subtle" />
                Call
              </a>
            </template>
          </SUserCard>
        </li>
      </ul>
    </section>

    <DemoUtilityCards />

    <DemoPeopleCard :account="account" />
    <DemoActivityCards :account="account" />

    <section aria-labelledby="info-card-examples">
      <h2 id="info-card-examples" class="mb-5 text-lg font-semibold">Information cards</h2>
      <SGrid :columns="2">
        <SCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h3 class="font-semibold">Workspace storage</h3>
              <Cloud aria-hidden="true" class="size-5 shrink-0 text-content-subtle" />
            </div>
          </template>
          <p class="mb-3 text-sm text-content-muted">7.2 GB of 10 GB used</p>
          <SProgress label="Workspace storage used" :value="7.2" :max="10" value-text="7.2 GB of 10 GB" :show-label="false" />
        </SCard>
        <SCard>
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="font-semibold">Orders needing attention</h3>
              <SBadge color="warning" size="sm">Action needed</SBadge>
            </div>
          </template>
          <p class="text-sm text-content-muted">Three orders are waiting for a shipping address confirmation.</p>
          <template #footer><SButton href="#tables" variant="ghost" size="sm">Review orders</SButton></template>
        </SCard>
      </SGrid>
    </section>
  </div>
</template>

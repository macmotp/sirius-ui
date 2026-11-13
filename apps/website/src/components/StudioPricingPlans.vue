<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SButton, SGrid } from '@sirius-ui/vue'
import { SPricingCard } from '@sirius-ui/website'
withDefaults(defineProps<{ headingLevel?: 3 | 4 | 5 | 6 }>(), { headingLevel: 3 })
const yearly = shallowRef(false)
const money = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 })
const plans = computed(() => [
  { title: 'Essentials', description: 'A steady hand for the everyday design work.', price: money.format(yearly.value ? 1000 : 1200), billingNote: yearly.value ? `${money.format(12000)} billed yearly` : 'Billed monthly', features: ['One active design request', 'Brand and digital design', 'Shared project workspace', 'Weekly progress updates'], highlighted: false },
  { title: 'Studio partner', description: 'A little more room for bigger ambitions.', price: money.format(yearly.value ? 2000 : 2400), billingNote: yearly.value ? `${money.format(24000)} billed yearly` : 'Billed monthly', features: ['Two active design requests', 'Brand, digital and editorial', 'Creative direction', 'Weekly working session', 'Priority planning'], highlighted: true },
])
</script>

<template>
  <div>
    <div class="mb-6"><div role="group" aria-label="Billing period" class="inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-line p-1"><SButton size="sm" :variant="!yearly ? 'soft' : 'ghost'" :aria-pressed="!yearly" @click="yearly = false">Monthly</SButton><SButton size="sm" :variant="yearly ? 'soft' : 'ghost'" :aria-pressed="yearly" @click="yearly = true">Yearly · 2 months included</SButton></div></div>
    <p role="status" class="mt-0 mb-6 text-xs leading-6 text-content-muted">Illustrative studio plans · All prices in SGD · {{ yearly ? 'Annual plans are paid upfront. Monthly equivalents shown below.' : 'Monthly billing shown below.' }}</p>
    <SGrid :columns="3"><SPricingCard :heading-level="headingLevel" v-for="plan in plans" :key="plan.title" v-bind="plan" period="/ month" :badge="plan.highlighted ? 'Recommended' : undefined"><template #actions><SButton href="#contact" :variant="plan.highlighted ? 'solid' : 'outline'" full-width>Talk about {{ plan.title }}</SButton></template></SPricingCard><SPricingCard :heading-level="headingLevel" title="A focused project" price="Let’s talk" description="A defined outcome, with its own scope and schedule." billing-note="Quoted for your project" :features="['A clear project proposal', 'Agreed milestones', 'A focused creative team', 'Organized handover']"><template #actions><SButton href="#contact" variant="outline" full-width>Tell us about your idea</SButton></template></SPricingCard></SGrid>
  </div>
</template>

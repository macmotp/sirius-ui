<script setup lang="ts">
import { SAccordion, SButton, STable } from '@sirius-ui/vue'
import type { STableColumn } from '@sirius-ui/vue'
import { SWebsiteHero, SWebsiteSection, SWebsiteCta } from '@sirius-ui/website'
import { faqGroups } from '../content'
import StudioPricingPlans from '../components/StudioPricingPlans.vue'
const comparison = [
  { feature: 'Active requests', essentials: 'One at a time', partner: 'Two at a time' },
  { feature: 'Brand and digital design', essentials: 'Included', partner: 'Included' },
  { feature: 'Editorial and packaging', essentials: 'Scoped separately', partner: 'Included' },
  { feature: 'Creative direction', essentials: 'Scoped separately', partner: 'Included' },
  { feature: 'Progress updates', essentials: 'Weekly', partner: 'Weekly, with a working session' },
]
const columns: STableColumn<typeof comparison[number]>[] = [{ key: 'feature', label: 'What’s included' }, { key: 'essentials', label: 'Essentials' }, { key: 'partner', label: 'Studio partner' }]
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" title="Good work. A clear way forward." eyebrow="Plans & pricing" variant="centered" description="An ongoing design partnership or a focused project. Choose a starting point that fits the shape of your needs." />
  <SWebsiteSection title="A little consistency goes a long way." class="pt-0 lg:pt-0">
    <StudioPricingPlans />
  </SWebsiteSection>
  <SWebsiteSection title="The details, side by side." eyebrow="Compare plans"><STable :rows="comparison" :columns="columns" row-key="feature" caption="Studio partnership comparison" /></SWebsiteSection>
  <SWebsiteSection title="A few questions about working together." eyebrow="Good to know"><div class="max-w-3xl"><SAccordion :items="faqGroups[2]!.items" multiple /></div><SButton href="#faq" variant="ghost" class="mt-6">All questions <span aria-hidden="true" class="ms-2">↗</span></SButton></SWebsiteSection>
  <SWebsiteCta title="Unsure which way to go?" description="We can help shape a sensible starting point together."><template #actions><SButton href="#contact" size="lg">Let’s talk it through</SButton></template></SWebsiteCta>
</template>

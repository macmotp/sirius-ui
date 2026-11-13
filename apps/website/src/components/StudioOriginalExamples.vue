<script setup lang="ts">
import { SWebsiteSection } from '@sirius-ui/website'
import StudioSectionExample from './StudioSectionExample.vue'
import StudioProjectGrid from './StudioProjectGrid.vue'
import StudioPricingPlans from './StudioPricingPlans.vue'
import StudioFaqGroups from './StudioFaqGroups.vue'
import { projects } from '../data'
import { faqGroups } from '../content'
defineProps<{ collection: 'projects' | 'pricing' | 'faq' }>()
</script>

<template>
  <StudioSectionExample v-if="collection === 'projects'" id="projects-example-studio-original" title="Selected work with portfolio cards" description="The original homepage portfolio pair, with linked artwork and project metadata." label="SWebsiteSection + SProjectCard">
    <SWebsiteSection title="A few things we’ve made." eyebrow="Selected work" description="Different challenges. A shared belief that the best work feels both useful and unmistakably itself." :heading-level="4"><StudioProjectGrid :projects="projects.slice(0, 2)" :heading-level="5" /></SWebsiteSection>
  </StudioSectionExample>
  <StudioSectionExample v-else-if="collection === 'pricing'" id="pricing-example-studio-original" title="Studio partnership plans" description="The original plan cards and billing-period controls, shared with the Pricing page." label="SPricingCard + StudioPricingPlans">
    <SWebsiteSection title="A little consistency goes a long way." :heading-level="4"><StudioPricingPlans :heading-level="5" /></SWebsiteSection>
  </StudioSectionExample>
  <StudioSectionExample v-else id="faq-example-studio-original" title="Grouped studio questions" description="The original FAQ groups, with keyboard-operable accordions and independent state." label="SAccordion + StudioFaqGroups">
    <SWebsiteSection title="A few good questions." description="Practical things to know before we start a conversation." :heading-level="4"><StudioFaqGroups :groups="faqGroups" :heading-level="5" /></SWebsiteSection>
  </StudioSectionExample>
</template>

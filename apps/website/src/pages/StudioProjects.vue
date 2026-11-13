<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SButton } from '@sirius-ui/vue'
import { SWebsiteCta, SWebsiteHero, SWebsiteSection } from '@sirius-ui/website'
import StudioProjectGrid from '../components/StudioProjectGrid.vue'
import { projects } from '../data'
const categories = ['All work', 'Brand', 'Digital', 'Editorial'] as const
const category = shallowRef<typeof categories[number]>('All work')
const visible = computed(() => category.value === 'All work' ? projects : projects.filter(project => project.category === category.value))
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" title="A few ideas, out in the world." eyebrow="Our work" variant="centered" description="A selection of brand, digital and editorial explorations. Each one begins with a different question." />
  <SWebsiteSection title="The work" class="pt-0 lg:pt-0">
    <template #aside><div role="group" aria-label="Filter projects" class="flex flex-wrap gap-1"><SButton v-for="option in categories" :key="option" size="sm" :variant="category === option ? 'soft' : 'ghost'" :aria-pressed="category === option" @click="category = option">{{ option }}</SButton></div></template>
    <p role="status" class="mt-0 mb-6 text-xs text-content-muted">{{ visible.length }} {{ visible.length === 1 ? 'project' : 'projects' }}{{ category !== 'All work' ? ` · ${category}` : '' }}</p>
    <StudioProjectGrid :projects="visible" />
  </SWebsiteSection>
  <SWebsiteCta title="Your next chapter could start here." description="Tell us what you’re thinking. We’ll bring a fresh perspective."><template #actions><SButton href="#contact" size="lg">Talk about a project <span aria-hidden="true" class="ms-2">↗</span></SButton></template></SWebsiteCta>
</template>

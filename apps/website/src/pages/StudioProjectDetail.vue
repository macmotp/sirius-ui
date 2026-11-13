<script setup lang="ts">
import { computed } from 'vue'
import { SButton } from '@sirius-ui/vue'
import { SWebsiteCta, SWebsiteHero, SWebsiteSection } from '@sirius-ui/website'
import StudioArtwork from '../components/StudioArtwork.vue'
import StudioProjectGrid from '../components/StudioProjectGrid.vue'
import { projects } from '../data'
import type { StudioProject } from '../data'
const props = defineProps<{ project: StudioProject }>()
const related = computed(() => projects.filter(project => project.id !== props.project.id).slice(0, 2))
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" :title="project.title" :eyebrow="`${project.category} / ${project.year}`" :description="project.tagline" variant="centered">
    <template #actions><SButton href="#projects" variant="ghost" size="sm"><span aria-hidden="true" class="me-2">←</span> All projects</SButton></template>
  </SWebsiteHero>
  <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div class="aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[16/10]"><StudioArtwork :project="project" /></div></div>
  <SWebsiteSection :title="project.description" eyebrow="The project">
    <div class="grid gap-10 lg:grid-cols-[1fr_2fr]">
      <dl class="m-0 space-y-6"><div><dt class="text-xs text-content-subtle">Client</dt><dd class="mt-2 ms-0 text-sm font-medium">{{ project.title }} <span class="font-normal text-content-muted">/ Concept project</span></dd></div><div><dt class="text-xs text-content-subtle">Year</dt><dd class="mt-2 ms-0 text-sm">{{ project.year }}</dd></div><div><dt class="text-xs text-content-subtle">What we made</dt><dd class="mt-2 ms-0"><ul class="m-0 list-none space-y-1 p-0 text-sm text-content-muted"><li v-for="item in project.deliverables" :key="item">{{ item }}</li></ul></dd></div></dl>
      <div class="space-y-9"><div><h3 class="mt-0 mb-3 text-xl font-semibold tracking-tight">The question</h3><p class="m-0 text-base leading-8 text-content-muted">{{ project.challenge }}</p></div><div><h3 class="mt-0 mb-3 text-xl font-semibold tracking-tight">The approach</h3><p class="m-0 text-base leading-8 text-content-muted">{{ project.approach }}</p></div></div>
    </div>
  </SWebsiteSection>
  <SWebsiteSection title="A few more things to explore." eyebrow="More work"><StudioProjectGrid :projects="related" /></SWebsiteSection>
  <SWebsiteCta title="Have a question of your own?" description="Let’s find the right way to bring your idea to life."><template #actions><SButton href="#contact" size="lg">Start a conversation <span aria-hidden="true" class="ms-2">↗</span></SButton></template></SWebsiteCta>
</template>

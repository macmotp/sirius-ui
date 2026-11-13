<script setup lang="ts">
import { SButton } from '@sirius-ui/vue'
import { SWebsiteHero } from '@sirius-ui/website'
import StudioArtwork from './StudioArtwork.vue'
import { projects } from '../data'
withDefaults(defineProps<{ headingLevel?: 1 | 2 | 3 | 4; titleId?: string }>(), { headingLevel: 1 })
</script>

<template>
  <SWebsiteHero :title-id="titleId" :heading-level="headingLevel" title="Good ideas. Thoughtfully made." eyebrow="Independent design studio · Singapore & everywhere" description="We help thoughtful people turn ambitious ideas into brands, websites and experiences with a little more meaning.">
    <template #title>Good ideas.<br /><span class="text-primary-content">Thoughtfully</span><br />made.</template>
    <template #actions><SButton href="#projects" size="lg">Explore our work <span aria-hidden="true" class="ms-2">↗</span></SButton><SButton href="#about" size="lg" variant="ghost">Meet the studio</SButton></template>
    <template #media>
      <figure class="m-0"><a href="#projects/fieldwork" aria-label="View the Fieldwork project" class="block aspect-[4/5] overflow-hidden rounded-2xl"><StudioArtwork :project="projects[0]!" aria-hidden="true" /></a><figcaption class="mt-4 flex items-center justify-between gap-3 text-xs text-content-muted"><span>Fieldwork — a little closer to nature.</span><span>Selected work / 01</span></figcaption></figure>
    </template>
    <p class="m-0 flex items-center gap-2 text-xs text-content-muted"><span aria-hidden="true" class="size-1.5 rounded-full bg-success"></span>Small team. Close collaboration. Considered outcomes.</p>
  </SWebsiteHero>
</template>

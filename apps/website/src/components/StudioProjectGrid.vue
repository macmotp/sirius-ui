<script setup lang="ts">
import { SGrid } from '@sirius-ui/vue'
import { SProjectCard } from '@sirius-ui/website'
import StudioArtwork from './StudioArtwork.vue'
import type { StudioProject } from '../data'
withDefaults(defineProps<{ projects: readonly StudioProject[]; headingLevel?: 3 | 4 | 5 | 6 }>(), { headingLevel: 3 })
</script>

<template>
  <SGrid :columns="2" class="gap-x-8 gap-y-12">
    <SProjectCard v-for="project in projects" :key="project.id" :heading-level="headingLevel" :title="project.title" :href="`#projects/${project.id}`" :category="project.category" :year="project.year" :description="project.description">
      <template #media><StudioArtwork :project="project" /></template>
    </SProjectCard>
  </SGrid>
</template>

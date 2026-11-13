<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import { SWebsiteStats } from '@sirius-ui/website'

const trackRecord = [
  { id: 'projects', label: 'Projects brought to life', value: '120+' },
  { id: 'partners', label: 'Independent teams supported', value: '48' },
  { id: 'countries', label: 'Countries connected', value: '12' },
  { id: 'years', label: 'Years of making things', value: '8' },
]
const mission = [
  { id: 'returning', label: 'Projects from returning partners', value: '72%' },
  { id: 'workshops', label: 'Ideas explored in workshops', value: '300+' },
  { id: 'team', label: 'People, one shared approach', value: '16' },
]
const examples = [
  { id: 'simple', name: 'Joined statistic tiles', summary: 'A centered introduction above four joined statistic tiles.', title: 'Small studio. A growing collection of good work.', description: 'A few numbers from the projects, people, and places that make up our story.', eyebrow: undefined, stats: trackRecord },
  { id: 'image', name: 'Image-led track record', summary: 'Photography beside a two-column collection of statistics.', title: 'Good things happen when we work together.', description: 'From a first conversation to a lasting partnership, we help independent teams find a clearer direction.', eyebrow: 'Our story so far', stats: trackRecord },
  { id: 'description', name: 'Mission statement with key figures', summary: 'A longer introduction with prominent figures alongside it.', title: 'Make useful things. Make them with care.', description: 'We believe the best work starts by listening. A thoughtful question, a shared sketch, and the space to explore can change where a project goes next.', eyebrow: 'What keeps us moving', stats: mission },
] as const
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`stats-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteStats · ${example.id}`" :index="index">
      <SWebsiteStats :title="example.title" :description="example.description" :eyebrow="example.eyebrow" :stats="example.stats" :variant="example.id" :heading-level="4">
        <template v-if="example.id === 'image'" #media><img src="/images/article-workspace.jpg" alt="A bright creative workspace with a laptop and design book." width="1400" height="933" loading="lazy" class="h-full min-h-64 w-full object-cover" /></template>
        <template v-if="example.id === 'description'" #default><p class="m-0">Our work brings strategy, design, and everyday usefulness together. We partner closely with the people behind each idea, staying curious about the details and honest about what will make a difference.</p><p class="mt-5 mb-0">The numbers tell part of that story. The relationships, and the work we keep building together, tell the rest.</p></template>
      </SWebsiteStats>
      <template #note><p class="mt-3 text-xs leading-5 text-content-muted">Illustrative figures for the fictional Acme Studio.<template v-if="example.id === 'image'"> <a href="https://unsplash.com/photos/r3iAqHb7JWs" class="rounded underline underline-offset-4">Photo by Patrik Michalicka / Unsplash</a></template></p></template>
    </StudioSectionExample>
  </div>
</template>

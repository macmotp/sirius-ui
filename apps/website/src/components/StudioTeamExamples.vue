<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import StudioTeamCards from './StudioTeamCards.vue'
import { SWebsiteSection, SWebsiteTeam } from '@sirius-ui/website'

const members = [
  { id: 'alex', name: 'Alex Morgan', role: 'Creative direction' },
  { id: 'jamie', name: 'Jamie Lim', role: 'Brand & visual design' },
  { id: 'sam', name: 'Sam Chen', role: 'Digital & interaction' },
  { id: 'maya', name: 'Maya Tan', role: 'Studio operations' },
  { id: 'riley', name: 'Riley Brooks', role: 'Design strategy' },
  { id: 'jordan', name: 'Jordan Lee', role: 'Editorial design' },
  { id: 'casey', name: 'Casey Park', role: 'Content & storytelling' },
  { id: 'robin', name: 'Robin Patel', role: 'Design systems' },
  { id: 'taylor', name: 'Taylor Reed', role: 'Product design' },
  { id: 'morgan', name: 'Morgan Ellis', role: 'Motion & illustration' },
  { id: 'avery', name: 'Avery Wells', role: 'Project partnerships' },
  { id: 'quinn', name: 'Quinn Rivera', role: 'Front-end development' },
].map((member, index) => ({ ...member, imageSrc: `/images/team-${String(index + 1).padStart(2, '0')}.jpg`, href: '#about' }))
const examples = [
  { id: 'small-images', name: 'Compact team directory', summary: 'A compact two-column team list beside the introduction.', title: 'The people who bring the ideas together.', items: members.slice(0, 6) },
  { id: 'round-images', name: 'Circular portrait directory', summary: 'Larger circular portraits in a grid that grows with the available width.', title: 'Different perspectives. One shared studio.', items: members },
] as const
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="team-example-cards-original" title="Studio team with portrait panels" description="The original About-page team cards, with initials placeholders and role descriptions." label="SWebsiteSection + StudioTeamCards"><SWebsiteSection title="The people behind the ideas." eyebrow="Meet the team" :heading-level="4"><StudioTeamCards :heading-level="5" /></SWebsiteSection></StudioSectionExample>
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`team-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteTeam · ${example.id}`" :index="index">
      <SWebsiteTeam :title="example.title" description="A curious group of designers, thinkers, and makers. We work closely, ask thoughtful questions, and care about the details that make a difference." :members="example.items" :variant="example.id" :heading-level="4" />
      <template #note><p class="mt-3 text-xs leading-5 text-content-muted">Fictional Acme Studio team. Illustrative portraits from Unsplash; profile links open the studio page.</p></template>
    </StudioSectionExample>
  </div>
</template>

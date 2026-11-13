<script setup lang="ts">
import { SAvatar, SGrid } from '@sirius-ui/vue'
withDefaults(defineProps<{ headingLevel?: 3 | 4 | 5 | 6 }>(), { headingLevel: 3 })
const team = [
  { name: 'Alex Morgan', role: 'Strategy & creative direction', initials: 'AM' },
  { name: 'Jamie Lim', role: 'Brand & visual design', initials: 'JL' },
  { name: 'Sam Chen', role: 'Digital & interaction', initials: 'SC' },
]
</script>

<template>
  <SGrid :columns="3" class="gap-8"><article v-for="person in team" :key="person.name"><div class="flex aspect-[5/4] items-center justify-center rounded-2xl bg-surface ring-1 ring-inset ring-line"><SAvatar :name="person.name" :initials="person.initials" size="xl" aria-hidden="true" /></div><component :is="`h${headingLevel}`" class="mt-5 mb-1 text-lg font-semibold">{{ person.name }}</component><p class="m-0 text-sm text-content-muted">{{ person.role }}</p></article></SGrid>
</template>

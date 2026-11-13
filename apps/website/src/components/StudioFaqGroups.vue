<script setup lang="ts">
import { computed, useId } from 'vue'
import { SAccordion } from '@sirius-ui/vue'
import type { FaqGroup } from '../content'
const props = withDefaults(defineProps<{ groups: readonly FaqGroup[]; headingLevel?: 3 | 4 | 5 }>(), { headingLevel: 3 })
const id = useId()
const questionHeadingLevel = computed(() => (props.headingLevel + 1) as 4 | 5 | 6)
</script>

<template>
  <div class="space-y-10"><section v-for="group in groups" :key="group.id" :aria-labelledby="`${id}-${group.id}`"><component :is="`h${headingLevel}`" :id="`${id}-${group.id}`" class="mt-0 mb-4 text-lg font-semibold">{{ group.title }}</component><SAccordion :items="group.items" :heading-level="questionHeadingLevel" multiple /></section></div>
</template>

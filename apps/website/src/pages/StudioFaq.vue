<script setup lang="ts">
import { computed, nextTick, shallowRef, useTemplateRef } from 'vue'
import { SButton, SEmptyState, SField, SInput } from '@sirius-ui/vue'
import { SWebsiteHero, SWebsiteSection, SWebsiteCta } from '@sirius-ui/website'
import { faqGroups } from '../content'
import StudioFaqGroups from '../components/StudioFaqGroups.vue'
const query = shallowRef('')
const topic = shallowRef('all')
const searchRoot = useTemplateRef<HTMLElement>('searchRoot')
const term = computed(() => query.value.trim().toLowerCase())
const groups = computed(() => faqGroups.filter(group => topic.value === 'all' || group.id === topic.value).map(group => ({ ...group, items: group.items.filter(item => `${item.label} ${item.content}`.toLowerCase().includes(term.value)) })).filter(group => group.items.length))
const count = computed(() => groups.value.reduce((total, group) => total + group.items.length, 0))
async function clear() {
  query.value = ''
  topic.value = 'all'
  await nextTick()
  searchRoot.value?.querySelector<HTMLInputElement>('input')?.focus()
}
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" title="A few good questions." eyebrow="Questions & answers" variant="centered" description="Some practical things to know before we start a conversation. If your question isn’t here, we’re happy to help." />
  <SWebsiteSection title="Find an answer." class="pt-0 lg:pt-0">
    <div class="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div ref="searchRoot" class="space-y-6"><SField v-slot="{ control }" label="Search questions"><SInput v-bind="control" v-model="query" type="search" placeholder="Try ‘timeline’ or ‘billing’" /></SField><div role="group" aria-label="Question topics" class="flex flex-wrap gap-1 lg:flex-col lg:items-start"><SButton size="sm" :variant="topic === 'all' ? 'soft' : 'ghost'" :aria-pressed="topic === 'all'" @click="topic = 'all'">All topics</SButton><SButton v-for="group in faqGroups" :key="group.id" size="sm" :variant="topic === group.id ? 'soft' : 'ghost'" :aria-pressed="topic === group.id" @click="topic = group.id">{{ group.title }}</SButton></div></div>
      <div><p role="status" class="mt-0 mb-6 text-xs text-content-muted">{{ count }} {{ count === 1 ? 'question' : 'questions' }} found</p><StudioFaqGroups v-if="groups.length" :groups="groups" /><SEmptyState v-else title="No matching questions" description="Try another search or browse all topics."><template #actions><SButton variant="outline" @click="clear">Clear search and filters</SButton></template></SEmptyState></div>
    </div>
  </SWebsiteSection>
  <SWebsiteCta title="Still have a question?" description="A conversation is often the best place to start."><template #actions><SButton href="#contact" size="lg">Ask us anything</SButton></template></SWebsiteCta>
</template>

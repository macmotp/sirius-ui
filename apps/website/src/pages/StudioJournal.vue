<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SButton } from '@sirius-ui/vue'
import { SWebsiteHero, SWebsiteSection } from '@sirius-ui/website'
import StudioArticleGrid from '../components/StudioArticleGrid.vue'
import StudioJournalArtwork from '../components/StudioJournalArtwork.vue'
import { articles, articleDate } from '../content'
const categories = ['All stories', 'Perspective', 'Process', 'Notes'] as const
const category = shallowRef<typeof categories[number]>('All stories')
const visible = computed(() => category.value === 'All stories' ? articles : articles.filter(article => article.category === category.value))
const featured = articles[0]!
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" title="Notes on the work. And everything around it." eyebrow="The journal" variant="centered" description="A few thoughts on design, the creative process and the details that make a difference." />
  <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><section aria-labelledby="featured-story-title" class="grid items-center gap-8 rounded-2xl bg-surface p-5 ring-1 ring-inset ring-line sm:p-8 lg:grid-cols-2 lg:gap-12"><div class="aspect-[16/10] overflow-hidden rounded-xl"><StudioJournalArtwork :article="featured" /></div><div><p class="mt-0 mb-4 text-xs font-medium tracking-widest text-primary-content uppercase">Featured story</p><h2 id="featured-story-title" class="m-0 text-3xl leading-tight font-semibold tracking-tight"><a :href="`#journal/${featured.id}`" class="rounded text-content no-underline hover:text-primary-content">{{ featured.title }}</a></h2><p class="mt-4 mb-5 text-sm leading-7 text-content-muted">{{ featured.excerpt }}</p><p class="m-0 text-xs text-content-muted"><time :datetime="featured.date">{{ articleDate(featured.date) }}</time> · {{ featured.readTime }}</p></div></section></div>
  <SWebsiteSection title="From the studio." eyebrow="All stories"><template #aside><div role="group" aria-label="Filter articles" class="flex flex-wrap gap-1"><SButton v-for="option in categories" :key="option" size="sm" :variant="category === option ? 'soft' : 'ghost'" :aria-pressed="category === option" @click="category = option">{{ option }}</SButton></div></template><p role="status" class="mt-0 mb-6 text-xs text-content-muted">{{ visible.length }} {{ visible.length === 1 ? 'story' : 'stories' }}</p><StudioArticleGrid :articles="visible" /></SWebsiteSection>
</template>

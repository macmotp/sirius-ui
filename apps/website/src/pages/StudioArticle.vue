<script setup lang="ts">
import { computed } from 'vue'
import { SAvatar, SButton } from '@sirius-ui/vue'
import { SWebsiteHero, SWebsiteSection } from '@sirius-ui/website'
import StudioJournalArtwork from '../components/StudioJournalArtwork.vue'
import StudioArticleGrid from '../components/StudioArticleGrid.vue'
import StudioCodeBlock from '../components/StudioCodeBlock.vue'
import { articles, articleDate } from '../content'
import type { StudioArticle } from '../content'
const props = defineProps<{ article: StudioArticle }>()
const related = computed(() => articles.filter(article => article.id !== props.article.id))
</script>

<template>
  <article aria-labelledby="studio-page-title">
    <SWebsiteHero title-id="studio-page-title" :title="article.title" :eyebrow="`Journal / ${article.category}`" :description="article.excerpt" variant="centered"><div class="flex flex-wrap items-center justify-center gap-3 text-xs text-content-muted"><SAvatar :name="article.author" size="sm" aria-hidden="true" /><span>By {{ article.author }}</span><span aria-hidden="true">·</span><time :datetime="article.date">{{ articleDate(article.date) }}</time><span aria-hidden="true">·</span><span>{{ article.readTime }}</span></div></SWebsiteHero>
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div class="aspect-[16/9] overflow-hidden rounded-2xl"><StudioJournalArtwork :article="article" /></div></div>
    <div class="mx-auto grid max-w-7xl items-start gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[14rem_minmax(0,44rem)] lg:gap-16 lg:px-10 lg:py-20"><nav aria-label="In this article" class="lg:sticky lg:top-8"><h2 class="mt-0 mb-4 text-sm font-semibold">In this article</h2><ul class="m-0 list-none space-y-4 p-0"><li v-for="section in article.sections" :key="section.id"><a :href="`#journal/${article.id}/${section.id}`" class="rounded text-sm leading-6 text-content-muted underline-offset-4 hover:text-primary-content hover:underline">{{ section.title }}</a></li></ul></nav><div class="space-y-12"><section v-for="section in article.sections" :key="section.id" :aria-labelledby="`journal/${article.id}/${section.id}`"><h2 :id="`journal/${article.id}/${section.id}`" tabindex="-1" class="mt-0 mb-5 scroll-mt-8 text-2xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-focus">{{ section.title }}</h2><p v-for="(paragraph, index) in section.paragraphs" :key="index" class="mt-0 mb-5 text-base leading-8 text-content-muted sm:text-lg sm:leading-9">{{ paragraph }}</p><figure v-if="section.figure" class="mx-0 my-8"><img :src="section.figure.src" :alt="section.figure.alt" :width="section.figure.width" :height="section.figure.height" loading="lazy" decoding="async" class="block h-auto w-full rounded-2xl object-cover" /><figcaption class="mt-3 text-sm leading-6 text-content-muted">{{ section.figure.caption }}<span class="mt-1 block text-xs"><a :href="section.figure.creditHref" class="rounded text-content-muted underline decoration-line-strong underline-offset-4 hover:text-primary-content">Photo by {{ section.figure.credit }}</a></span></figcaption></figure><StudioCodeBlock v-if="section.code" :code="section.code" /></section><div class="border-t border-line pt-8"><SButton href="#journal" variant="ghost"><span aria-hidden="true" class="me-2">←</span>Back to the journal</SButton></div></div></div>
  </article>
  <SWebsiteSection title="A little more to read." eyebrow="Keep exploring"><StudioArticleGrid :articles="related" :columns="2" /></SWebsiteSection>
</template>

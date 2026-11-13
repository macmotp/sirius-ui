<script setup lang="ts">
import { SGrid } from '@sirius-ui/vue'
import { SArticleCard } from '@sirius-ui/website'
import StudioJournalArtwork from './StudioJournalArtwork.vue'
import { articleDate } from '../content'
import type { StudioArticle } from '../content'
withDefaults(defineProps<{ articles: readonly StudioArticle[]; columns?: 2 | 3; headingLevel?: 3 | 4 | 5 | 6 }>(), { columns: 3, headingLevel: 3 })
</script>

<template>
  <SGrid :columns="columns" class="gap-x-8 gap-y-12"><SArticleCard v-for="article in articles" :key="article.id" :heading-level="headingLevel" :title="article.title" :href="`#journal/${article.id}`" :excerpt="article.excerpt" :category="article.category" :published-at="article.date" :date-label="articleDate(article.date)" :author="article.author"><template #media><StudioJournalArtwork :article="article" /></template></SArticleCard></SGrid>
</template>

<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import StudioArticleGrid from './StudioArticleGrid.vue'
import { SWebsiteSection, SWebsiteBlog } from '@sirius-ui/website'
import StudioJournalArtwork from './StudioJournalArtwork.vue'
import { articles, articleDate } from '../content'

const posts = articles.map(article => ({
  id: article.id, title: article.title, href: `#journal/${article.id}`, excerpt: article.excerpt,
  publishedAt: article.date, dateLabel: articleDate(article.date), category: article.category,
  categoryHref: '#journal', author: article.author, authorHref: '#about', authorRole: 'Acme Studio · Design & ideas',
}))
const articleById = Object.fromEntries(articles.map(article => [article.id, article]))
const examples = [
  { id: 'columns', name: 'Text-led article columns', summary: 'Text-led articles with dates, category links, and author details.' },
  { id: 'images', name: 'Illustrated article columns', summary: 'A centered introduction above three articles with original cover artwork.' },
  { id: 'list', name: 'Horizontal article list', summary: 'A vertical collection with artwork beside each article at desktop widths.' },
] as const
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="blog-example-journal-original" title="Studio journal with illustrated covers" description="The original journal grid, with illustrated covers and concise article metadata." label="SArticleCard · original journal grid"><SWebsiteSection title="From the studio." eyebrow="The journal" :heading-level="4"><StudioArticleGrid :articles="articles" :heading-level="5" /></SWebsiteSection></StudioSectionExample>
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`blog-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteBlog · ${example.id}`" :index="index">
      <SWebsiteBlog title="From the studio journal." description="Notes on design, the creative process, and the details that make a difference." :posts="posts" :variant="example.id" :heading-level="4">
        <template v-if="example.id !== 'columns'" #media="{ post }"><StudioJournalArtwork :article="articleById[post.id]!" /></template>
      </SWebsiteBlog>
    </StudioSectionExample>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { showcaseSections, type ShowcaseSectionId } from '../showcaseSections'
import StudioShowcaseMenu from '../components/StudioShowcaseMenu.vue'
import StudioOriginalExamples from '../components/StudioOriginalExamples.vue'
import StudioHeroExamples from '../components/StudioHeroExamples.vue'
import StudioFeatureExamples from '../components/StudioFeatureExamples.vue'
import StudioCtaExamples from '../components/StudioCtaExamples.vue'
import StudioNewsletterExamples from '../components/StudioNewsletterExamples.vue'
import StudioStatsExamples from '../components/StudioStatsExamples.vue'
import StudioTestimonialExamples from '../components/StudioTestimonialExamples.vue'
import StudioBlogExamples from '../components/StudioBlogExamples.vue'
import StudioContactExamples from '../components/StudioContactExamples.vue'
import StudioTeamExamples from '../components/StudioTeamExamples.vue'
import StudioFooterExamples from '../components/StudioFooterExamples.vue'

withDefaults(defineProps<{ activeSection?: string }>(), { activeSection: 'heroes' })
const examples: Partial<Record<ShowcaseSectionId, Component>> = {
  heroes: StudioHeroExamples, features: StudioFeatureExamples, cta: StudioCtaExamples,
  newsletter: StudioNewsletterExamples, stats: StudioStatsExamples, testimonials: StudioTestimonialExamples,
  blog: StudioBlogExamples, contact: StudioContactExamples, team: StudioTeamExamples, footer: StudioFooterExamples,
}
</script>

<template>
  <div class="mx-auto w-full max-w-[100rem] px-4 py-10 sm:px-8 lg:px-10">
    <header class="mb-8 max-w-3xl"><h1 id="studio-page-title" class="m-0 text-3xl font-semibold tracking-tight text-content sm:text-4xl">Section showcase</h1><p class="mt-4 mb-0 text-base leading-7 text-content-muted">Browse reusable website sections, compare their variations, and explore the original Acme Studio layouts. Every preview follows the selected appearance and colors.</p></header>
    <div class="min-w-0 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside class="sticky top-0 z-20 mb-8 min-w-0 bg-canvas py-2 lg:top-6 lg:mb-0 lg:py-0"><StudioShowcaseMenu :active-section="activeSection" /></aside>
      <div class="min-w-0 space-y-20">
        <section v-for="collection in showcaseSections" :id="`sections/${collection.id}`" :key="collection.id" :aria-labelledby="`collection-${collection.id}`" tabindex="-1" class="min-w-0 scroll-mt-32 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus lg:scroll-mt-8">
          <div class="mb-8 border-b border-line pb-6"><h2 :id="`collection-${collection.id}`" class="m-0 text-2xl font-semibold tracking-tight text-content sm:text-3xl">{{ collection.title }}</h2><p class="mt-3 mb-0 max-w-2xl text-sm leading-6 text-content-muted">{{ collection.description }}</p></div>
          <StudioOriginalExamples v-if="collection.id === 'projects' || collection.id === 'pricing' || collection.id === 'faq'" :collection="collection.id" />
          <component :is="examples[collection.id]" v-else />
          <p class="mt-8 mb-0 text-sm"><a href="#sections/menu" class="rounded text-content-muted underline underline-offset-4 hover:text-primary-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">Back to section menu <span aria-hidden="true">↑</span></a></p>
        </section>
      </div>
    </div>
  </div>
</template>

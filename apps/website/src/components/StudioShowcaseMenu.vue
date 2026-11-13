<script setup lang="ts">
import { showcaseSections } from '../showcaseSections'
defineProps<{ activeSection?: string }>()
</script>

<template>
  <nav id="sections/menu" tabindex="-1" aria-label="Showcase sections" class="scroll-mt-6 rounded-2xl border border-line bg-canvas p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus lg:p-4">
    <a href="#sections/heroes" class="sr-only rounded text-sm text-primary-content focus:not-sr-only focus:inline-block focus:p-2">Skip section menu</a>
    <p class="mt-0 mb-2 px-2 text-xs font-semibold tracking-wide text-content-muted uppercase">Browse sections</p>
    <ul class="m-0 flex list-none gap-1 overflow-x-auto p-1 lg:max-h-[calc(100dvh-9rem)] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
      <li v-for="section in showcaseSections" :key="section.id" class="shrink-0 lg:shrink"><a :href="`#sections/${section.id}`" :aria-current="activeSection === section.id ? 'location' : undefined" class="block rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:whitespace-normal lg:wrap-anywhere" :class="activeSection === section.id ? 'bg-primary-soft text-primary-content' : 'text-content-muted hover:bg-surface hover:text-content'">{{ section.label }}</a></li>
    </ul>
  </nav>
</template>

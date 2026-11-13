<script setup lang="ts">
import type { SProjectCardProps } from '../website.types'

withDefaults(defineProps<SProjectCardProps>(), { imageAlt: '', linkAs: 'a', headingLevel: 3 })
defineSlots<{ media?(): unknown }>()
</script>

<template>
  <article class="group relative min-w-0">
    <div v-if="$slots.media || imageSrc" class="aspect-[4/3] overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-line">
      <slot name="media"><img v-if="imageSrc" :src="imageSrc" :alt="imageAlt" loading="lazy" class="size-full object-cover" /></slot>
    </div>
    <div class="mt-5 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <component :is="`h${headingLevel}`" class="m-0 text-xl font-semibold tracking-tight"><component :is="linkAs" :href="href" class="rounded text-content no-underline after:absolute after:inset-0 after:rounded-2xl hover:text-primary-content focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus">{{ title }}</component></component>
        <p v-if="category || year" class="mt-1 mb-0 text-sm text-content-muted">{{ category }}<span v-if="category && year" aria-hidden="true"> · </span>{{ year }}</p>
      </div>
      <span aria-hidden="true" class="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-lg text-content-muted transition-colors group-hover:bg-primary-soft group-hover:text-primary-content">↗</span>
    </div>
    <p v-if="description" class="mt-3 mb-0 text-sm leading-6 text-content-muted">{{ description }}</p>
  </article>
</template>

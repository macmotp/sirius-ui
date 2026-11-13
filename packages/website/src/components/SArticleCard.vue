<script setup lang="ts">
import { SAvatar } from '@sirius-ui/vue'
import type { SArticleCardProps } from '../website.types'
withDefaults(defineProps<SArticleCardProps>(), { imageAlt: '', linkAs: 'a', variant: 'default', headingLevel: 3 })
defineSlots<{ media?(): unknown }>()
</script>

<template>
  <article class="group relative min-w-0" :class="{ 'grid gap-7 lg:grid-cols-[12rem_1fr]': variant === 'horizontal' && ($slots.media || imageSrc), 'flex h-full flex-col': variant === 'editorial' }">
    <div v-if="$slots.media || imageSrc" class="overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-line" :class="variant === 'horizontal' ? 'aspect-video lg:aspect-square' : 'mb-5 aspect-[16/10]'"><slot name="media"><img v-if="imageSrc" :src="imageSrc" :alt="imageAlt" loading="lazy" class="size-full object-cover" /></slot></div>
    <div class="flex min-w-0 flex-1 flex-col">
      <p v-if="category || publishedAt" class="mt-0 mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-content-muted">
        <span v-if="category && variant === 'default'" class="font-medium text-primary-content">{{ category }}</span>
        <time v-if="publishedAt" :datetime="publishedAt">{{ dateLabel || publishedAt }}</time>
        <component :is="categoryHref ? linkAs : 'span'" v-if="category && variant !== 'default'" :href="categoryHref" class="relative z-10 rounded-full bg-surface px-3 py-1 font-medium text-content-muted no-underline hover:text-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">{{ category }}</component>
      </p>
      <component :is="`h${headingLevel}`" class="m-0 text-xl leading-7 font-semibold tracking-tight"><component :is="linkAs" :href="href" class="rounded text-content no-underline after:absolute after:inset-0 after:rounded-2xl hover:text-primary-content focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus">{{ title }}</component></component>
      <p v-if="excerpt" class="mt-3 mb-0 text-sm leading-7 text-content-muted">{{ excerpt }}</p>
      <p v-if="author && variant === 'default'" class="mt-4 mb-0 text-xs text-content-muted">By {{ author }}</p>
      <div v-else-if="author" class="relative z-10 mt-auto pt-7" :class="{ 'mt-6 border-t border-line pt-6': variant === 'horizontal' }">
        <div class="flex items-center gap-3"><SAvatar :src="authorImageSrc" :name="author" alt="" /><div class="min-w-0 text-sm leading-6"><p class="m-0 font-semibold text-content"><component :is="authorHref ? linkAs : 'span'" :href="authorHref" class="rounded text-content no-underline hover:text-primary-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">{{ author }}</component></p><p v-if="authorRole" class="mt-0 mb-0 text-content-muted">{{ authorRole }}</p></div></div>
      </div>
    </div>
  </article>
</template>

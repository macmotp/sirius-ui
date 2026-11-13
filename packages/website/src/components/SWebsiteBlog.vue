<script setup lang="ts">
import { computed, useId } from 'vue'
import SArticleCard from './SArticleCard.vue'
import type { SWebsiteBlogPost, SWebsiteBlogProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteBlogProps>(), { variant: 'columns', headingLevel: 2, linkAs: 'a' })
defineSlots<{ media?(props: { post: SWebsiteBlogPost }): unknown }>()
const id = useId()
const cards = computed(() => props.posts.map(post => {
  const { id, ...card } = post
  return { id, post, card }
}))
const postHeadingLevel = computed(() => (props.headingLevel + 1) as 3 | 4 | 5)
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
    <div :class="{ 'mx-auto max-w-4xl': variant === 'list' }">
      <div class="max-w-2xl" :class="{ 'mx-auto text-center': variant === 'images' }">
        <component :is="`h${headingLevel}`" :id="id" class="m-0 text-3xl font-semibold tracking-tight text-content wrap-anywhere sm:text-4xl">{{ title }}</component>
        <p v-if="description" class="mt-4 mb-0 text-base leading-7 text-content-muted sm:text-lg sm:leading-8">{{ description }}</p>
      </div>
      <div class="mt-10 grid gap-x-8 gap-y-12" :class="variant === 'list' ? 'sm:mt-14' : variant === 'columns' ? 'border-t border-line pt-10 lg:grid-cols-3' : 'lg:grid-cols-3 sm:mt-14'">
        <SArticleCard v-for="{ id: postId, post, card } in cards" :key="postId" v-bind="card" :image-src="variant === 'columns' ? undefined : post.imageSrc" :variant="variant === 'list' ? 'horizontal' : 'editorial'" :heading-level="postHeadingLevel" :link-as="linkAs">
          <template v-if="variant !== 'columns' && $slots.media" #media><slot name="media" :post="post" /></template>
        </SArticleCard>
      </div>
    </div>
  </section>
</template>

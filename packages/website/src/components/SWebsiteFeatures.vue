<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SWebsiteFeature, SWebsiteFeaturesProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteFeaturesProps>(), { variant: 'small-icons', headingLevel: 2, linkLabel: 'Learn more', linkAs: 'a' })
defineSlots<{ icon?(props: { feature: SWebsiteFeature }): unknown; media?(): unknown }>()
const id = useId()
const compact = computed(() => props.variant === 'small-icons' || props.variant === 'image')
const layoutClass = computed(() => props.variant === 'grid' ? 'lg:grid-cols-5' : props.variant === 'image' ? 'lg:grid-cols-2 lg:gap-x-16' : '')
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
    <div class="grid gap-10 lg:gap-y-14" :class="layoutClass">
      <div class="min-w-0 max-w-2xl" :class="{ 'mx-auto text-center': variant === 'small-icons', 'lg:col-span-2': variant === 'grid' }">
        <p v-if="eyebrow" class="mt-0 mb-4 text-xs font-medium tracking-widest text-primary-content uppercase">{{ eyebrow }}</p>
        <component :is="`h${headingLevel}`" :id="id" class="m-0 text-3xl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-4xl">{{ title }}</component>
        <p v-if="description" class="mt-5 mb-0 text-base leading-7 text-content-muted sm:text-lg sm:leading-8">{{ description }}</p>
      </div>
      <dl class="m-0 grid min-w-0 gap-x-8 gap-y-10" :class="variant === 'grid' ? 'sm:grid-cols-2 lg:col-span-3' : variant === 'image' ? 'lg:col-start-1 lg:row-start-2' : 'lg:grid-cols-3'">
        <div v-for="feature in features" :key="feature.id" class="flex min-w-0 flex-col">
          <dt class="flex gap-3 text-base leading-7 font-semibold text-content" :class="compact ? 'items-center' : 'flex-col items-start'">
            <span v-if="$slots.icon" aria-hidden="true" class="flex shrink-0 items-center justify-center text-primary-content" :class="compact ? 'size-5 [&>svg]:size-5' : 'mb-2 size-12 rounded-2xl bg-primary-soft [&>svg]:size-6'"><slot name="icon" :feature="feature" /></span>
            {{ feature.title }}
          </dt>
          <dd class="ms-0 mt-3 flex flex-1 flex-col text-base leading-7 text-content-muted" :class="{ 'ps-8': variant === 'image' && $slots.icon }">
            <p class="m-0 flex-1">{{ feature.description }}</p>
            <component :is="linkAs" v-if="feature.href" :href="feature.href" class="mt-5 inline-flex w-fit items-center gap-2 rounded text-sm font-semibold text-primary-content underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span>{{ feature.linkLabel ?? linkLabel }}<span class="sr-only">: {{ feature.title }}</span></span><span aria-hidden="true">→</span></component>
          </dd>
        </div>
      </dl>
      <div v-if="$slots.media" class="min-w-0" :class="{ 'lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center': variant === 'image' }"><slot name="media" /></div>
    </div>
  </section>
</template>

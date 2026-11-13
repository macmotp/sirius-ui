<script setup lang="ts">
import { useId } from 'vue'
import type { SWebsiteSectionProps } from '../website.types'

withDefaults(defineProps<SWebsiteSectionProps>(), { headingLevel: 2 })
defineSlots<{ title?(): unknown; aside?(): unknown; default?(): unknown }>()
const id = useId()
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-2xl">
        <p v-if="eyebrow" class="mt-0 mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">{{ eyebrow }}</p>
        <component :is="`h${headingLevel}`" :id="id" class="m-0 text-3xl font-semibold tracking-tight wrap-anywhere sm:text-4xl"><slot name="title">{{ title }}</slot></component>
        <p v-if="description" class="mt-4 mb-0 max-w-xl text-base leading-7 text-content-muted">{{ description }}</p>
      </div>
      <div v-if="$slots.aside" class="min-w-0"><slot name="aside" /></div>
    </div>
    <slot />
  </section>
</template>

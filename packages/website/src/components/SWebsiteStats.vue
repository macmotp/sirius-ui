<script setup lang="ts">
import { useId } from 'vue'
import type { SWebsiteStatsProps } from '../website.types'

withDefaults(defineProps<SWebsiteStatsProps>(), { variant: 'simple', headingLevel: 2 })
defineSlots<{ media?(): unknown; default?(): unknown }>()
const id = useId()
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
    <div :class="{ 'grid overflow-hidden rounded-2xl bg-surface ring-1 ring-inset ring-line lg:grid-cols-2': variant === 'image' && $slots.media }">
      <div v-if="variant === 'image' && $slots.media" class="min-h-64 min-w-0 overflow-hidden"><slot name="media" /></div>
      <div class="min-w-0" :class="{ 'px-7 py-12 sm:px-12 sm:py-16': variant === 'image' && $slots.media }">
        <div class="max-w-2xl" :class="{ 'mx-auto text-center': variant === 'simple' }">
          <p v-if="eyebrow" class="mt-0 mb-4 text-xs font-medium tracking-widest text-primary-content uppercase">{{ eyebrow }}</p>
          <component :is="`h${headingLevel}`" :id="id" class="m-0 text-3xl font-semibold tracking-tight text-content wrap-anywhere sm:text-4xl">{{ title }}</component>
          <p v-if="description && variant !== 'description'" class="mt-5 mb-0 text-base leading-7 text-content-muted sm:text-lg sm:leading-8">{{ description }}</p>
        </div>
        <div class="mt-10" :class="{ 'grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-20': variant === 'description' }">
          <div v-if="variant === 'description'" class="min-w-0 max-w-2xl text-base leading-7 text-content-muted">
            <p v-if="description" class="mt-0 mb-0 text-lg leading-8 sm:text-xl">{{ description }}</p>
            <div v-if="$slots.default" class="mt-6"><slot /></div>
          </div>
          <dl class="m-0 min-w-0" :class="variant === 'simple' ? 'grid gap-0.5 overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4' : variant === 'image' ? 'grid gap-8 sm:grid-cols-2' : 'grid content-start gap-10'">
            <div v-for="stat in stats" :key="stat.id" class="flex min-w-0 flex-col gap-3" :class="variant === 'simple' ? 'bg-surface p-8 text-center' : variant === 'image' ? 'border-s border-line ps-6' : ''">
              <dt class="text-sm leading-6 text-content-muted" :class="{ 'font-medium': variant === 'simple', 'text-base': variant === 'description' }">{{ stat.label }}</dt>
              <dd class="order-first m-0 font-semibold tracking-tight text-content wrap-anywhere" :class="variant === 'description' ? 'text-4xl sm:text-5xl' : 'text-3xl'">{{ stat.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

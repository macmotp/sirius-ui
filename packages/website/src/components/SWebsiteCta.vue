<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SWebsiteCtaProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteCtaProps>(), { variant: 'banner', headingLevel: 2 })
defineSlots<{ actions?(): unknown; media?(): unknown }>()
const id = useId()
const centered = computed(() => props.variant === 'centered' || props.variant === 'gradient')
const panelClass = computed(() => ({
  banner: 'flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-primary-soft px-7 py-10 text-primary-content sm:px-12 sm:py-14',
  simple: 'py-4 text-content sm:py-8',
  centered: 'website-cta-centered relative isolate overflow-hidden rounded-2xl bg-surface px-7 py-16 text-content ring-1 ring-inset ring-line sm:px-12 sm:py-20',
  gradient: 'website-cta-gradient relative isolate overflow-hidden px-5 py-16 text-content sm:px-12 sm:py-24',
  image: 'grid overflow-hidden rounded-2xl bg-surface text-content ring-1 ring-inset ring-line md:grid-cols-2',
}[props.variant]))
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
    <div :class="panelClass">
      <div v-if="variant === 'image' && $slots.media" class="min-h-72 min-w-0 overflow-hidden"><slot name="media" /></div>
      <div class="relative min-w-0 max-w-2xl" :class="{ 'mx-auto text-center': centered, 'px-7 py-12 sm:px-12 sm:py-16': variant === 'image', 'md:col-span-2': variant === 'image' && !$slots.media }">
        <p v-if="eyebrow" class="mt-0 mb-4 text-xs font-medium tracking-widest text-primary-content uppercase">{{ eyebrow }}</p>
        <component :is="`h${headingLevel}`" :id="id" class="m-0 text-3xl font-semibold tracking-tight wrap-anywhere sm:text-4xl">{{ title }}</component>
        <p v-if="description" class="mt-4 mb-0 max-w-xl text-base leading-7" :class="{ 'mx-auto': centered, 'text-content-muted': variant !== 'banner' }">{{ description }}</p>
        <div v-if="$slots.actions && variant !== 'banner'" class="mt-8 flex flex-wrap items-center gap-3" :class="{ 'justify-center': centered }"><slot name="actions" /></div>
      </div>
      <div v-if="$slots.actions && variant === 'banner'" class="flex flex-wrap items-center gap-3"><slot name="actions" /></div>
    </div>
  </section>
</template>

<style scoped>
.website-cta-centered::before {
  content: '';
  position: absolute;
  inset: 35% 0 0;
  z-index: -1;
  background: radial-gradient(ellipse at 50% 100%, var(--sirius-primary-soft), transparent 70%);
  pointer-events: none;
}
.website-cta-gradient {
  background-image: radial-gradient(ellipse at 20% 100%, color-mix(in oklab, var(--sirius-primary) 20%, transparent), transparent 65%), radial-gradient(ellipse at 85% 0%, var(--sirius-primary-soft), transparent 65%);
}
</style>

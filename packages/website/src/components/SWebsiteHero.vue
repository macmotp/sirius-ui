<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SWebsiteHeroProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteHeroProps>(), { variant: 'split', headingLevel: 1 })
defineSlots<{ announcement?(): unknown; title?(): unknown; actions?(): unknown; media?(): unknown; default?(): unknown }>()
const id = useId()
const centered = computed(() => props.variant === 'centered')
</script>

<template>
  <section :aria-labelledby="titleId ?? id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24" :class="{ 'website-hero-mobile': variant === 'mobile', 'website-hero-angled': variant === 'angled' && $slots.media }">
    <div class="grid items-center gap-12 lg:gap-16" :class="!centered && $slots.media ? 'lg:grid-cols-2' : 'text-center'">
      <div class="relative z-10 min-w-0" :class="{ 'mx-auto max-w-4xl': centered || !$slots.media }">
        <div v-if="$slots.announcement" class="mb-7"><slot name="announcement" /></div>
        <p v-if="eyebrow" class="mt-0 mb-6 text-xs font-medium tracking-widest text-content-muted uppercase">{{ eyebrow }}</p>
        <component :is="`h${headingLevel}`" :id="titleId ?? id" class="m-0 text-5xl leading-[1.05] font-semibold tracking-[-0.055em] wrap-anywhere sm:text-6xl xl:text-7xl"><slot name="title">{{ title }}</slot></component>
        <p v-if="description" class="mt-6 mb-0 max-w-xl text-base leading-7 text-content-muted sm:text-lg sm:leading-8" :class="{ 'mx-auto': centered || !$slots.media }">{{ description }}</p>
        <div v-if="$slots.actions" class="mt-8 flex flex-wrap items-center gap-3" :class="{ 'justify-center': centered || !$slots.media }"><slot name="actions" /></div>
        <div v-if="$slots.default" class="mt-8"><slot /></div>
      </div>
      <div v-if="$slots.media" class="min-w-0" :class="{ 'website-hero-angled-media': variant === 'angled' }">
        <div v-if="variant === 'mobile'" class="website-hero-device"><div class="website-hero-device-screen"><slot name="media" /></div></div>
        <slot v-else name="media" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.website-hero-mobile { position: relative; isolation: isolate; }
.website-hero-mobile::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: linear-gradient(var(--sirius-line) 1px, transparent 1px), linear-gradient(90deg, var(--sirius-line) 1px, transparent 1px);
  background-size: 4rem 4rem;
  mask-image: linear-gradient(120deg, transparent 10%, black);
  opacity: .5;
  pointer-events: none;
}
.website-hero-device {
  position: relative;
  width: min(100%, 19rem);
  aspect-ratio: 9 / 18.5;
  margin-inline: auto;
  padding: .35rem;
  border: .5rem solid var(--sirius-content);
  border-radius: 2.8rem;
  background: var(--sirius-canvas);
  box-shadow: 0 1.5rem 3rem color-mix(in oklab, var(--sirius-content) 16%, transparent);
}
.website-hero-device::after {
  content: '';
  position: absolute;
  top: .65rem;
  left: 50%;
  width: 28%;
  height: 1rem;
  transform: translateX(-50%);
  border-radius: 1rem;
  background: var(--sirius-content);
  pointer-events: none;
}
.website-hero-device-screen { position: absolute; inset: .35rem; overflow: hidden; border-radius: 1.95rem; }
.website-hero-angled { position: relative; isolation: isolate; overflow: hidden; }
.website-hero-angled-media { min-height: 18rem; }
@media (min-width: 64rem) {
  .website-hero-angled { min-height: 42rem; }
  .website-hero-angled-media {
    position: absolute;
    inset-block: 0;
    right: 0;
    width: 52%;
    clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%);
  }
}
</style>

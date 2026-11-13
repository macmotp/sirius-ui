<script setup lang="ts">
import { useId } from 'vue'
import { SAvatar } from '@sirius-ui/vue'
import type { SWebsiteTestimonial, SWebsiteTestimonialsProps } from '../website.types'

withDefaults(defineProps<SWebsiteTestimonialsProps>(), { variant: 'simple', headingLevel: 2 })
defineSlots<{ brand?(props: { testimonial: SWebsiteTestimonial }): unknown; media?(props: { testimonial: SWebsiteTestimonial }): unknown }>()
const id = useId()
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
    <component :is="`h${headingLevel}`" :id="id" class="sr-only">{{ title }}</component>
    <div class="grid gap-10" :class="{ 'lg:grid-cols-2 lg:gap-0': variant === 'multiple' }">
      <div v-for="(testimonial, index) in testimonials" :key="testimonial.id" class="min-w-0" :class="{ 'testimonial-simple relative isolate overflow-hidden rounded-2xl px-5 py-10 sm:px-12 sm:py-14': variant === 'simple', 'grid rounded-2xl bg-surface ring-1 ring-inset ring-line lg:grid-cols-[2fr_3fr]': variant === 'image' && $slots.media, 'flex flex-col lg:px-10': variant === 'multiple', 'border-t border-line pt-10 lg:border-t-0 lg:border-s lg:pt-0': variant === 'multiple' && index > 0 }">
        <div v-if="variant === 'image' && $slots.media" class="min-h-64 min-w-0 p-4 sm:p-6"><div class="h-full min-h-64 overflow-hidden rounded-2xl shadow-sm"><slot name="media" :testimonial="testimonial" /></div></div>
        <div class="flex min-w-0 flex-1 flex-col" :class="{ 'p-7 sm:p-12': variant === 'image' }">
          <div v-if="$slots.brand" class="mb-8 text-content" :class="{ 'self-center': variant === 'simple' }"><slot name="brand" :testimonial="testimonial" /></div>
          <figure class="relative m-0 flex flex-1 flex-col justify-between">
            <blockquote class="relative m-0 leading-8 font-medium text-content wrap-anywhere sm:leading-9" :class="[variant === 'multiple' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl', { 'text-center': variant === 'simple' }]"><p class="m-0">“{{ testimonial.quote }}”</p></blockquote>
            <figcaption class="mt-8 flex gap-4" :class="variant === 'simple' ? 'flex-col items-center text-center' : 'items-center'">
              <SAvatar :name="testimonial.name" :src="testimonial.avatarSrc" alt="" size="lg" />
              <div class="min-w-0 text-sm leading-6"><p class="m-0 font-semibold text-content">{{ testimonial.name }}</p><p v-if="testimonial.role || testimonial.company" class="mt-1 mb-0 text-content-muted">{{ [testimonial.role, testimonial.company].filter(Boolean).join(' · ') }}</p></div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-simple::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(ellipse at 50% 0%, var(--sirius-primary-soft), transparent 70%);
  pointer-events: none;
}
</style>

<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SWebsiteContactDetail, SWebsiteContactProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteContactProps>(), { variant: 'split', headingLevel: 2, linkAs: 'a' })
defineSlots<{ form?(): unknown; icon?(props: { detail: SWebsiteContactDetail }): unknown }>()
const id = useId()
const locationHeadingLevel = computed(() => (props.headingLevel + 1) as 3 | 4 | 5)
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
    <div :class="{ 'grid overflow-hidden rounded-2xl ring-1 ring-inset ring-line lg:grid-cols-2': variant === 'split' && $slots.form }">
      <div class="min-w-0" :class="{ 'contact-introduction bg-surface px-7 py-12 sm:px-10 sm:py-16': variant === 'split' && $slots.form }">
        <component :is="`h${headingLevel}`" :id="id" class="m-0 max-w-2xl text-3xl font-semibold tracking-tight text-content wrap-anywhere sm:text-4xl">{{ title }}</component>
        <p v-if="description" class="mt-5 mb-0 max-w-xl text-base leading-7 text-content-muted sm:text-lg sm:leading-8">{{ description }}</p>
        <dl v-if="variant === 'split' && details?.length" class="mt-8 mb-0 grid gap-6">
          <div v-for="detail in details" :key="detail.id" class="flex min-w-0 items-start gap-4">
            <dt class="shrink-0 text-sm font-medium text-content-muted"><span v-if="$slots.icon" aria-hidden="true" class="inline-flex size-6 items-center justify-center text-primary-content [&>svg]:size-5"><slot name="icon" :detail="detail" /></span><span :class="{ 'sr-only': $slots.icon }">{{ detail.label }}</span></dt>
            <dd class="m-0 min-w-0 text-sm leading-6 whitespace-pre-line text-content wrap-anywhere"><component :is="detail.href ? linkAs : 'span'" :href="detail.href" class="rounded no-underline hover:text-primary-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">{{ detail.value }}</component></dd>
          </div>
        </dl>
      </div>
      <div v-if="variant === 'split' && $slots.form" class="min-w-0 px-7 py-12 sm:px-10 sm:py-16"><slot name="form" /></div>
    </div>
    <div v-if="variant === 'locations' && locations?.length" class="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="location in locations" :key="location.id" class="min-w-0">
        <component :is="`h${locationHeadingLevel}`" class="m-0 border-s-2 border-primary ps-5 text-base font-semibold text-content wrap-anywhere">{{ location.title }}</component>
        <address class="border-s-2 border-line ps-5 pt-3 text-sm leading-7 text-content-muted not-italic"><p v-for="(line, index) in location.address" :key="index" class="m-0 wrap-anywhere">{{ line }}</p></address>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-introduction { background-image: radial-gradient(ellipse at 0% 100%, var(--sirius-primary-soft), transparent 70%); }
</style>

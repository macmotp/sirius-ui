<script setup lang="ts">
import { computed, useId } from 'vue'
import { SAvatar } from '@sirius-ui/vue'
import type { SWebsiteTeamMember, SWebsiteTeamProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteTeamProps>(), { variant: 'small-images', headingLevel: 2, linkAs: 'a' })
defineSlots<{ portrait?(props: { member: SWebsiteTeamMember }): unknown }>()
const id = useId()
const memberHeadingLevel = computed(() => (props.headingLevel + 1) as 3 | 4 | 5)
</script>

<template>
  <section :aria-labelledby="id" class="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
    <div :class="{ 'grid items-start gap-12 xl:grid-cols-3 xl:gap-16': variant === 'small-images' }">
      <div class="max-w-2xl">
        <component :is="`h${headingLevel}`" :id="id" class="m-0 text-3xl font-semibold tracking-tight text-content wrap-anywhere sm:text-4xl">{{ title }}</component>
        <p v-if="description" class="mt-5 mb-0 text-base leading-7 text-content-muted sm:text-lg sm:leading-8">{{ description }}</p>
      </div>
      <ul role="list" class="m-0 grid list-none p-0" :class="variant === 'small-images' ? 'gap-x-8 gap-y-10 sm:grid-cols-2 xl:col-span-2' : 'mt-12 grid-cols-2 gap-x-6 gap-y-12 text-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'">
        <li v-for="member in members" :key="member.id" class="min-w-0" :class="variant === 'small-images' ? 'flex items-center gap-5' : 'flex flex-col items-center'">
          <div class="shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-inset ring-line" :class="variant === 'small-images' ? 'size-16' : 'aspect-square w-24 max-w-full'">
            <slot name="portrait" :member="member"><SAvatar :name="member.name" :src="member.imageSrc" size="xl" alt="" style="width: 100%; height: 100%" /></slot>
          </div>
          <div class="min-w-0" :class="{ 'mt-5': variant === 'round-images' }">
            <component :is="`h${memberHeadingLevel}`" class="m-0 text-base leading-7 font-semibold tracking-tight text-content wrap-anywhere"><component :is="member.href ? linkAs : 'span'" :href="member.href" class="rounded no-underline hover:text-primary-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">{{ member.name }}</component></component>
            <p v-if="member.role" class="mt-1 mb-0 text-sm leading-6 wrap-anywhere" :class="variant === 'small-images' ? 'font-medium text-primary-content' : 'text-content-muted'">{{ member.role }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

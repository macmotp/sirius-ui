<script setup lang="ts">
import { useId } from 'vue'
import WebsiteLinks from './WebsiteLinks.vue'
import type { SWebsiteFooterProps, SWebsiteNavItem } from '../website.types'

withDefaults(defineProps<SWebsiteFooterProps>(), { variant: 'columns', linkAs: 'a', navigationLabel: 'Footer navigation', socialLabel: 'Social links', headingLevel: 2 })
defineSlots<{ brand?(): unknown; default?(): unknown; bottom?(): unknown; socialIcon?(props: { item: SWebsiteNavItem }): unknown }>()
const id = useId()
</script>

<template>
  <footer class="border-t border-line" :class="variant === 'centered' ? 'bg-canvas' : 'bg-surface'">
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10" :class="variant === 'centered' ? 'py-16 sm:py-20' : 'py-12 lg:py-16'">
      <div v-if="variant === 'centered'" class="flex flex-col items-center gap-8 text-center">
        <div v-if="$slots.brand || $slots.default" class="max-w-xl"><slot name="brand" /><div v-if="$slots.default" class="mt-4 text-sm leading-6 text-content-muted"><slot /></div></div>
        <nav v-if="items?.length" :aria-label="navigationLabel" class="w-full"><WebsiteLinks :items="items" :link-as="linkAs" class="justify-center" /></nav>
        <nav v-if="socials?.length" :aria-label="socialLabel"><ul class="m-0 flex list-none flex-wrap justify-center gap-4 p-0 sm:gap-6"><li v-for="item in socials" :key="item.id"><component :is="linkAs" v-bind="item.linkProps" :href="item.href" :target="item.target" :rel="item.rel" class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-2 text-sm text-content-muted no-underline hover:bg-surface hover:text-primary-content focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"><span :class="{ 'sr-only': $slots.socialIcon }">{{ item.label }}</span><span v-if="$slots.socialIcon" aria-hidden="true" class="inline-flex size-6 items-center justify-center [&>svg]:size-full"><slot name="socialIcon" :item="item" /></span></component></li></ul></nav>
        <div v-if="$slots.bottom" class="text-sm leading-6 text-content-muted"><slot name="bottom" /></div>
      </div>
      <template v-else>
        <div class="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div v-if="$slots.brand || $slots.default" class="min-w-0 max-w-sm"><slot name="brand" /><div v-if="$slots.default" class="mt-4 text-sm leading-6 text-content-muted"><slot /></div></div>
          <div v-if="groups?.length" class="grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <nav v-for="group in groups" :key="group.id" :aria-labelledby="`${id}-${group.id}`">
              <component :is="`h${headingLevel}`" :id="`${id}-${group.id}`" class="m-0 mb-3 text-sm font-semibold">{{ group.label }}</component>
              <WebsiteLinks :items="group.items" :link-as="linkAs" class="flex-col gap-0" />
            </nav>
          </div>
        </div>
        <div v-if="$slots.bottom" class="mt-12 border-t border-line pt-6 text-xs leading-5 text-content-muted"><slot name="bottom" /></div>
      </template>
    </div>
  </footer>
</template>

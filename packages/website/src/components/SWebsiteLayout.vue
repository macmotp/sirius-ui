<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SWebsiteLayoutProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteLayoutProps>(), { skipLinkLabel: 'Skip to content' })
defineSlots<{ header?(props: { contentId: string }): unknown; default?(): unknown; footer?(): unknown }>()
const id = useId()
const mainId = computed(() => props.contentId ?? `sirius-website-${id}`)
</script>

<template>
  <div class="min-h-dvh bg-canvas font-sans text-content">
    <a :href="`#${mainId}`" class="fixed top-3 start-3 z-[60] -translate-y-24 rounded-full bg-content px-4 py-2 text-sm text-canvas no-underline focus:translate-y-0">{{ skipLinkLabel }}</a>
    <slot name="header" :content-id="mainId" />
    <main :id="mainId" :aria-labelledby="mainLabelledby" tabindex="-1" class="min-w-0 outline-none"><slot /></main>
    <slot name="footer" />
  </div>
</template>

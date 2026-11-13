<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useId, watch } from 'vue'
import { SButton, SDrawer, SIcon } from '@sirius-ui/vue'
import WebsiteLinks from './WebsiteLinks.vue'
import type { SWebsiteHeaderProps, SWebsiteNavItem } from '../website.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SWebsiteHeaderProps>(), {
  navigationLabel: 'Main navigation', openLabel: 'Open navigation', closeLabel: 'Close navigation',
})
const emit = defineEmits<{ select: [item: SWebsiteNavItem, event: MouseEvent] }>()
defineSlots<{ brand?(): unknown; actions?(props: { close: () => void }): unknown }>()
const open = shallowRef(false)
const id = useId()
let desktop: MediaQueryList | undefined
let focusContent = false
function close() {
  if (!open.value) return
  focusContent = true
  open.value = false
}
function openNavigation() {
  if (desktop?.matches) return
  focusContent = false
  open.value = true
}
function select(item: SWebsiteNavItem, event: MouseEvent) {
  emit('select', item, event)
  if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (!item.target || item.target === '_self')) close()
}
function afterClose() {
  if (focusContent && props.contentId && typeof document !== 'undefined') document.getElementById(props.contentId)?.focus({ preventScroll: true })
  focusContent = false
}
function breakpoint(event: MediaQueryListEvent) { if (event.matches) close() }
watch(() => props.navigationKey, close)
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  desktop = window.matchMedia('(min-width: 64rem)')
  desktop.addEventListener('change', breakpoint)
})
onBeforeUnmount(() => desktop?.removeEventListener('change', breakpoint))
</script>

<template>
  <header v-bind="$attrs" class="border-b border-line bg-canvas">
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-6 sm:px-8 lg:px-10">
      <div class="min-w-0"><slot name="brand" /></div>
      <nav :aria-label="navigationLabel" class="hidden lg:block"><WebsiteLinks :items="items" :current="current" :link-as="linkAs" @select="select" /></nav>
      <div v-if="$slots.actions" class="hidden lg:block"><slot name="actions" :close="close" /></div>
      <SButton variant="ghost" class="lg:hidden" :aria-label="openLabel" aria-haspopup="dialog" :aria-controls="id" :aria-expanded="open" @click="openNavigation"><SIcon name="menu" class="size-5" /></SButton>
    </div>
  </header>
  <SDrawer :id="id" v-model:open="open" :title="navigationLabel" :close-label="closeLabel" side="right" size="sm" @close="afterClose">
    <nav :aria-label="navigationLabel"><WebsiteLinks :items="items" :current="current" :link-as="linkAs" class="flex-col gap-2" @select="select" /></nav>
    <template v-if="$slots.actions" #footer><slot name="actions" :close="close" /></template>
  </SDrawer>
</template>

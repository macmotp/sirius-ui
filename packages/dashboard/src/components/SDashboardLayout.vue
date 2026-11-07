<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { createSiriusIcon, SDrawer } from '@sirius-ui/vue'
import type { SDashboardLayoutProps, SDashboardNavigationSlot } from './SDashboardLayout.types'

const Menu = createSiriusIcon('menu')
const contentGutters = 'px-5 sm:px-8 lg:px-10'
const contentFrame = 'mx-auto w-full min-w-0 max-w-7xl'
const props = withDefaults(defineProps<SDashboardLayoutProps>(), {
  navigationLabel: 'Main navigation',
  openNavigationLabel: 'Open navigation',
  closeNavigationLabel: 'Close navigation',
  skipLinkLabel: 'Skip to content',
})
defineSlots<{
  brand(props: SDashboardNavigationSlot): unknown
  navigation(props: SDashboardNavigationSlot): unknown
  sidebarFooter?(props: SDashboardNavigationSlot): unknown
  header?(): unknown
  headerActions?(): unknown
  default(): unknown
}>()
const id = useId()
const content = useTemplateRef<HTMLElement>('content')
const mobileOpen = shallowRef(false)
let desktop: MediaQueryList | undefined
let focusContent = false

function openNavigation() {
  if (desktop?.matches) return
  focusContent = false
  mobileOpen.value = true
}
function closeNavigation() {
  if (!mobileOpen.value) return
  focusContent = true
  mobileOpen.value = false
}
function afterClose() {
  // Native dialog dismissal restores its opener. Route changes and desktop resizing
  // instead need a visible target, since the mobile trigger may have disappeared.
  if (focusContent) content.value?.focus({ preventScroll: true })
  focusContent = false
}
function onBreakpoint(event: MediaQueryListEvent) {
  if (event.matches) closeNavigation()
}
watch(() => props.navigationKey, closeNavigation)
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  desktop = window.matchMedia('(min-width: 64rem)')
  desktop.addEventListener('change', onBreakpoint)
})
onBeforeUnmount(() => { desktop?.removeEventListener('change', onBreakpoint) })
</script>

<template>
  <div class="sirius-dashboard box-border min-h-dvh bg-canvas font-sans text-content lg:grid lg:grid-cols-[var(--sirius-dashboard-sidebar-width,17rem)_minmax(0,1fr)]">
    <a :href="`#${id}-content`" class="sr-only z-50 rounded-control bg-primary-soft px-4 py-3 text-sm font-medium text-primary-content focus:not-sr-only focus:fixed focus:top-3 focus:left-3">{{ skipLinkLabel }}</a>
    <aside class="sticky top-0 hidden h-dvh min-w-0 box-border flex-col gap-8 border-0 border-r border-solid border-line bg-canvas px-6 py-7 lg:flex">
      <div class="min-w-0 shrink-0 break-words"><slot name="brand" :mobile="false" :close="closeNavigation" /></div>
      <nav :aria-label="navigationLabel" class="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain"><slot name="navigation" :mobile="false" :close="closeNavigation" /></nav>
      <div v-if="$slots.sidebarFooter" class="min-w-0 shrink-0 border-0 border-t border-solid border-line pt-5"><slot name="sidebarFooter" :mobile="false" :close="closeNavigation" /></div>
    </aside>
    <div class="min-w-0">
      <header class="sticky top-0 z-10 box-border flex min-h-20 min-w-0 items-center border-0 border-b border-solid border-line bg-canvas py-4" :class="contentGutters">
        <div class="flex flex-wrap items-center gap-4" :class="contentFrame">
          <button type="button" :aria-label="openNavigationLabel" aria-haspopup="dialog" :aria-expanded="mobileOpen" :aria-controls="`${id}-navigation`" class="m-0 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-control border-0 bg-surface p-0 text-content ring-1 ring-inset ring-line-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden" @click="openNavigation"><Menu aria-hidden="true" focusable="false" class="size-5" /></button>
          <div class="min-w-0 flex-1 break-words"><slot name="header" /></div>
          <div v-if="$slots.headerActions" class="flex max-w-full min-w-0 flex-wrap items-center gap-3"><slot name="headerActions" /></div>
        </div>
      </header>
      <main :id="`${id}-content`" ref="content" :aria-labelledby="mainLabelledby" tabindex="-1" class="box-border min-w-0 py-8 outline-none lg:py-10" :class="contentGutters">
        <div :class="contentFrame"><slot /></div>
      </main>
    </div>
    <SDrawer :id="`${id}-navigation`" v-model:open="mobileOpen" side="left" size="sm" :title="navigationLabel" :close-label="closeNavigationLabel" @close="afterClose">
      <div class="mb-8 min-w-0 break-words"><slot name="brand" :mobile="true" :close="closeNavigation" /></div>
      <nav :aria-label="navigationLabel"><slot name="navigation" :mobile="true" :close="closeNavigation" /></nav>
      <template v-if="$slots.sidebarFooter" #footer><div class="w-full min-w-0 border-0 border-t border-solid border-line pt-5"><slot name="sidebarFooter" :mobile="true" :close="closeNavigation" /></div></template>
    </SDrawer>
  </div>
</template>

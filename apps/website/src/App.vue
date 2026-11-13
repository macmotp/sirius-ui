<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watchEffect } from 'vue'
import { SButton, SSelect, SSwitch } from '@sirius-ui/vue'
import { SWebsiteLayout, SWebsiteHeader } from '@sirius-ui/website'
import StudioBrand from './components/StudioBrand.vue'
import StudioSiteFooter from './components/StudioSiteFooter.vue'
import StudioHome from './pages/StudioHome.vue'
import StudioAbout from './pages/StudioAbout.vue'
import StudioProjects from './pages/StudioProjects.vue'
import StudioProjectDetail from './pages/StudioProjectDetail.vue'
import StudioContact from './pages/StudioContact.vue'
import StudioServiceIndex from './pages/StudioServiceIndex.vue'
import StudioServiceDetail from './pages/StudioServiceDetail.vue'
import StudioPricing from './pages/StudioPricing.vue'
import StudioFaq from './pages/StudioFaq.vue'
import StudioJournal from './pages/StudioJournal.vue'
import StudioArticle from './pages/StudioArticle.vue'
import StudioSections from './pages/StudioSections.vue'
import { navigation } from './data'
import { pageOptions, resolveDestination } from './routes'

const destination = shallowRef('home')
const dark = shallowRef(false)
const primary = shallowRef('teal')
const backgrounds = ['mist', 'slate', 'stone']
const background = shallowRef('slate')
const route = computed(() => resolveDestination(destination.value))
function selectPage(value: string) { window.location.hash = value }
function closeOnNavigation(event: MouseEvent, close: () => void) {
  if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) close()
}
function readLocation() {
  const next = window.location.hash.slice(1) || 'home'
  if (next === 'studio-content' || next === destination.value) return
  destination.value = next
  void nextTick(() => {
    const anchor = route.value.anchor && document.getElementById(route.value.anchor)
    if (anchor) {
      anchor.focus({ preventScroll: true })
      anchor.scrollIntoView({ block: 'start', behavior: 'instant' })
    } else {
      document.getElementById('studio-content')?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  })
}
onMounted(() => { readLocation(); window.addEventListener('hashchange', readLocation) })
onBeforeUnmount(() => window.removeEventListener('hashchange', readLocation))
watchEffect(() => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
  document.documentElement.dataset.siriusColor = primary.value
  document.documentElement.dataset.siriusBackground = background.value
  document.title = `${route.value.title} · Acme Studio`
})
</script>

<template>
  <div class="border-b border-line bg-surface px-5 py-2 sm:px-8 lg:px-10">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
      <p class="m-0 text-xs text-content-muted"><span class="font-semibold text-content">Sirius UI</span><span class="mx-2">/</span>Website preview</p>
      <div role="group" aria-label="Website preview appearance" class="flex flex-wrap items-center gap-3">
        <label class="sr-only" for="website-page">Page example</label><SSelect id="website-page" :model-value="route.current" :options="pageOptions" size="sm" class="w-36" @update:model-value="selectPage" />
        <label class="sr-only" for="website-primary">Accent color</label><SSelect id="website-primary" v-model="primary" :options="['teal', 'emerald', 'cyan', 'indigo', 'pink', 'orange'].map(value => ({ value, label: value }))" size="sm" class="w-24" />
        <label class="sr-only" for="website-background">Background palette</label><SSelect id="website-background" v-model="background" :options="backgrounds.map(value => ({ value, label: value }))" size="sm" class="w-24" />
        <SSwitch v-model="dark" label="Dark" size="sm" />
      </div>
    </div>
  </div>
  <SWebsiteLayout content-id="studio-content" main-labelledby="studio-page-title">
    <template #header="{ contentId }"><SWebsiteHeader :items="navigation" :current="route.current" :navigation-key="destination" :content-id="contentId"><template #brand><StudioBrand /></template><template #actions="{ close }"><SButton href="#contact" variant="outline" size="sm" :aria-current="route.page === 'contact' ? 'page' : undefined" @click="closeOnNavigation($event, close)">Let’s talk <span aria-hidden="true" class="ms-2">↗</span></SButton></template></SWebsiteHeader></template>
    <StudioHome v-if="route.page === 'home'" />
    <StudioAbout v-else-if="route.page === 'about'" />
    <StudioProjects v-else-if="route.page === 'projects'" />
    <StudioProjectDetail v-else-if="route.page === 'project' && route.project" :project="route.project" />
    <StudioServiceIndex v-else-if="route.page === 'services'" />
    <StudioServiceDetail v-else-if="route.page === 'service' && route.service" :service="route.service" />
    <StudioPricing v-else-if="route.page === 'pricing'" />
    <StudioFaq v-else-if="route.page === 'faq'" />
    <StudioJournal v-else-if="route.page === 'journal'" />
    <StudioArticle v-else-if="route.page === 'article' && route.article" :article="route.article" />
    <StudioSections v-else-if="route.page === 'sections'" :active-section="route.anchor?.split('/')[1]" />
    <StudioContact v-else />
    <template #footer><StudioSiteFooter /></template>
  </SWebsiteLayout>
</template>

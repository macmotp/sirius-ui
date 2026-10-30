<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { SSelect } from '@sirius-ui/vue'
import { showcaseGroups } from './showcaseGroups'

type Appearance = 'light' | 'dark' | 'system'
const accentColors = ['teal', 'emerald', 'cyan', 'indigo', 'pink', 'orange'] as const
const backgroundColors = ['mist', 'slate', 'stone'] as const

function stored(key: string) {
  try { return localStorage.getItem(key) } catch { return null }
}

const savedAppearance = stored('sirius-playground-appearance')
const appearance = ref<Appearance>(savedAppearance === 'light' || savedAppearance === 'dark' ? savedAppearance : 'system')
const accent = ref(accentColors.find((color) => color === stored('sirius-playground-color')) ?? 'teal')
const background = ref(backgroundColors.find((color) => color === stored('sirius-playground-background')) ?? 'mist')
const media = window.matchMedia('(prefers-color-scheme: dark)')
const systemDark = ref(media.matches)

function followSystem(event: MediaQueryListEvent) { systemDark.value = event.matches }
onMounted(() => media.addEventListener('change', followSystem))
onUnmounted(() => media.removeEventListener('change', followSystem))

watchEffect(() => {
  document.documentElement.dataset.theme = appearance.value === 'system'
    ? (systemDark.value ? 'dark' : 'light')
    : appearance.value
  document.documentElement.dataset.siriusColor = accent.value
  document.documentElement.dataset.siriusBackground = background.value
  try {
    localStorage.setItem('sirius-playground-appearance', appearance.value)
    localStorage.setItem('sirius-playground-color', accent.value)
    localStorage.setItem('sirius-playground-background', background.value)
  } catch { /* The controls also work when browser storage is unavailable. */ }
})
</script>

<template>
  <a href="#main" class="sr-only z-50 rounded-md bg-primary p-3 text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to content</a>
  <div class="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside class="border-b border-line bg-canvas p-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:p-8">
      <a href="#" class="flex w-fit items-center gap-3" aria-label="SiriusUI playground home">
        <span class="sirius-logo block size-10 shrink-0 bg-primary" aria-hidden="true"></span>
        <span class="text-xl font-semibold tracking-tight">Sirius<span class="sirius-wordmark-ui">UI</span></span>
      </a>
      <p class="mt-8 hidden text-xs font-semibold tracking-[0.16em] text-content-muted uppercase lg:block">Explore the library</p>
      <nav aria-label="Playground sections" class="mt-5 flex flex-wrap gap-2 lg:min-h-0 lg:flex-1 lg:flex-col lg:flex-nowrap lg:gap-1 lg:overflow-y-auto">
        <a v-for="group in showcaseGroups" :key="group.id" :href="`#${group.id}`" class="rounded-md px-3 py-2 text-sm text-content-muted transition-colors hover:bg-primary-soft hover:text-primary-content">{{ group.title }}</a>
      </nav>
      <div class="mt-auto hidden pt-12 lg:block">
        <p class="font-mono text-xs text-content-subtle">v0.0.0 / playground</p>
        <p class="mt-3 text-xs leading-relaxed text-content-muted">A common foundation.<br />Room for your own identity.</p>
      </div>
    </aside>

    <main id="main" class="min-w-0 px-5 py-8 sm:px-10 lg:px-12 lg:py-10 xl:px-16">
      <header id="overview" class="pb-10">
        <div class="flex flex-wrap items-center justify-between gap-6">
          <p class="text-xs font-semibold tracking-[0.16em] text-primary-content uppercase">Sirius UI / Playground</p>
          <div class="flex flex-wrap gap-3">
            <div class="grid grid-cols-[auto_8rem] items-center gap-2 text-xs text-content-muted">
              <label for="playground-accent">Accent</label>
              <SSelect id="playground-accent" :model-value="accent" :options="accentColors.map(value => ({ value, label: value }))" class="capitalize" @update:model-value="accent = $event as typeof accent" />
            </div>
            <div class="grid grid-cols-[auto_8rem] items-center gap-2 text-xs text-content-muted">
              <label for="playground-background">Background</label>
              <SSelect id="playground-background" :model-value="background" :options="backgroundColors.map(value => ({ value, label: value }))" class="capitalize" @update:model-value="background = $event as typeof background" />
            </div>
            <div class="grid grid-cols-[auto_8rem] items-center gap-2 text-xs text-content-muted">
              <label for="playground-appearance">Appearance</label>
              <SSelect id="playground-appearance" :model-value="appearance" :options="[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]" @update:model-value="appearance = $event as Appearance" />
            </div>
          </div>
        </div>
        <h1 class="mt-10 text-4xl font-semibold tracking-tight sm:text-5xl">One foundation.<br /><span class="text-content-muted">Many possibilities.</span></h1>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-content-muted">Make it your own with an accent color and a neutral background. Success, warning, and danger keep their familiar colors. Switch appearance to explore both modes.</p>
        <div class="mt-7 flex flex-wrap items-center gap-3 text-xs">
          <span class="rounded-full bg-primary-soft px-3 py-1.5 font-medium text-primary-content">Theme foundations</span>
          <span class="text-content-subtle">Vue 3 · Tailwind CSS 4 · CSS tokens</span>
        </div>
      </header>

      <section v-for="group in showcaseGroups" :id="group.id" :key="group.id" class="border-t border-line pt-10" :aria-labelledby="`${group.id}-group-title`">
        <header>
          <h2 :id="`${group.id}-group-title`" class="text-2xl font-semibold tracking-tight">{{ group.title }}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-content-muted">{{ group.description }}</p>
        </header>
        <div class="[&>section:first-child]:border-t-0">
          <component :is="showcase" v-for="(showcase, index) in group.components" :key="index" />
        </div>
      </section>
      <footer class="flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs text-content-subtle"><span>SiriusUI · Built to be shared.</span><span>Vue components · Theme foundations.</span></footer>
    </main>
  </div>
</template>

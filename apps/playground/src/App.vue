<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { SButton, SSelect } from '@sirius-ui/vue'
import ButtonShowcase from './components/ButtonShowcase.vue'
import FormShowcase from './components/FormShowcase.vue'

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
const interaction = ref('Ready to try the theme.')
const notifications = ref(true)
const projectName = ref('My workspace')

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

const swatches = [
  { name: 'Primary', token: 'primary', classes: 'bg-primary text-on-primary' },
  { name: 'Warning', token: 'warning', classes: 'bg-warning text-on-warning' },
  { name: 'Success', token: 'success', classes: 'bg-success text-on-success' },
  { name: 'Danger', token: 'danger', classes: 'bg-danger text-on-danger' },
  { name: 'Soft primary', token: 'primary-soft', classes: 'bg-primary-soft text-primary-content' },
  { name: 'Canvas', token: 'canvas', classes: 'bg-canvas text-content' },
  { name: 'Surface', token: 'surface', classes: 'bg-surface text-content' },
  { name: 'Muted surface', token: 'surface-muted', classes: 'bg-surface-muted text-content' },
  { name: 'Hover surface', token: 'surface-hover', classes: 'bg-surface-hover text-content' },
]
const statuses = [
  { name: 'Success', classes: 'bg-success-soft text-success-content', description: 'Everything is up to date.' },
  { name: 'Warning', classes: 'bg-warning-soft text-warning-content', description: 'Something needs your attention.' },
  { name: 'Danger', classes: 'bg-danger-soft text-danger-content', description: 'We could not complete this action.' },
]
const radii = ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full']
const shadows = ['shadow-sm', 'shadow-md', 'shadow-lg']
const spacing = [1, 2, 3, 4, 6, 8, 12, 16]
</script>

<template>
  <a href="#main" class="sr-only z-50 rounded-md bg-primary p-3 text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to content</a>
  <div class="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside class="border-b border-line bg-canvas p-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0 lg:p-8">
      <a href="#" class="flex w-fit items-center gap-3" aria-label="SiriusUI playground home">
        <span class="sirius-logo block size-10 shrink-0 bg-primary" aria-hidden="true"></span>
        <span class="text-xl font-semibold tracking-tight">Sirius<span class="sirius-wordmark-ui">UI</span></span>
      </a>
      <p class="mt-8 hidden text-xs font-semibold tracking-[0.16em] text-content-muted uppercase lg:block">Design foundations</p>
      <nav aria-label="Playground sections" class="mt-5 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
        <a v-for="section in ['Overview', 'Colors', 'Typography', 'Geometry', 'Interaction', 'Buttons', 'Forms']" :key="section" :href="`#${section.toLowerCase()}`" class="rounded-md px-3 py-2 text-sm text-content-muted transition-colors hover:bg-primary-soft hover:text-primary-content">{{ section }}</a>
      </nav>
      <div class="mt-auto hidden pt-12 lg:block">
        <p class="font-mono text-xs text-content-subtle">v0.0.0 / playground</p>
        <p class="mt-3 text-xs leading-relaxed text-content-muted">A common foundation.<br />Room for your own identity.</p>
      </div>
    </aside>

    <main id="main" class="min-w-0 px-5 py-8 sm:px-10 lg:px-12 lg:py-10 xl:px-16">
      <header id="overview" class="border-b border-line pb-10">
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

      <section id="colors" class="py-10" aria-labelledby="colors-title">
        <div class="mb-6 flex items-baseline gap-3"><span class="font-mono text-xs text-content-subtle">01</span><h2 id="colors-title" class="text-xl font-semibold tracking-tight">Colors with a purpose</h2></div>
        <div class="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <div v-for="swatch in swatches" :key="swatch.token" class="relative after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line overflow-hidden rounded bg-surface">
            <div :class="swatch.classes" class="flex h-24 items-end p-4 sm:h-28"><span class="text-lg font-medium">Aa</span></div>
            <div class="border-t border-line p-4"><p class="text-sm font-medium">{{ swatch.name }}</p><code class="mt-1 block text-xs text-content-muted">{{ swatch.token }}</code></div>
          </div>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div v-for="status in statuses" :key="status.name" :class="status.classes" class="rounded p-4">
            <p class="text-sm font-semibold">{{ status.name }}</p><p class="mt-1 text-xs leading-relaxed">{{ status.description }}</p>
          </div>
        </div>
      </section>

      <section id="typography" class="border-t border-line py-10" aria-labelledby="type-title">
        <div class="mb-6 flex items-baseline gap-3"><span class="font-mono text-xs text-content-subtle">02</span><h2 id="type-title" class="text-xl font-semibold tracking-tight">A clear voice</h2></div>
        <div class="grid gap-8 rounded bg-surface ring-1 ring-inset ring-line p-6 sm:p-8 xl:grid-cols-2">
          <div><p class="mb-5 font-mono text-xs text-content-subtle">InterVariable / font-sans</p><p class="text-2xl font-semibold tracking-tight">Good design starts<br />with a little clarity.</p><p class="mt-4 max-w-sm text-base text-content-muted">Familiar type, comfortable spacing, and a hierarchy that makes room for what matters.</p></div>
          <div class="space-y-4 xl:border-l xl:border-line xl:pl-8">
            <p class="text-2xl">A heading <code class="ml-2 text-xs text-content-subtle">2xl / 24</code></p>
            <p class="text-lg">A supporting thought <code class="ml-2 text-xs text-content-subtle">lg / 18</code></p>
            <p class="text-base">The everyday details <code class="ml-2 text-xs text-content-subtle">base / 16</code></p>
            <p class="text-sm text-content-muted">A little extra context <code class="ml-2 text-xs">sm / 14</code></p>
            <p class="font-mono text-xs text-content-subtle">--sirius-font-mono / xs / 12</p>
          </div>
        </div>
      </section>

      <section id="geometry" class="border-t border-line py-10" aria-labelledby="geometry-title">
        <div class="mb-6 flex items-baseline gap-3"><span class="font-mono text-xs text-content-subtle">03</span><h2 id="geometry-title" class="text-xl font-semibold tracking-tight">Space, shape, and depth</h2></div>
        <div class="grid gap-5 xl:grid-cols-2">
          <div class="rounded bg-surface ring-1 ring-inset ring-line p-6"><h3 class="text-sm font-medium">Corner radius <span class="font-normal text-content-muted">2xl default · full controls</span></h3><div class="mt-6 grid grid-cols-3 gap-4"><div v-for="radius in radii" :key="radius" class="min-w-0"><div :class="radius" class="h-16 border border-primary/30 bg-primary-soft"></div><code class="mt-3 block text-xs text-content-muted">{{ radius.replace('rounded-', '') }}</code></div></div></div>
          <div class="rounded bg-surface ring-1 ring-inset ring-line p-6"><h3 class="text-sm font-medium">Elevation</h3><div class="mt-6 grid grid-cols-3 gap-5"><div v-for="shadow in shadows" :key="shadow" class="min-w-0"><div :class="shadow" class="h-16 rounded-md bg-surface ring-1 ring-inset ring-line"></div><code class="mt-3 block text-xs text-content-muted">{{ shadow.replace('shadow-', '') }}</code></div></div></div>
        </div>
        <div class="mt-5 rounded bg-surface ring-1 ring-inset ring-line p-6"><h3 class="text-sm font-medium">Spacing scale <span class="ml-2 font-normal text-content-muted">A 4px base unit</span></h3><div class="mt-6 flex flex-wrap items-end gap-5 sm:gap-7"><div v-for="unit in spacing" :key="unit" class="text-center"><div class="mx-auto w-5 rounded-sm bg-primary" :style="{ height: `calc(var(--sirius-spacing) * ${unit})` }"></div><code class="mt-3 block text-xs text-content-muted">{{ unit }}</code></div></div></div>
      </section>

      <section id="interaction" class="border-t border-line py-10" aria-labelledby="interaction-title">
        <div class="mb-6 flex items-baseline gap-3"><span class="font-mono text-xs text-content-subtle">04</span><h2 id="interaction-title" class="text-xl font-semibold tracking-tight">Put the tokens to work</h2></div>
        <div class="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
          <div><h3 class="text-lg font-medium">A small interaction study</h3><p class="mt-3 text-sm leading-relaxed text-content-muted">Try the fields, hover the buttons, and navigate with your keyboard. The fields demonstrate native theme styling; the actions use the shared SButton component.</p><div class="mt-6 rounded-lg bg-surface ring-1 ring-inset ring-line p-4 font-mono text-xs leading-loose text-content-muted">bg-surface · text-content<br />rounded · rounded-control<br />bg-primary · text-on-solid</div></div>
          <form class="rounded bg-surface ring-1 ring-inset ring-line p-6 shadow-sm sm:p-8" @submit.prevent="interaction = `Preview saved for ${projectName.trim() || 'your workspace'}.`">
            <label for="project-name" class="block text-sm font-medium">Workspace name</label>
            <input id="project-name" v-model="projectName" maxlength="80" class="mt-2 w-full rounded-control border-0 bg-control px-3 py-1.5 text-sm leading-6 text-control-content shadow-xs ring-1 ring-inset ring-control-line placeholder:text-control-placeholder focus:ring-1 focus:ring-inset focus:ring-control-focus focus:outline-none" />
            <label class="mt-5 flex items-center gap-3 text-sm"><input v-model="notifications" type="checkbox" class="size-4 accent-primary" />Email notifications</label>
            <div class="mt-7 flex flex-wrap gap-3"><SButton type="submit">Save preview</SButton><SButton variant="outline" @click="projectName = 'My workspace'; notifications = true; interaction = 'Preview reset.'">Reset</SButton><SButton disabled>Disabled</SButton></div>
            <p role="status" class="mt-5 min-h-5 text-xs text-content-muted">{{ interaction }}</p>
          </form>
        </div>
      </section>
      <ButtonShowcase />
      <FormShowcase />
      <footer class="flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs text-content-subtle"><span>SiriusUI · Built to be shared.</span><span>Vue components · Theme foundations.</span></footer>
    </main>
  </div>
</template>

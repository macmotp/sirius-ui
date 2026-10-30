<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton } from '@sirius-ui/vue'

const interaction = shallowRef('Ready to try the theme.')
const notifications = shallowRef(true)
const projectName = shallowRef('My workspace')

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
  <section id="colors" class="py-10" aria-labelledby="colors-title">
    <div class="mb-6 flex items-baseline gap-3"><h3 id="colors-title" class="text-xl font-semibold tracking-tight">Colors with a purpose</h3></div>
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
    <div class="mb-6 flex items-baseline gap-3"><h3 id="type-title" class="text-xl font-semibold tracking-tight">A clear voice</h3></div>
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
    <div class="mb-6 flex items-baseline gap-3"><h3 id="geometry-title" class="text-xl font-semibold tracking-tight">Space, shape, and depth</h3></div>
    <div class="grid gap-5 xl:grid-cols-2">
      <div class="rounded bg-surface ring-1 ring-inset ring-line p-6"><h4 class="text-sm font-medium">Corner radius <span class="font-normal text-content-muted">2xl default · full controls</span></h4><div class="mt-6 grid grid-cols-3 gap-4"><div v-for="radius in radii" :key="radius" class="min-w-0"><div :class="radius" class="h-16 border border-primary/30 bg-primary-soft"></div><code class="mt-3 block text-xs text-content-muted">{{ radius.replace('rounded-', '') }}</code></div></div></div>
      <div class="rounded bg-surface ring-1 ring-inset ring-line p-6"><h4 class="text-sm font-medium">Elevation</h4><div class="mt-6 grid grid-cols-3 gap-5"><div v-for="shadow in shadows" :key="shadow" class="min-w-0"><div :class="shadow" class="h-16 rounded-md bg-surface ring-1 ring-inset ring-line"></div><code class="mt-3 block text-xs text-content-muted">{{ shadow.replace('shadow-', '') }}</code></div></div></div>
    </div>
    <div class="mt-5 rounded bg-surface ring-1 ring-inset ring-line p-6"><h4 class="text-sm font-medium">Spacing scale <span class="ml-2 font-normal text-content-muted">A 4px base unit</span></h4><div class="mt-6 flex flex-wrap items-end gap-5 sm:gap-7"><div v-for="unit in spacing" :key="unit" class="text-center"><div class="mx-auto w-5 rounded-sm bg-primary" :style="{ height: `calc(var(--sirius-spacing) * ${unit})` }"></div><code class="mt-3 block text-xs text-content-muted">{{ unit }}</code></div></div></div>
  </section>

  <section id="interaction" class="border-t border-line py-10" aria-labelledby="interaction-title">
    <div class="mb-6 flex items-baseline gap-3"><h3 id="interaction-title" class="text-xl font-semibold tracking-tight">Put the tokens to work</h3></div>
    <div class="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
      <div><h4 class="text-lg font-medium">A small interaction study</h4><p class="mt-3 text-sm leading-relaxed text-content-muted">Try the fields, hover the buttons, and navigate with your keyboard. The fields demonstrate native theme styling; the actions use the shared SButton component.</p><div class="mt-6 rounded-lg bg-surface ring-1 ring-inset ring-line p-4 font-mono text-xs leading-loose text-content-muted">bg-surface · text-content<br />rounded · rounded-control<br />bg-primary · text-on-solid</div></div>
      <form class="rounded bg-surface ring-1 ring-inset ring-line p-6 shadow-sm sm:p-8" @submit.prevent="interaction = `Preview saved for ${projectName.trim() || 'your workspace'}.`">
        <label for="project-name" class="block text-sm font-medium">Workspace name</label>
        <input id="project-name" v-model="projectName" maxlength="80" class="mt-2 w-full rounded-control border-0 bg-control px-3 py-1.5 text-sm leading-6 text-control-content shadow-xs ring-1 ring-inset ring-control-line placeholder:text-control-placeholder focus:ring-1 focus:ring-inset focus:ring-control-focus focus:outline-none" />
        <label class="mt-5 flex items-center gap-3 text-sm"><input v-model="notifications" type="checkbox" class="size-4 accent-primary" />Email notifications</label>
        <div class="mt-7 flex flex-wrap gap-3"><SButton type="submit">Save preview</SButton><SButton variant="outline" @click="projectName = 'My workspace'; notifications = true; interaction = 'Preview reset.'">Reset</SButton><SButton disabled>Disabled</SButton></div>
        <p role="status" class="mt-5 min-h-5 text-xs text-content-muted">{{ interaction }}</p>
      </form>
    </div>
  </section>

</template>

<script setup lang="ts">
import { SBadge, SButton, SCard, SField, SSwitch } from '@sirius-ui/vue'
import { Check, Package, Settings2, Users } from '../../../shared/icons'
import DemoIconSelect from '../../../shared/DemoIconSelect.vue'
import DemoPaletteSelect from './DemoPaletteSelect.vue'
const dark = defineModel<boolean>('dark', { required: true })
const background = defineModel<string>('background', { required: true })
const primary = defineModel<string>('primary', { required: true })
const primaryOptions = ['teal', 'emerald', 'cyan', 'indigo', 'pink', 'orange'].map(value => ({ value, label: value[0].toUpperCase() + value.slice(1) }))
const backgroundOptions = ['mist', 'slate', 'stone'].map(value => ({ value, label: value[0].toUpperCase() + value.slice(1) }))
</script>

<template>
  <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
    <SCard>
      <template #header><div class="acme-settings-heading"><h2>Make yourself at home</h2><p>A little color. A different mood. The same familiar workspace.</p></div></template>
      <div class="grid items-start gap-6 sm:grid-cols-2">
        <SField v-slot="{ control }" label="Primary color" description="Your accent, from buttons to little details."><DemoPaletteSelect v-bind="control" v-model="primary" :options="primaryOptions" kind="primary" /></SField>
        <SField v-slot="{ control }" label="Background color" description="The neutral palette behind everything."><DemoPaletteSelect v-bind="control" v-model="background" :options="backgroundOptions" kind="background" /></SField>
        <DemoIconSelect />
        <div class="col-span-full border-t border-line pt-6"><SSwitch v-model="dark" name="darkMode" label="Dark mode" description="A softer light for late nights and quieter moments." /></div>
      </div>
      <template #footer><p class="flex items-start gap-2 text-xs leading-relaxed text-content-muted"><Check aria-hidden="true" class="size-4 shrink-0 text-primary-content" />Appearance changes apply immediately. No need to save.</p></template>
    </SCard>
    <aside aria-label="Live appearance preview" class="space-y-5">
      <SCard bento="top-right">
        <div class="flex items-center justify-between gap-3"><p class="acme-settings-step">A LITTLE PREVIEW</p><SBadge color="success" size="sm">Live</SBadge></div>
        <div aria-hidden="true" class="mt-5 overflow-hidden rounded-2xl border border-line-strong bg-canvas">
          <div class="flex items-center gap-1 border-b border-line px-3 py-3"><span class="size-1.5 rounded-full bg-primary"></span><span class="size-1.5 rounded-full bg-line-strong"></span><span class="size-1.5 rounded-full bg-line-strong"></span><span class="ml-auto text-[9px] text-content-subtle">Your workspace</span></div>
          <div class="grid min-h-40 grid-cols-[3rem_minmax(0,1fr)]">
            <div class="flex flex-col items-center gap-4 border-r border-line py-4"><span class="rounded-lg bg-primary-soft p-1.5 text-primary-content"><Package class="size-3" /></span><Users class="size-3 text-content-muted" /><Settings2 class="size-3 text-content-muted" /></div>
            <div class="space-y-3 p-4"><div class="h-2 w-3/5 rounded-full bg-content/70"></div><div class="h-1.5 w-4/5 rounded-full bg-line-strong"></div><div class="grid grid-cols-2 gap-2"><div class="space-y-2 rounded-lg bg-surface p-3 ring-1 ring-inset ring-line"><div class="size-3 rounded bg-primary/80"></div><div class="h-1.5 w-4/5 rounded bg-line-strong"></div></div><div class="space-y-2 rounded-lg bg-surface p-3 ring-1 ring-inset ring-line"><div class="size-3 rounded bg-primary/40"></div><div class="h-1.5 w-4/5 rounded bg-line-strong"></div></div></div><div class="h-5 w-2/5 rounded-full bg-primary"></div></div>
          </div>
        </div>
        <div class="mt-5 flex items-center justify-between gap-2 text-xs"><span class="capitalize text-content-muted">{{ primary }} + {{ background }}</span><span class="text-content-subtle">{{ dark ? 'Dark' : 'Light' }} appearance</span></div>
      </SCard>
      <SCard><p class="text-sm font-medium">Small details, shared language.</p><p class="mt-2 text-xs leading-relaxed text-content-muted">Icons, inputs and buttons all follow your choices. Try switching sets and watch the whole page change.</p><SButton size="sm" variant="soft" class="mt-4" disabled><template #leading><Check /></template>Example button</SButton></SCard>
    </aside>
  </div>
</template>

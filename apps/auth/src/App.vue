<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watchEffect } from 'vue'
import { SAuthLayout } from '@sirius-ui/auth'
import { SButton, SSelect, SSwitch } from '@sirius-ui/vue'
import AuthDemoForm from './AuthDemoForm.vue'
import { screens } from './screens'
import type { AuthScreen, PreviewState } from './screens'

const screen = shallowRef<AuthScreen>('login')
const variant = shallowRef<'centered' | 'split'>('split')
const dark = shallowRef(false)
const primary = shallowRef('teal')
const previewState = shallowRef<PreviewState>('default')
const current = computed(() => screens.find(item => item.value === screen.value)!)
function readLocation() {
  const destination = window.location.hash.slice(1)
  screen.value = screens.find(item => item.value === destination)?.value ?? 'login'
  previewState.value = 'default'
}
function navigate(value: string) {
  const destination = screens.find(item => item.value === value)?.value
  if (destination) window.location.hash = destination
}
onMounted(() => { readLocation(); window.addEventListener('hashchange', readLocation) })
onBeforeUnmount(() => window.removeEventListener('hashchange', readLocation))
watchEffect(() => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
  document.documentElement.dataset.siriusColor = primary.value
  document.documentElement.dataset.siriusBackground = 'slate'
  document.title = `${current.value.label} · Sirius Auth`
})
</script>

<template>
  <header class="border-b border-line bg-canvas px-5 py-4 sm:px-8">
    <div class="mx-auto flex max-w-[100rem] flex-wrap items-center justify-between gap-4">
      <div><p class="m-0 text-sm font-semibold">Sirius <span class="text-content-muted">UI</span> <span class="ms-2 font-normal text-content-muted">/ Auth</span></p><p class="mt-1 mb-0 text-xs text-content-muted">Template preview · Local interactions</p></div>
      <div role="group" aria-label="Auth preview controls" class="flex flex-wrap items-end gap-3">
        <div class="space-y-1"><label for="auth-screen" class="block text-xs text-content-muted">Screen</label><SSelect id="auth-screen" :model-value="screen" :options="screens" size="sm" class="w-44" @update:model-value="navigate" /></div>
        <div class="space-y-1"><label for="auth-layout" class="block text-xs text-content-muted">Layout</label><SSelect id="auth-layout" :model-value="variant" :options="[{ value: 'centered', label: 'Centered' }, { value: 'split', label: 'Split' }]" size="sm" class="w-28" @update:model-value="variant = $event as 'centered' | 'split'" /></div>
        <div class="space-y-1"><label for="auth-state" class="block text-xs text-content-muted">State</label><SSelect id="auth-state" :model-value="previewState" :options="[{ value: 'default', label: 'Default' }, { value: 'error', label: 'Error' }, { value: 'processing', label: 'Submitting' }, { value: 'success', label: 'Success' }]" size="sm" class="w-32" @update:model-value="previewState = $event as PreviewState" /></div>
        <div class="space-y-1"><label for="auth-accent" class="block text-xs text-content-muted">Accent</label><SSelect id="auth-accent" v-model="primary" :options="['teal', 'emerald', 'cyan', 'indigo', 'pink', 'orange'].map(value => ({ value, label: value }))" size="sm" class="w-28" /></div>
        <SSwitch v-model="dark" label="Dark" class="self-center" />
      </div>
    </div>
  </header>
  <SAuthLayout :title="current.title" :description="current.description" :variant="variant" style="--sirius-auth-min-height: calc(100dvh - 6rem)">
    <template #brand><a href="#login" class="inline-flex items-center gap-3 text-content no-underline"><span aria-hidden="true" class="auth-logo block size-10 bg-primary"></span><span class="text-lg font-semibold tracking-tight">Acme<span class="ms-2 text-sm font-normal text-content-muted">workspace</span></span></a></template>
    <AuthDemoForm :key="screen" :screen="screen" :state="previewState" />
    <template #aside>
      <p class="mb-5 text-xs font-medium tracking-widest uppercase">A little room for big ideas</p>
      <h2 class="m-0 max-w-md text-5xl leading-tight font-semibold tracking-tight xl:text-6xl">Good work starts together.</h2>
      <p class="mt-6 max-w-sm text-base leading-7">Your people, your projects, your next chapter. All in one familiar place.</p>
      <div class="mt-12 flex items-center gap-3 border-t border-current/15 pt-6"><span aria-hidden="true" class="auth-logo block size-8 shrink-0 bg-current"></span><span class="text-sm font-medium">A workspace that feels like yours.</span></div>
    </template>
    <template #footer><span>Acme · Auth template preview</span><SButton href="http://127.0.0.1:5180" variant="ghost" size="sm" class="mt-2">Explore the dashboard</SButton></template>
  </SAuthLayout>
</template>

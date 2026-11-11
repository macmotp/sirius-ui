<script setup lang="ts">
import { useId } from 'vue'
import type { SAuthLayoutProps } from '../auth.types'

withDefaults(defineProps<SAuthLayoutProps>(), { variant: 'centered' })
defineSlots<{ brand?(): unknown; default?(): unknown; aside?(): unknown; footer?(): unknown }>()
const headingId = useId()
</script>

<template>
  <div class="grid min-h-[var(--sirius-auth-min-height,100dvh)] bg-canvas font-sans text-content" :class="{ 'lg:grid-cols-2': variant === 'split' }">
    <main :aria-labelledby="headingId" class="flex min-w-0 flex-col items-center justify-center px-6 py-12 sm:px-10 sm:py-16">
      <div class="w-full max-w-sm">
        <div v-if="$slots.brand" class="mb-10"><slot name="brand" /></div>
        <h1 :id="headingId" class="m-0 text-3xl font-semibold tracking-tight sm:text-4xl">{{ title }}</h1>
        <p v-if="description" class="mt-3 mb-0 text-sm leading-6 text-content-muted">{{ description }}</p>
        <div class="mt-8"><slot /></div>
        <div v-if="$slots.footer" class="mt-8 text-center text-xs leading-5 text-content-muted"><slot name="footer" /></div>
      </div>
    </main>
    <aside v-if="variant === 'split'" :aria-label="$slots.aside ? 'About this workspace' : undefined" :aria-hidden="!$slots.aside || undefined" class="relative m-4 hidden min-w-0 overflow-hidden rounded-2xl bg-primary-soft text-primary-content lg:flex lg:items-end lg:p-12 xl:p-16">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-28 -right-28 size-[38rem] rounded-full border border-current opacity-15"></div>
        <div class="absolute -top-12 -right-12 size-[30rem] rounded-full border border-current opacity-15"></div>
        <div class="absolute top-4 right-4 size-[22rem] rounded-full border border-current opacity-15"></div>
        <div class="absolute top-20 right-20 size-56 rounded-full bg-primary opacity-20"></div>
      </div>
      <div class="relative w-full"><slot name="aside" /></div>
    </aside>
  </div>
</template>

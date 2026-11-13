<script setup lang="ts">
import { shallowRef } from 'vue'
import { SCard, SCopyButton, SField, SInput } from '@sirius-ui/vue'
const text = shallowRef('studio@acme.example')
const sample = 'yarn add @sirius-ui/vue@alpha'
</script>

<template>
  <section aria-labelledby="copy-title" class="mb-12">
    <h2 id="copy-title" class="mb-3 text-xl font-semibold tracking-tight">Copy to clipboard</h2>
    <p class="mb-5 text-sm text-content-muted">Copy a value or a code snippet. The button confirms completion and offers manual-copy guidance if the browser blocks access.</p>
    <SCard><div class="flex flex-wrap items-end gap-4"><SField v-slot="{ control }" label="Text to copy" class="min-w-0 flex-1"><SInput v-bind="control" v-model="text" /></SField><SCopyButton :text="text" label="Copy address" copied-label="Address copied" variant="outline" /></div><div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-muted p-4"><code class="min-w-0 text-sm wrap-anywhere">{{ sample }}</code><SCopyButton :text="sample" /></div><div class="mt-5"><SCopyButton :text="sample" disabled label="Copy disabled" /></div></SCard>
  </section>
</template>

<script setup lang="ts">
import { SCombobox } from '@sirius-ui/vue'
import type { SComboboxOption } from '@sirius-ui/vue'
defineProps<{ options: SComboboxOption[]; kind: 'primary' | 'background' }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <SCombobox v-model="model" :options="options">
    <template #leading="{ option }"><span v-if="option" aria-hidden="true" :data-sirius-color="kind === 'primary' ? option.value : undefined" :data-sirius-background="kind === 'background' ? option.value : undefined" class="block size-3.5 shrink-0 rounded-full ring-1 ring-inset ring-line" :style="{ backgroundColor: kind === 'primary' ? 'var(--sirius-brand-400)' : 'var(--sirius-neutral-400)' }"></span></template>
    <template #option="{ option }"><span class="flex items-center gap-3"><span aria-hidden="true" :data-sirius-color="kind === 'primary' ? option.value : undefined" :data-sirius-background="kind === 'background' ? option.value : undefined" class="block size-3.5 shrink-0 rounded-full ring-1 ring-inset ring-line" :style="{ backgroundColor: kind === 'primary' ? 'var(--sirius-brand-400)' : 'var(--sirius-neutral-400)' }"></span>{{ option.label }}</span></template>
  </SCombobox>
</template>

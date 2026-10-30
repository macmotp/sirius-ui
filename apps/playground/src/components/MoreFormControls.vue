<script setup lang="ts">
import { computed, ref } from 'vue'
import { SField, SForm, SSelect, STextarea } from '@sirius-ui/vue'
import type { SSelectOption, STextareaResize, STextareaSize } from '@sirius-ui/vue'

const size = ref<STextareaSize>('md')
const rows = ref(3)
const resize = ref<STextareaResize>('vertical')
const disabled = ref(false)
const readonly = ref(false)
const valid = ref(false)
const invalid = ref(false)
const notes = ref('')
const selection = ref('')
const sizes: STextareaSize[] = ['sm', 'md', 'lg']
const resizeModes: STextareaResize[] = ['none', 'vertical', 'horizontal', 'both']
const options: SSelectOption[] = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'operations', label: 'Operations — a longer option label to check narrow layouts' },
  { value: 'archived', label: 'Archived team (unavailable)', disabled: true },
]
const example = computed(() => `<SField v-slot="{ control }" label="Notes"${invalid.value ? ' error="Please check this value."' : ''}>\n  <STextarea v-bind="control" v-model="notes" size="${size.value}" :rows="${rows.value}" resize="${resize.value}"${disabled.value ? ' disabled' : ''}${readonly.value ? ' readonly' : ''}${valid.value ? ' valid' : ''} />\n</SField>\n<SField v-slot="{ control }" label="Department">\n  <SSelect v-bind="control" v-model="department" :options="options" placeholder="Choose a department" />\n</SField>`)
</script>

<template>
  <div class="relative mt-5 overflow-hidden rounded bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line">
    <div class="p-5 sm:p-7">
      <h4 class="text-sm font-semibold">Textarea and select, the same treatment</h4>
      <p class="mt-2 max-w-2xl text-xs leading-relaxed text-content-muted">The same fills, sizes, shadow, and rings as SInput. Textareas use roomier corners for multiple lines; selects keep the native menu and keyboard behavior.</p>
      <fieldset class="mt-6">
        <legend class="text-sm font-medium">Explore the controls</legend>
        <div class="mt-4 flex flex-wrap items-end gap-4">
          <div class="w-40 min-w-0 text-xs text-content-muted"><label for="extra-control-size">Control size</label><SSelect id="extra-control-size" :model-value="size" :options="sizes.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="size = $event as STextareaSize" /></div>
          <div class="w-40 min-w-0 text-xs text-content-muted"><label for="extra-control-rows">Textarea rows</label><SSelect id="extra-control-rows" :model-value="String(rows)" :options="[2, 3, 5, 8].map(value => ({ value: String(value), label: String(value) }))" class="mt-2" @update:model-value="rows = Number($event)" /></div>
          <div class="w-40 min-w-0 text-xs text-content-muted"><label for="extra-control-resize">Textarea resize</label><SSelect id="extra-control-resize" :model-value="resize" :options="resizeModes.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="resize = $event as STextareaResize" /></div>
        </div>
        <div class="mt-4 flex flex-wrap gap-4 text-sm">
          <label class="flex items-center gap-2"><input v-model="disabled" type="checkbox" class="accent-primary" />Controls disabled</label>
          <label class="flex items-center gap-2"><input v-model="readonly" type="checkbox" class="accent-primary" />Textarea readonly</label>
          <label class="flex items-center gap-2"><input v-model="valid" type="checkbox" class="accent-primary" />Controls valid</label>
          <label class="flex items-center gap-2"><input v-model="invalid" type="checkbox" class="accent-primary" />Controls invalid</label>
        </div>
      </fieldset>
      <SForm :columns="2" class="mt-7" aria-label="Textarea and select demo" @submit.prevent>
        <SField v-slot="{ control }" label="Notes" description="Write multiple lines. Drag the corner when resizing is enabled." :error="invalid ? 'Please check these notes.' : undefined"><STextarea v-bind="control" v-model="notes" :size="size" :rows="rows" :resize="resize" :disabled="disabled" :readonly="readonly" :valid="valid" placeholder="Add a note for your team…" maxlength="500" /></SField>
        <SField v-slot="{ control }" label="Team selection" description="Archived team is disabled. Use the arrows to choose an available team." :error="invalid ? 'Please check your team selection.' : undefined"><SSelect v-bind="control" v-model="selection" :options="options" :size="size" :disabled="disabled" :valid="valid" placeholder="Choose a team" /></SField>
        <p class="col-span-full break-words font-mono text-xs text-content-muted">Notes: {{ notes.length }} / 500 characters · Team: {{ selection || '(none)' }}</p>
      </SForm>
    </div>
    <pre class="overflow-x-auto border-t border-line bg-canvas p-5 font-mono text-xs leading-relaxed text-content-muted sm:p-7"><code>{{ example }}</code></pre>
  </div>

  <div class="mt-5 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
    <h4 class="mb-6 text-sm font-semibold">Sizes side by side</h4>
    <div class="grid min-w-0 gap-6 xl:grid-cols-3">
      <div v-for="item in sizes" :key="item" class="min-w-0 space-y-5">
        <SField v-slot="{ control }" :label="`${item.toUpperCase()} textarea`"><STextarea v-bind="control" :size="item" :rows="2" placeholder="Write a few lines…" /></SField>
        <SField v-slot="{ control }" :label="`${item.toUpperCase()} select`"><SSelect v-bind="control" :size="item" :options="options" placeholder="Choose a team" /></SField>
      </div>
    </div>
  </div>
</template>

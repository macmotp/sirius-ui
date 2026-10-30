<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SBadge, SButton, SCard, SCheckbox, SField, SFileUpload, SGrid } from '@sirius-ui/vue'
import type { SFileUploadRejection } from '@sirius-ui/vue'

const files = shallowRef<File[]>([])
const avatar = shallowRef<File[]>([])
const disabled = shallowRef(false)
const rejections = shallowRef<SFileUploadRejection[]>([])
const summary = shallowRef('Files stay in your browser. This demo does not upload anything.')
const errors = computed(() => rejections.value.map(({ file, reason }) => `${file.name}: ${reason === 'type' ? 'choose a PNG, JPG, or PDF' : reason === 'size' ? 'larger than 5 MB' : reason === 'count' ? 'maximum 3 files' : 'already selected'}.`).join(' '))
function prepare() {
  const data = new FormData()
  files.value.forEach(file => data.append('attachments[]', file))
  summary.value = `FormData prepared locally with ${data.getAll('attachments[]').length} attachment(s). Your app chooses the endpoint.`
}
</script>

<template>
  <section id="file-uploads" class="border-t border-line py-10" aria-labelledby="file-uploads-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="file-uploads-title" class="text-xl font-semibold tracking-tight">Pick, drop, and attach</h3><SBadge>SFileUpload</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Choose files with the native picker or drop them here. Selection is separate from uploading: your app handles requests, progress, stored media, and server validation.</p>
    <SGrid :columns="2">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Multiple attachments</h4></template>
        <SCheckbox v-model="disabled" label="Disable attachments" class="mb-5" />
        <SField label="Project attachments" description="PNG, JPG, or PDF · Up to 3 files · 5 MB per file" :error="errors">
          <template #default="{ control }"><SFileUpload v-bind="control" v-model="files" label="Add project attachments" description="Drop files here, or browse your device." accept=".png,.jpg,.jpeg,.pdf" multiple :max-files="3" :max-size="5 * 1024 * 1024" :disabled="disabled" @reject="rejections = $event" @update:model-value="rejections = []" /></template>
        </SField>
        <div class="mt-5 flex flex-wrap gap-3"><SButton size="sm" :disabled="!files.length || disabled" @click="prepare">Prepare FormData</SButton><SButton size="sm" variant="ghost" :disabled="!files.length || disabled" @click="files = []; rejections = []">Clear selection</SButton></div>
        <p role="status" class="mt-4 text-xs leading-relaxed text-content-muted">{{ summary }}</p>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">One image, with a required field</h4></template>
        <form class="space-y-5" @submit.prevent="summary = 'Required image is ready. No request was sent.'" @reset="avatar = []">
          <SFileUpload v-model="avatar" label="Profile image" description="Choose a PNG or JPG. A new image replaces the current selection." accept=".png,.jpg,.jpeg" name="avatar" required browse-label="Choose image" />
          <div class="flex flex-wrap gap-3"><SButton type="submit" size="sm" variant="outline">Check required field</SButton><SButton type="reset" size="sm" variant="ghost">Reset</SButton></div>
        </form>
      </SCard>
    </SGrid>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SFileUpload v-model="files" label="Attachments" multiple /&gt;

const data = new FormData()
files.forEach(file =&gt; data.append('attachments[]', file))
// Send data using your application's API or Inertia form.</code></pre>
  </section>
</template>

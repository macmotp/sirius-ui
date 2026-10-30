<script setup lang="ts">
import { shallowRef } from 'vue'
import { SBadge, SButton, SCard, SProgress } from '@sirius-ui/vue'

const value = shallowRef(35)
const message = shallowRef('Export demonstration ready.')
function advance() {
  value.value = Math.min(100, value.value + 15)
  message.value = value.value === 100 ? 'Export complete.' : `Export ${value.value}% complete.`
}
function reset() { value.value = 0; message.value = 'Export reset.' }
</script>

<template>
  <section id="progress" class="border-t border-line py-10" aria-labelledby="progress-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3">
      <h3 id="progress-title" class="text-xl font-semibold">Keep progress in sight</h3>
      <SBadge>SProgress</SBadge>
    </div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Show a known amount of work, or an indeterminate indicator while the total is unknown. Your application supplies the values and completion message.</p>
    <SCard>
      <SProgress label="Preparing export" :value="value" :color="value === 100 ? 'success' : 'primary'" show-value />
      <div class="mt-5 flex flex-wrap gap-3">
        <SButton size="sm" :disabled="value === 100" @click="advance">Advance export demo</SButton>
        <SButton size="sm" variant="outline" @click="reset">Reset export demo</SButton>
      </div>
      <p role="status" class="mt-3 text-xs text-content-muted">{{ message }}</p>
    </SCard>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      <SCard><div class="space-y-5">
        <SProgress label="Connecting to your workspace" show-value />
        <SProgress label="Upload queue" :value="3" :max="8" value-text="3 of 8 files uploaded" show-value />
      </div></SCard>
      <SCard><div class="space-y-5">
        <SProgress label="Small — validated" color="success" size="sm" :value="100" />
        <SProgress label="Medium — storage nearing its limit" color="warning" :value="75" />
        <SProgress label="Large — task needs attention" color="danger" size="lg" :value="45" />
      </div></SCard>
    </div>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SProgress label="Uploading files" :value="uploaded" :max="total" show-value /&gt;
&lt;SProgress label="Preparing export" /&gt;</code></pre>
  </section>
</template>

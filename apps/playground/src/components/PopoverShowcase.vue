<script setup lang="ts">
import { shallowRef } from 'vue'
import { Settings2 } from '@lucide/vue'
import { SButton, SCard, SPopover, SSwitch } from '@sirius-ui/vue'

const open = shallowRef(false)
const email = shallowRef(true)
const activity = shallowRef(false)
const saved = shallowRef('Preferences have not been saved yet.')
function save(close: () => void) {
  saved.value = `Saved locally: email ${email.value ? 'on' : 'off'}, activity ${activity.value ? 'on' : 'off'}.`
  close()
}
</script>

<template>
  <SCard class="mt-6">
    <template #header><h4 class="text-sm font-semibold">SPopover · Interactive context</h4></template>
    <p class="mb-5 max-w-xl text-sm leading-relaxed text-content-muted">Use a popover for a small form, links, or controls. It opens on click and closes with Escape, its close button, or an interaction outside.</p>
    <SPopover v-model:open="open" title="Notifications" description="Choose which updates you receive.">
      <template #trigger="{ trigger }"><SButton v-bind="trigger" variant="outline"><template #leading><Settings2 /></template>Notification preferences</SButton></template>
      <template #default="{ close }">
        <form class="space-y-5" @submit.prevent="save(close)">
          <SSwitch v-model="email" label="Email digest" />
          <SSwitch v-model="activity" label="Workspace activity" />
          <SButton type="submit" size="sm" full-width>Save preferences</SButton>
        </form>
      </template>
    </SPopover>
    <p role="status" class="mt-4 text-xs text-content-muted">{{ saved }}</p>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SPopover title="Notifications"&gt;
  &lt;template #trigger="{ trigger }"&gt;
    &lt;SButton v-bind="trigger"&gt;Preferences&lt;/SButton&gt;
  &lt;/template&gt;
  &lt;template #default="{ close }"&gt;
    &lt;!-- Interactive content; call close() when done. --&gt;
  &lt;/template&gt;
&lt;/SPopover&gt;</code></pre>
  </SCard>
</template>

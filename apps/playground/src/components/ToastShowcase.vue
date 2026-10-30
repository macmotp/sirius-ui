<script setup lang="ts">
import { nextTick, shallowRef, useTemplateRef } from 'vue'
import { SBadge, SButton, SCard, SSelect, SToast, SToaster, useToasts } from '@sirius-ui/vue'
import type { SToasterProps } from '@sirius-ui/vue'

const { items, notify, dismiss, clear } = useToasts()
const position = shallowRef<NonNullable<SToasterProps['position']>>('bottom-right')
const actionTrigger = useTemplateRef<InstanceType<typeof SButton>>('actionTrigger')
const actionMessage = shallowRef('No notification action yet.')
function showSuccess() { notify({ title: 'Changes saved', description: 'Your workspace is up to date.', color: 'success' }) }
function showError() { notify({ title: 'Unable to save changes', description: 'This persistent demo message stays until dismissed.', color: 'danger', duration: 0 }) }
function showAction() { notify({ title: 'Demo item archived', description: 'Undo is available in this local example.', color: 'primary', duration: 0 }) }
async function undo(id: string) {
  dismiss(id)
  actionMessage.value = 'Archive undone locally. No data was changed.'
  await nextTick()
  actionTrigger.value?.$el.focus()
}
</script>

<template>
  <section id="toasts" class="border-t border-line py-10" aria-labelledby="toasts-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3">
      <h3 id="toasts-title" class="text-xl font-semibold">A quick update, within reach</h3>
      <SBadge>SToast · SToaster</SBadge>
    </div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Brief feedback without interrupting your work. Timed messages pause while hovered, focused, or while the page is in the background. Persistent messages keep actions available.</p>
    <SCard>
      <div class="flex flex-wrap items-center gap-3">
        <label for="toast-position" class="text-sm font-medium">Notification position</label>
        <SSelect id="toast-position" :model-value="position" :options="['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(value => ({ value, label: value }))" @update:model-value="position = $event as typeof position" />
        <SButton @click="showSuccess">Show saved notification</SButton>
        <SButton variant="outline" @click="showError">Show persistent error</SButton>
        <SButton ref="actionTrigger" variant="outline" @click="showAction">Show notification with Undo</SButton>
        <SButton variant="ghost" :disabled="!items.length" @click="clear">Clear notifications</SButton>
      </div>
      <p class="mt-4 text-xs text-content-muted">{{ items.length }} visible notifications · Successful saves close after five seconds.</p>
      <p role="status" class="mt-2 text-xs text-content-muted">{{ actionMessage }}</p>
    </SCard>
    <h4 class="mb-4 mt-8 text-sm font-semibold">An inline, persistent notification</h4>
    <SToast title="A little context" description="Notifications can also be placed inline. This example does not auto-dismiss." :duration="0" class="max-w-sm" />
    <SToaster :toasts="items" :position="position" @dismiss="dismiss">
      <template #actions="{ toast }">
        <SButton v-if="toast.title === 'Demo item archived'" size="sm" variant="outline" @click="undo(toast.id)">Undo archive</SButton>
      </template>
    </SToaster>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>const { items, notify, dismiss } = useToasts()
notify({ title: 'Changes saved', color: 'success' })

&lt;SToaster :toasts="items" @dismiss="dismiss" /&gt;</code></pre>
  </section>
</template>

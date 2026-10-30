<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { SAlert, SBadge, SButton, SCard, SCheckbox, SDialog, SField, SForm, SGrid, SInput, SSelect, STextarea } from '@sirius-ui/vue'
import type { SDialogDismissReason, SDialogSize } from '@sirius-ui/vue'

const preview = ref(false)
const size = ref<SDialogSize>('md')
const backdrop = ref(true)
const escape = ref(true)
const lastDismiss = ref('No dismissal yet.')
const confirm = ref(false)
const confirmed = ref(false)
const profile = ref(false)
const name = ref('')
const notes = ref('')
const error = ref('')
const savedName = ref('')
const longContent = ref(false)
function dismissed(reason: SDialogDismissReason) { lastDismiss.value = `Dismissed via ${reason}.` }
async function save() {
  error.value = name.value.trim() ? '' : 'Enter a workspace name.'
  if (error.value) {
    await nextTick()
    document.getElementById('dialog-workspace-name')?.focus()
    return
  }
  savedName.value = name.value.trim()
  profile.value = false
}
</script>

<template>
  <section id="dialogs" class="border-t border-line py-10" aria-labelledby="dialogs-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="dialogs-title" class="text-xl font-semibold tracking-tight">Dialogs that keep you focused</h3><SBadge>SDialog</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Native modal dialogs for a focused task. The browser contains keyboard focus, makes the rest of the page inert, and returns focus when the dialog closes.</p>
    <SCard>
      <template #header><h4 class="text-sm font-semibold">Explore dialog behavior</h4></template>
      <div class="flex flex-wrap items-center gap-5">
        <div class="flex items-center gap-3"><label for="dialog-size" class="text-sm font-medium">Dialog size</label><SSelect id="dialog-size" :model-value="size" :options="['sm', 'md', 'lg', 'xl'].map(value => ({ value, label: value }))" @update:model-value="size = $event as SDialogSize" /></div>
        <SCheckbox v-model="backdrop" label="Close on backdrop" />
        <SCheckbox v-model="escape" label="Close on Escape" />
        <SButton @click="preview = true">Open dialog preview</SButton>
      </div>
      <p class="mt-5 text-xs text-content-muted">{{ lastDismiss }}</p>
    </SCard>
    <SDialog v-model:open="preview" title="A little room to focus" description="A focused task, with a clear way back to your workspace." :size="size" :close-on-backdrop="backdrop" :close-on-escape="escape" @dismiss="dismissed">
      <p>Try Tab and Shift+Tab, then close with the button, Escape, or the backdrop. A drag that starts inside the dialog will not dismiss it when released outside.</p>
      <template #footer><SButton variant="outline" @click="preview = false">Done</SButton></template>
    </SDialog>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SDialog v-model:open="open" title="Workspace settings" size="{{ size }}"&gt;
  Your content goes here.
  &lt;template #footer&gt;
    &lt;SButton @click="open = false"&gt;Done&lt;/SButton&gt;
  &lt;/template&gt;
&lt;/SDialog&gt;</code></pre>
    <SGrid :columns="3" class="mt-6">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Confirm an action</h4></template>
        <p class="text-sm leading-relaxed text-content-muted">Give people context and a safe default before an action.</p>
        <template #footer><SButton variant="outline" @click="confirm = true">Review archive demo</SButton><p v-if="confirmed" role="status" class="text-xs text-success-content">Demo archived. No data changed.</p></template>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Edit a short form</h4></template>
        <p class="text-sm leading-relaxed text-content-muted">Autofocus an input and keep validation inside the dialog.</p>
        <template #footer><SButton variant="outline" @click="error = ''; profile = true">Edit workspace demo</SButton><p v-if="savedName" role="status" class="break-words text-xs text-success-content">Saved locally: {{ savedName }}</p></template>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Read longer content</h4></template>
        <p class="text-sm leading-relaxed text-content-muted">Long content scrolls within the viewport on small screens.</p>
        <template #footer><SButton variant="outline" @click="longContent = true">Open long content</SButton></template>
      </SCard>
    </SGrid>
    <SDialog v-model:open="confirm" title="Archive this demo workspace?" description="This is a local example. No workspace or data will be changed." size="sm" :close-on-backdrop="false">
      <p>In your application, explain what the action does and how someone can recover their work.</p>
      <template #footer><SButton variant="outline" autofocus @click="confirm = false">Keep workspace</SButton><SButton color="danger" @click="confirmed = true; confirm = false">Archive demo</SButton></template>
    </SDialog>
    <SDialog v-model:open="profile" title="Edit workspace" description="Changes are kept only in this playground." :close-on-backdrop="false">
      <SForm id="dialog-workspace-form" novalidate @submit.prevent="save">
        <SField v-slot="{ control }" id="dialog-workspace-name" label="Workspace name" :error="error" required><SInput v-bind="control" v-model="name" autofocus maxlength="80" /></SField>
        <SField v-slot="{ control }" label="Notes" description="Optional notes for your team."><STextarea v-bind="control" v-model="notes" :rows="3" maxlength="500" /></SField>
      </SForm>
      <template #footer><SButton variant="outline" @click="profile = false">Cancel</SButton><SButton type="submit" form="dialog-workspace-form">Save workspace</SButton></template>
    </SDialog>
    <SDialog v-model:open="longContent" title="A guide to your workspace" size="lg">
      <div class="space-y-6"><div v-for="index in 12" :key="index"><h4 class="text-sm font-semibold">{{ index }}. Make room for your team</h4><p class="mt-2 text-content-muted">Keep related work together, use clear names, and choose the right access for each person. This longer example demonstrates scrolling without pushing the dialog beyond the screen.</p></div><SAlert :icon="false">You have reached the end of the demo guide.</SAlert></div>
      <template #footer><SButton @click="longContent = false">Close guide</SButton></template>
    </SDialog>
  </section>
</template>

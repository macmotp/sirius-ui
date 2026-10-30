<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Bell } from '@lucide/vue'
import { SAlert, SBadge, SButton, SCard, SCheckbox, SGrid, SInput, SSelect } from '@sirius-ui/vue'
import type { SAlertColor, SAlertVariant } from '@sirius-ui/vue'

const color = ref<SAlertColor>('primary')
const variant = ref<SAlertVariant>('soft')
const title = ref('A little information')
const icon = ref(true)
const dismissible = ref(true)
const open = ref(true)
const dismissCount = ref(0)
const reopenButton = ref<InstanceType<typeof SButton> | null>(null)
async function onDismiss() {
  dismissCount.value++
  await nextTick()
  reopenButton.value?.$el.focus()
}
const urgent = ref(false)
const saved = ref(false)
const statuses = [
  { color: 'primary', title: 'A new update is available', text: 'Refresh your workspace when you are ready to get the latest changes.' },
  { color: 'success', title: 'Your changes are saved', text: 'Everything is up to date. You can continue working.' },
  { color: 'warning', title: 'Review your storage', text: 'Your workspace is getting close to its storage limit.' },
  { color: 'danger', title: 'We could not save your changes', text: 'Check your connection and try again. Your draft is still available.' },
] satisfies { color: SAlertColor; title: string; text: string }[]
</script>

<template>
  <section id="alerts" class="border-t border-line py-10" aria-labelledby="alerts-title">
    <div class="mb-6 flex items-baseline gap-3"><h3 id="alerts-title" class="text-xl font-semibold tracking-tight">Messages that help you move forward</h3><SBadge>SAlert</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Four theme colors, three treatments, and optional icons, titles, actions, and dismissal. Use a polite status for routine updates and an alert for urgent messages.</p>
    <SCard>
      <template #header><h4 class="text-sm font-semibold">Build an alert</h4></template>
      <SGrid :columns="3">
        <div><label for="alert-color" class="mb-2 block text-sm font-medium">Alert color</label><SSelect id="alert-color" :model-value="color" :options="statuses.map(item => ({ value: item.color, label: item.color }))" @update:model-value="color = $event as SAlertColor" /></div>
        <div><label for="alert-variant" class="mb-2 block text-sm font-medium">Alert treatment</label><SSelect id="alert-variant" :model-value="variant" :options="['soft', 'solid', 'outline'].map(value => ({ value, label: value }))" @update:model-value="variant = $event as SAlertVariant" /></div>
        <div><label for="alert-title" class="mb-2 block text-sm font-medium">Alert title</label><SInput id="alert-title" v-model="title" /></div>
      </SGrid>
      <div class="my-6 flex flex-wrap gap-5"><SCheckbox v-model="icon" label="Show alert icon" /><SCheckbox v-model="dismissible" label="Allow dismissal" /><SCheckbox v-model="urgent" label="Urgent announcement" /></div>
      <SAlert v-model:open="open" :color="color" :variant="variant" :title="title" :icon="icon" :dismissible="dismissible" :role="urgent ? 'alert' : 'status'" dismiss-label="Dismiss preview alert" @dismiss="onDismiss">This message wraps naturally on small screens and follows your selected theme.</SAlert>
      <div class="mt-5 flex flex-wrap items-center gap-3"><SButton ref="reopenButton" variant="outline" size="sm" :disabled="open" @click="open = true">Show alert again</SButton><p class="text-xs text-content-muted">{{ open ? 'Visible' : 'Dismissed' }} · {{ dismissCount }} dismiss events</p></div>
    </SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SAlert v-model:open="open" color="{{ color }}" variant="{{ variant }}"
  title="Your changes are saved" dismissible @dismiss="onDismiss"&gt;
  You can continue working.
&lt;/SAlert&gt;</code></pre>

    <h4 class="mt-10 mb-5 text-lg font-medium">Every color, with a clear message</h4>
    <SGrid :columns="2"><SAlert v-for="item in statuses" :key="item.color" :color="item.color" :title="item.title">{{ item.text }}</SAlert></SGrid>

    <h4 class="mt-10 mb-5 text-lg font-medium">Actions and flexible content</h4>
    <SGrid :columns="2">
      <SAlert title="Keep your workspace informed">
        <template #icon><Bell /></template>
        <p>Choose who receives a notification when you publish an update.</p>
        <template #actions><SButton href="#choices" size="sm" variant="outline">Notification settings</SButton></template>
      </SAlert>
      <SAlert color="warning" variant="outline" :icon="false">
        <template #title>Before you publish <SBadge color="warning" class="ml-2">2 checks</SBadge></template>
        <ul class="list-disc space-y-1 pl-5"><li>Review your title and description.</li><li>Confirm that your audience can access the content.</li></ul>
      </SAlert>
    </SGrid>
    <SCard class="mt-6">
      <template #header><h4 class="text-sm font-semibold">Announce an update</h4></template>
      <SButton size="sm" @click="saved = !saved">{{ saved ? 'Reset update' : 'Save demo changes' }}</SButton>
      <SAlert color="success" :title="saved ? 'Demo changes saved' : undefined" :icon="saved" :class="saved ? 'mt-4' : 'sr-only'"><span v-if="saved">The message updates inside an existing polite live region. No data was sent.</span></SAlert>
      <p class="mt-3 text-xs leading-relaxed text-content-muted">Dismissal updates v-model:open and emits dismiss. Your application can restore the message and manage focus after dismissal.</p>
    </SCard>
  </section>
</template>

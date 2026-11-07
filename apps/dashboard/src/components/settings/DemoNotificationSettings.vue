<script setup lang="ts">
import { computed } from 'vue'
import { SBadge, SCard, SSwitch } from '@sirius-ui/vue'
import { Bell, Mail } from '../../../../shared/icons'
import type { NotificationSettings } from '../../composables/useDemoSettings'
const notifications = defineModel<NotificationSettings>({ required: true })
const preferences: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: 'orders', label: 'Order activity', description: 'New orders, dispatch updates and cancellations.' },
  { key: 'mentions', label: 'Mentions & replies', description: 'When someone mentions you or replies to your work.' },
  { key: 'digest', label: 'Weekly digest', description: 'A Monday recap of the numbers and moments that matter.' },
  { key: 'product', label: 'Product news', description: 'Occasional news about new features and improvements.' },
]
const enabled = computed(() => Object.values(notifications.value).filter(Boolean).length)
function update(key: keyof NotificationSettings, value: boolean) { notifications.value = { ...notifications.value, [key]: value } }
</script>

<template>
  <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
    <SCard>
      <template #header><div class="acme-settings-heading"><h2>A little less noise</h2><p>Stay close to the things that matter. Let the rest wait.</p></div></template>
      <div class="mb-2 flex items-center justify-between gap-3 border-b border-line pb-5"><span class="flex items-center gap-2 text-sm font-medium"><Mail aria-hidden="true" class="size-4 text-content-muted" />Email notifications</span><SBadge size="sm">{{ enabled }} of 4 enabled</SBadge></div>
      <div class="divide-y divide-line"><div v-for="preference in preferences" :key="preference.key" class="py-5 last:pb-0"><SSwitch :model-value="notifications[preference.key]" :label="preference.label" :description="preference.description" :name="preference.key" @update:model-value="update(preference.key, $event)" /></div></div>
    </SCard>
    <aside aria-label="Notification guidance" class="space-y-5"><SCard bento="top-right"><span class="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary-content"><Bell aria-hidden="true" class="size-5" /></span><h3 class="mt-5 text-lg font-semibold">Find your rhythm</h3><p class="mt-3 text-sm leading-relaxed text-content-muted">Choose individual updates for a closer look, or a weekly digest for the bigger picture.</p><p class="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-content-muted">Essential account and security messages would always stay on.</p></SCard><p class="px-2 text-xs leading-relaxed text-content-subtle">This demo saves your choices for the session. It won’t send any emails.</p></aside>
  </div>
</template>

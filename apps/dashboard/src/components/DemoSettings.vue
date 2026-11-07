<script setup lang="ts">
import { computed, nextTick, useId, useTemplateRef } from 'vue'
import { SAlert, SButton, SForm, STabs } from '@sirius-ui/vue'
import { Bell, Building2, Check, Settings2, UserRound } from '../../../shared/icons'
import DemoAppearance from './DemoAppearance.vue'
import DemoProfileSettings from './settings/DemoProfileSettings.vue'
import DemoWorkspaceSettings from './settings/DemoWorkspaceSettings.vue'
import DemoNotificationSettings from './settings/DemoNotificationSettings.vue'
import type { ProfileSettings, WorkspaceSettings, NotificationSettings, SettingsErrors } from '../composables/useDemoSettings'

const props = defineProps<{ dirty: boolean; errors: SettingsErrors }>()
const emit = defineEmits<{ save: []; discard: [] }>()
const profile = defineModel<ProfileSettings>('profile', { required: true })
const workspace = defineModel<WorkspaceSettings>('workspace', { required: true })
const notifications = defineModel<NotificationSettings>('notifications', { required: true })
const tab = defineModel<string>('tab', { required: true })
const primary = defineModel<string>('primary', { required: true })
const background = defineModel<string>('background', { required: true })
const dark = defineModel<boolean>('dark', { required: true })
const formId = useId()
const root = useTemplateRef<HTMLDivElement>('root')
const status = useTemplateRef<HTMLParagraphElement>('status')
const tabs = [
  { value: 'profile', label: 'Profile', icon: UserRound },
  { value: 'workspace', label: 'Workspace', icon: Building2 },
  { value: 'appearance', label: 'Appearance', icon: Settings2 },
  { value: 'notifications', label: 'Notifications', icon: Bell },
]
const errorMessages = computed(() => [...Object.values(props.errors.profile), ...Object.values(props.errors.workspace)])
async function submit() {
  emit('save')
  await nextTick()
  const invalid = root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')
  if (invalid) invalid.focus()
  else status.value?.focus()
}
async function discard() {
  emit('discard')
  await nextTick()
  status.value?.focus()
}
</script>

<template>
  <div ref="root" class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p ref="status" role="status" tabindex="-1" class="flex items-center gap-2 text-xs text-content-muted outline-none"><span aria-hidden="true" class="size-1.5 rounded-full" :class="dirty ? 'bg-warning' : 'bg-success'"></span>{{ dirty ? 'You have unsaved changes' : 'Everything is up to date' }}</p>
    </div>
    <SForm :id="formId" class="[&_input]:scroll-mb-44 [&_select]:scroll-mb-44 [&_textarea]:scroll-mb-44" novalidate aria-label="Workspace settings" @submit.prevent="submit">
      <SAlert v-if="errorMessages.length" color="danger" title="A few details need attention" role="alert"><ul class="list-inside list-disc"><li v-for="message in errorMessages" :key="message">{{ message }}</li></ul></SAlert>
      <STabs v-model="tab" :items="tabs" label="Settings sections">
        <template #panel="{ item }">
          <DemoProfileSettings v-if="item.value === 'profile'" v-model="profile" :errors="errors.profile" />
          <DemoWorkspaceSettings v-else-if="item.value === 'workspace'" v-model="workspace" :errors="errors.workspace" />
          <DemoAppearance v-else-if="item.value === 'appearance'" v-model:primary="primary" v-model:background="background" v-model:dark="dark" />
          <DemoNotificationSettings v-else v-model="notifications" />
        </template>
      </STabs>
    </SForm>
    <div v-if="dirty" class="acme-settings-savebar sticky bottom-4 z-20 flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-line-strong bg-canvas/95 p-4 shadow-sm backdrop-blur-sm">
      <span class="text-xs font-medium text-content-muted sm:hidden">Unsaved changes</span>
      <div class="hidden min-w-0 items-center gap-3 sm:flex"><span aria-hidden="true" class="hidden size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-content sm:flex"><Settings2 class="size-4" /></span><div><p class="text-sm font-medium">Ready when you are.</p><p class="mt-0.5 text-xs text-content-muted">Save your profile, workspace and notification preferences.</p></div></div>
      <div class="flex items-center gap-2"><SButton variant="ghost" size="sm" @click="discard">Discard</SButton><SButton type="submit" :form="formId" size="sm"><template #leading><Check /></template>Save changes</SButton></div>
    </div>
    <p class="text-xs leading-relaxed text-content-subtle">Saved for this demo session. Reloading restores the starting preferences.</p>
  </div>
</template>

<script setup lang="ts">
import { SBadge, SCard, SField, SInput, SSelect } from '@sirius-ui/vue'
import { Building2, Clock } from '../../../../shared/icons'
import { timezoneOptions, weekOptions } from '../../composables/useDemoSettings'
import type { WorkspaceSettings, SettingsErrors } from '../../composables/useDemoSettings'
const workspace = defineModel<WorkspaceSettings>({ required: true })
defineProps<{ errors: SettingsErrors['workspace'] }>()
function update(key: keyof WorkspaceSettings, value: string) { workspace.value = { ...workspace.value, [key]: value } }
</script>

<template>
  <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
    <SCard>
      <template #header><div class="acme-settings-heading"><h2>Your workspace</h2><p>The shared details that help everyone work on the same page.</p></div></template>
      <div class="grid gap-6 sm:grid-cols-2">
        <SField v-slot="{ control }" label="Workspace name" required full-width :error="errors.name"><SInput v-bind="control" :model-value="workspace.name" name="workspaceName" autocomplete="organization" maxlength="80" @update:model-value="update('name', $event)" /></SField>
        <SField v-slot="{ control }" label="Workspace handle" description="A short identifier for your workspace." required full-width :error="errors.handle"><SInput v-bind="control" :model-value="workspace.handle" name="workspaceHandle" maxlength="40" spellcheck="false" autocapitalize="none" @update:model-value="update('handle', $event)"><template #leading><span>@</span></template></SInput></SField>
        <SField v-slot="{ control }" label="Time zone" :error="errors.timezone"><SSelect v-bind="control" :model-value="workspace.timezone" name="timezone" :options="timezoneOptions" @update:model-value="update('timezone', $event)" /></SField>
        <SField v-slot="{ control }" label="Week starts on" :error="errors.weekStart"><SSelect v-bind="control" :model-value="workspace.weekStart" name="weekStart" :options="weekOptions" @update:model-value="update('weekStart', $event)" /></SField>
      </div>
    </SCard>
    <aside aria-label="Workspace details" class="space-y-5">
      <SCard bento="top-right"><span class="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary-content"><Building2 aria-hidden="true" class="size-5" /></span><h3 class="mt-5 break-words text-lg font-semibold">{{ workspace.name || 'Your workspace' }}</h3><p class="mt-1 break-all text-sm text-content-muted">@{{ workspace.handle || 'workspace' }}</p><SBadge size="sm" color="success" class="mt-4">Active workspace</SBadge><div class="mt-6 flex items-start gap-2 border-t border-line pt-5 text-xs leading-relaxed text-content-muted"><Clock aria-hidden="true" class="size-4 shrink-0" /><p>One time zone keeps reports, schedules and weekly summaries in sync.</p></div></SCard>
      <p class="px-2 text-xs leading-relaxed text-content-subtle">These settings describe the workspace. Your personal appearance preferences stay separate.</p>
    </aside>
  </div>
</template>

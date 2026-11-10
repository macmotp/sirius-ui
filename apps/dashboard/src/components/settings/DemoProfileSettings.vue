<script setup lang="ts">
import { computed } from 'vue'
import { SAvatar, SBadge, SCard, SField, SInput, STextarea } from '@sirius-ui/vue'
import { Mail } from '../../../../shared/icons'
import type { ProfileSettings, SettingsErrors } from '../../composables/useDemoSettings'
const profile = defineModel<ProfileSettings>({ required: true })
defineProps<{ errors: SettingsErrors['profile'] }>()
function update(key: keyof ProfileSettings, value: string) { profile.value = { ...profile.value, [key]: value } }
const previewName = computed(() => profile.value.name.trim() || 'Your name')
</script>

<template>
  <div class="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
    <SCard>
      <template #header><div class="acme-settings-heading"><h2>Your profile</h2><p>A familiar name. A little context. Help your team know who’s behind the work.</p></div></template>
      <div class="grid gap-6 sm:grid-cols-2">
        <SField v-slot="{ control }" label="Full name" required :error="errors.name"><SInput v-bind="control" :model-value="profile.name" name="name" autocomplete="name" maxlength="80" @update:model-value="update('name', $event)" /></SField>
        <SField v-slot="{ control }" label="Job title" :error="errors.jobTitle"><SInput v-bind="control" :model-value="profile.jobTitle" name="jobTitle" autocomplete="organization-title" maxlength="80" @update:model-value="update('jobTitle', $event)" /></SField>
        <SField v-slot="{ control }" label="Email address" description="The address your team can reach you at." required full-width :error="errors.email"><SInput v-bind="control" :model-value="profile.email" name="email" type="email" autocomplete="email" maxlength="254" @update:model-value="update('email', $event)"><template #leading><Mail /></template></SInput></SField>
        <SField v-slot="{ control }" label="A little about you" description="A short introduction for your team. Up to 240 characters." full-width :error="errors.bio"><STextarea v-bind="control" :model-value="profile.bio" name="bio" :rows="3" maxlength="240" @update:model-value="update('bio', $event)" /></SField>
      </div>
    </SCard>
    <aside aria-label="Profile preview" class="space-y-5">
      <SCard bento="top-right">
        <p class="acme-settings-step">HOW YOU’LL APPEAR</p>
        <div class="mt-6 flex items-center gap-3"><SAvatar :name="previewName" size="lg" aria-hidden="true" /><div class="min-w-0"><p class="break-words font-semibold">{{ previewName }}</p><p class="mt-1 break-words text-xs text-content-muted">{{ profile.jobTitle || 'Your job title' }}</p></div></div>
        <p class="mt-5 break-all text-sm text-content-muted">{{ profile.email || 'Email address not set' }}</p>
        <SBadge class="mt-4" size="sm">Workspace owner</SBadge>
        <p v-if="profile.bio" class="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-content-muted">{{ profile.bio }}</p>
      </SCard>
      <p class="px-2 text-xs leading-relaxed text-content-subtle">A small introduction goes a long way. Your initials follow your name automatically.</p>
    </aside>
  </div>
</template>

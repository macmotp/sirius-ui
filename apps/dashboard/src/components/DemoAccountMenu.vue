<script setup lang="ts">
import { ChevronsUpDown, LogOut, Settings2, UserRound } from '../../../shared/icons'
import { SAvatar, SBadge, SPopover } from '@sirius-ui/vue'
import { demoUser, isPlainLinkClick } from '../data/demo'
import type { DemoPage } from '../data/demo'
withDefaults(defineProps<{ user?: typeof demoUser }>(), { user: () => demoUser })
const emit = defineEmits<{ navigate: [page: DemoPage]; notice: [message: string] }>()
function go(page: DemoPage, event: MouseEvent, close: () => void) {
  if (!isPlainLinkClick(event)) return
  event.preventDefault()
  close()
  emit('navigate', page)
}
function signOut(close: () => void) {
  close()
  emit('notice', 'Example sign-out action. Your demo account is still signed in.')
}
</script>

<template>
  <SPopover :title="`${user.name}'s account`" placement="top" align="start" block>
    <template #trigger="{ trigger }"><button v-bind="trigger" type="button" :aria-label="`Open account menu for ${user.name}`" class="flex w-full max-w-full min-w-0 cursor-pointer items-center gap-3 rounded-2xl border-0 bg-transparent p-2 text-start text-content hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><SAvatar :name="user.name" size="sm" aria-hidden="true" /><span class="min-w-0 flex-1"><span class="block truncate text-sm font-medium">{{ user.name }}</span><span class="mt-1 block text-xs text-content-subtle">{{ user.role }}</span></span><ChevronsUpDown aria-hidden="true" class="ml-auto size-4 shrink-0 text-content-muted" /></button></template>
    <template #header><div class="flex min-w-0 items-start gap-3"><SAvatar :name="user.name" size="lg" aria-hidden="true" /><div class="min-w-0"><p class="break-words font-semibold">{{ user.name }}</p><p class="mt-1 break-all text-xs text-content-muted">{{ user.email }}</p><p class="mt-1 text-xs text-content-muted">{{ user.jobTitle }}</p><SBadge class="mt-2" size="sm">{{ user.role }}</SBadge></div></div></template>
    <template #default="{ close }">
      <div class="space-y-1 border-t border-line pt-3">
        <a href="#profile" class="acme-menu-item" @click="go('profile', $event, close)"><UserRound aria-hidden="true" class="size-4" />View profile</a>
        <a href="#settings" class="acme-menu-item" @click="go('settings', $event, close)"><Settings2 aria-hidden="true" class="size-4" />Account settings</a>
        <button type="button" class="acme-menu-item" @click="signOut(close)"><LogOut aria-hidden="true" class="size-4" />Sign out</button>
      </div>
    </template>
  </SPopover>
</template>

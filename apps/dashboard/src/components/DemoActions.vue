<script setup lang="ts">
import { Ellipsis, Download, Plus, UserPlus } from '../../../shared/icons'
import { SPopover } from '@sirius-ui/vue'
const emit = defineEmits<{ notice: [message: string] }>()
const actions = [
  { label: 'Create a task', icon: Plus, message: 'Example task created. No business data was changed.' },
  { label: 'Export a report', icon: Download, message: 'Example export requested. No file was generated.' },
  { label: 'Invite a teammate', icon: UserPlus, message: 'Example invitation prepared. No invitation was sent.' },
]
function act(message: string, close: () => void) { close(); emit('notice', message) }
</script>

<template>
  <SPopover title="Quick actions" description="Try an example action." align="end">
    <template #trigger="{ trigger }"><button v-bind="trigger" type="button" class="acme-icon-button" aria-label="Quick actions"><Ellipsis aria-hidden="true" class="size-5" /></button></template>
    <template #default="{ close }"><div class="space-y-1"><button v-for="action in actions" :key="action.label" type="button" class="acme-menu-item" @click="act(action.message, close)"><component :is="action.icon" aria-hidden="true" class="size-4" />{{ action.label }}</button></div></template>
  </SPopover>
</template>

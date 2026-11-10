<script setup lang="ts">
import { computed, shallowRef, useId } from 'vue'
import { Bell } from '../../../shared/icons'
import { SBadge, SButton, SDrawer } from '@sirius-ui/vue'
import { isPlainLinkClick } from '../data/demo'
import type { DemoDestination } from '../data/demo'
const emit = defineEmits<{ navigate: [page: DemoDestination] }>()
const open = shallowRef(false)
const id = useId()
const notifications = shallowRef([
  { id: 'order', title: 'Order #1048 is ready', description: 'The package is ready to dispatch.', time: '5 minutes ago', read: false },
  { id: 'collection', title: 'Collection draft saved', description: 'Six products are ready for your review.', time: '30 minutes ago', read: false },
  { id: 'enquiry', title: 'New customer enquiry', description: 'A customer has a question about delivery.', time: '1 hour ago', read: false },
])
const unread = computed(() => notifications.value.filter(item => !item.read).length)
function toggleRead(id: string) { notifications.value = notifications.value.map(item => item.id === id ? { ...item, read: !item.read } : item) }
function markAllRead() { notifications.value = notifications.value.map(item => ({ ...item, read: true })) }
function viewActivity(event?: MouseEvent) {
  if (event && !isPlainLinkClick(event)) return
  event?.preventDefault()
  open.value = false
  emit('navigate', 'activity')
}
</script>

<template>
  <button type="button" class="acme-icon-button relative" :aria-label="`Notifications, ${unread} unread`" aria-haspopup="dialog" :aria-expanded="open" :aria-controls="`${id}-notifications`" @click="open = true"><Bell aria-hidden="true" class="size-5" /><span v-if="unread" aria-hidden="true" class="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary"></span></button>
  <SDrawer :id="`${id}-notifications`" v-model:open="open" title="Notifications" description="Example updates from your Acme workspace." side="right" size="sm">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3"><p role="status" aria-atomic="true" class="text-xs text-content-muted">{{ unread ? `${unread} unread notifications` : 'You’re all caught up.' }}</p><SButton size="sm" variant="ghost" @click="markAllRead">Mark all as read</SButton></div>
    <ul class="space-y-4"><li v-for="notification in notifications" :key="notification.id" class="rounded-2xl bg-surface p-4 ring-1 ring-inset ring-line"><div class="mb-3 flex flex-wrap items-center justify-between gap-2"><span class="text-xs text-content-subtle">{{ notification.time }}</span><SBadge v-if="!notification.read" size="sm">Unread</SBadge><span v-else class="text-xs text-content-muted">Read</span></div><a href="#activity" class="rounded-sm text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" @click="viewActivity">{{ notification.title }}</a><p class="mt-2 text-xs leading-relaxed text-content-muted">{{ notification.description }}</p><button type="button" class="mt-3 cursor-pointer rounded-sm border-0 bg-transparent p-0 text-xs text-primary-content underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" :aria-label="`${notification.read ? 'Mark unread' : 'Mark read'}: ${notification.title}`" @click="toggleRead(notification.id)">{{ notification.read ? 'Mark unread' : 'Mark as read' }}</button></li></ul>
    <template #footer><SButton variant="outline" full-width @click="viewActivity()">View activity</SButton></template>
  </SDrawer>
</template>

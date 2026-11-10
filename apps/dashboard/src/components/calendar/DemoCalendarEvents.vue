<script setup lang="ts">
import { calendarEventStyles } from '../../data/calendar'
import type { CalendarEvent } from '../../data/calendar'

defineProps<{ events: readonly CalendarEvent[]; detailed: boolean }>()
</script>

<template>
  <ul v-if="events.length" class="m-0 list-none space-y-1 p-0" role="list">
    <li v-for="event in events" :key="event.id" class="rounded-lg px-2 py-1.5 text-xs leading-4 wrap-anywhere" :class="calendarEventStyles[event.color]">
      <time v-if="event.time" :datetime="event.time" class="me-1.5 tabular-nums">{{ event.time }}</time>
      <span class="font-semibold">{{ event.title }}</span>
      <p v-if="detailed && event.detail" class="mt-1 mb-0">{{ event.detail }}</p>
    </li>
  </ul>
</template>

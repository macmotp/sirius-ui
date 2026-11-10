<script setup lang="ts">
import { calendarEventStyles, calendarWeekdays } from '../../data/calendar'
import type { CalendarDay } from '../../data/calendar'

defineProps<{
  weeks: readonly (readonly CalendarDay[])[]
  month: number
  selected: string
  today: string
}>()
const emit = defineEmits<{ day: [date: Date] }>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-line bg-surface">
    <table class="w-full table-fixed border-collapse text-sm" aria-label="Month calendar">
      <thead class="bg-surface-muted text-content-muted">
        <tr>
          <th v-for="[short, full] in calendarWeekdays" :key="full" scope="col" class="px-0.5 py-3 text-center text-xs font-medium" :aria-label="full">{{ short }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]?.key" class="border-t border-line">
          <td v-for="day in week" :key="day.key" class="border-s border-line p-0 align-top first:border-s-0">
            <button
              type="button"
              class="flex min-h-16 w-full flex-col items-start gap-1 p-1 text-start hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus sm:min-h-24 sm:p-2"
              :class="{ 'bg-surface-muted': day.date.getUTCMonth() !== month }"
              :aria-label="`${day.label}, ${day.events.length} ${day.events.length === 1 ? 'event' : 'events'}`"
              :aria-current="day.key === today ? 'date' : undefined"
              @click="emit('day', day.date)"
            >
              <span
                class="grid size-6 place-items-center rounded-full text-xs font-medium"
                :class="day.key === selected ? 'bg-primary-soft text-primary-content ring-1 ring-inset ring-primary' : day.date.getUTCMonth() === month ? 'text-content' : 'text-content-subtle'"
              >{{ day.date.getUTCDate() }}</span>
              <span v-if="day.events.length" aria-hidden="true" class="ms-1 rounded-full bg-primary-soft px-1.5 text-xs text-primary-content sm:hidden">{{ day.events.length }}</span>
              <span v-for="event in day.events.slice(0, 2)" :key="event.id" aria-hidden="true" class="hidden w-full truncate rounded px-1.5 py-0.5 text-xs sm:block" :class="calendarEventStyles[event.color]">{{ event.title }}</span>
              <span v-if="day.events.length > 2" aria-hidden="true" class="hidden text-xs text-content-muted sm:block">+{{ day.events.length - 2 }} more</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

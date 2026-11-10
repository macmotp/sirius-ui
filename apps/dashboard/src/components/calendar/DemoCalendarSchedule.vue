<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue'
import { SButton } from '@sirius-ui/vue'
import DemoCalendarEvents from './DemoCalendarEvents.vue'
import type { CalendarDay, CalendarEvent } from '../../data/calendar'

const props = defineProps<{
  days: readonly CalendarDay[]
  view: 'day' | 'week'
  selected: string
  today: string
}>()
const emit = defineEmits<{ day: [date: Date] }>()
const scrollport = useTemplateRef<HTMLElement>('scrollport')
const hoursBody = useTemplateRef<HTMLTableSectionElement>('hoursBody')
const hours = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`)
const shortDate = new Intl.DateTimeFormat('en-SG', {
  weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
})
const columns = computed(() => props.days.map(day => {
  const allDay: CalendarEvent[] = []
  const timed = hours.map((): CalendarEvent[] => [])
  for (const event of day.events) {
    if (event.time) timed[Number(event.time.slice(0, 2))]?.push(event)
    else allDay.push(event)
  }
  return { ...day, allDay, timed }
}))
const hasAllDay = computed(() => columns.value.some(day => day.allDay.length))

onMounted(() => {
  const earliest = columns.value.map(day => day.timed.findIndex(events => events.length))
    .filter(hour => hour >= 0)
  const firstHour = Math.min(8, ...earliest)
  const rows = hoursBody.value?.rows
  const row = rows?.item(firstHour)
  const firstRow = rows?.item(0)
  if (scrollport.value && row && firstRow) scrollport.value.scrollTop = row.offsetTop - firstRow.offsetTop
})
</script>

<template>
  <div
    ref="scrollport"
    role="region"
    :aria-label="view === 'week' ? 'Weekly schedule' : 'Daily schedule'"
    tabindex="0"
    class="h-[clamp(22rem,65dvh,44rem)] min-w-0 overflow-auto rounded-2xl border border-line bg-surface focus-visible:-outline-offset-2"
  >
    <table class="w-full table-fixed border-separate border-spacing-0 text-sm" :class="{ 'min-w-[53rem]': view === 'week' }">
      <colgroup><col class="w-16" /><col v-for="day in columns" :key="day.key" /></colgroup>
      <thead class="sticky top-0 z-20">
        <tr>
          <th scope="col" class="sticky start-0 z-10 border-b border-line bg-surface-muted px-2 py-2 text-end text-xs font-medium text-content-muted">SGT</th>
          <th v-for="day in columns" :key="day.key" scope="col" class="border-b border-s border-line bg-surface-muted p-1.5 text-center text-sm font-medium">
            <SButton v-if="view === 'week'" size="sm" :variant="day.key === selected ? 'soft' : 'ghost'" :aria-label="day.label" :aria-current="day.key === today ? 'date' : undefined" @click="emit('day', day.date)">
              {{ shortDate.format(day.date) }}
            </SButton>
            <time v-else :datetime="day.key" class="block px-2 py-1 text-start" :aria-current="day.key === today ? 'date' : undefined">{{ shortDate.format(day.date) }}</time>
          </th>
        </tr>
        <tr v-if="hasAllDay">
          <th scope="row" class="sticky start-0 z-10 border-b border-line bg-surface-muted px-2 py-2 text-end align-top text-xs font-medium text-content-muted">All day</th>
          <td v-for="day in columns" :key="day.key" class="border-b border-s border-line bg-surface-muted p-1.5 align-top">
            <div v-if="day.allDay.length" class="max-h-24 overflow-y-auto" role="region" :aria-label="`All-day events for ${day.label}`" tabindex="0">
              <DemoCalendarEvents :events="day.allDay" :detailed="view === 'day'" />
            </div>
          </td>
        </tr>
      </thead>
      <tbody ref="hoursBody">
        <tr v-for="(label, hour) in hours" :key="label">
          <th scope="row" class="sticky start-0 z-10 h-14 border-b border-line bg-surface-muted px-2 py-2 text-end align-top text-xs font-medium text-content-muted tabular-nums"><time :datetime="label">{{ label }}</time></th>
          <td v-for="day in columns" :key="day.key" class="border-b border-s border-line p-1.5 align-top" :class="{ 'bg-surface-muted': view === 'week' && day.key === today }">
            <DemoCalendarEvents v-if="day.timed[hour]?.length" :events="day.timed[hour]!" :detailed="view === 'day'" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

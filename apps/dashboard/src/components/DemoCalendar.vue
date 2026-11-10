<script setup lang="ts">
import { computed, nextTick, shallowRef, useTemplateRef } from 'vue'
import { SButton, SIcon } from '@sirius-ui/vue'
import DemoAddEvent from './calendar/DemoAddEvent.vue'
import DemoCalendarMonth from './calendar/DemoCalendarMonth.vue'
import DemoCalendarPicker from './calendar/DemoCalendarPicker.vue'
import DemoCalendarSchedule from './calendar/DemoCalendarSchedule.vue'
import { addDays, calendarDateFormat, calendarMonthFormat, dateKey, monthWeeks, moveDate, todayInSingapore, weekStart } from '../data/calendar'
import type { CalendarEvent, CalendarEventDraft, CalendarView } from '../data/calendar'

const props = defineProps<{ events: readonly CalendarEvent[] }>()
const emit = defineEmits<{ create: [event: CalendarEventDraft] }>()

const period = useTemplateRef<HTMLElement>('period')
const view = shallowRef<CalendarView>('month')
const selected = shallowRef(new Date('2026-11-10T00:00:00Z'))
const today = shallowRef(todayInSingapore())
const views = [{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }] as const
const weekFormat = new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const events = computed(() => [...props.events].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? '')))
const selectedKey = computed(() => dateKey(selected.value))
const todayKey = computed(() => dateKey(today.value))

function dayInfo(date: Date) {
  const key = dateKey(date)
  return { date, key, label: calendarDateFormat.format(date), events: events.value.filter(event => event.date === key) }
}

const week = computed(() => {
  const start = weekStart(selected.value)
  return Array.from({ length: 7 }, (_, index) => dayInfo(addDays(start, index)))
})
const month = computed(() => monthWeeks(selected.value).map(week => week.map(dayInfo)))
const scheduleDays = computed(() => view.value === 'week' ? week.value : [dayInfo(selected.value)])
const heading = computed(() => {
  if (view.value === 'day') return calendarDateFormat.format(selected.value)
  if (view.value === 'week') {
    const start = weekStart(selected.value)
    return weekFormat.formatRange(start, addDays(start, 6))
  }
  return calendarMonthFormat.format(selected.value)
})

function goToday() {
  today.value = todayInSingapore()
  selected.value = today.value
}
function openDay(date: Date) {
  selected.value = date
  view.value = 'day'
  void nextTick(() => period.value?.focus?.())
}
function createEvent(event: CalendarEventDraft) {
  selected.value = new Date(`${event.date}T00:00:00Z`)
  emit('create', event)
}
</script>

<template>
  <section aria-labelledby="calendar-period">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 id="calendar-period" ref="period" tabindex="-1" class="m-0 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" aria-live="polite">{{ heading }}</h2>
        <p class="mt-1 mb-0 text-sm text-content-muted">Acme schedule · Singapore time</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Calendar date navigation" class="flex items-center gap-1">
          <SButton size="sm" variant="ghost" :aria-label="`Previous ${view}`" @click="selected = moveDate(selected, view, -1)">
            <SIcon name="chevronLeft" class="size-4 rtl:rotate-180" />
          </SButton>
          <SButton size="sm" variant="outline" @click="goToday">Today</SButton>
          <SButton size="sm" variant="ghost" :aria-label="`Next ${view}`" @click="selected = moveDate(selected, view, 1)">
            <SIcon name="chevronRight" class="size-4 rtl:rotate-180" />
          </SButton>
        </div>
        <div role="group" aria-label="Calendar view" class="flex flex-wrap items-center gap-1 rounded-full border border-line bg-surface p-1">
          <SButton v-for="option in views" :key="option.id" size="sm" :variant="view === option.id ? 'soft' : 'ghost'" :aria-pressed="view === option.id" @click="view = option.id">{{ option.label }}</SButton>
        </div>
        <DemoAddEvent :selected-date="selectedKey" @create="createEvent" />
      </div>
    </div>

    <DemoCalendarMonth v-if="view === 'month'" :weeks="month" :month="selected.getUTCMonth()" :selected="selectedKey" :today="todayKey" @day="openDay" />
    <div v-else class="grid items-start gap-4" :class="{ 'lg:grid-cols-[minmax(0,1fr)_17rem]': view === 'day' }">
      <DemoCalendarSchedule :key="view" :view="view" :days="scheduleDays" :selected="selectedKey" :today="todayKey" @day="openDay" />
      <DemoCalendarPicker v-if="view === 'day'" :selected="selected" :today="todayKey" @select="selected = $event" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SButton, SIcon } from '@sirius-ui/vue'
import { calendarDateFormat, calendarMonthFormat, calendarWeekdays, dateKey, monthStart, monthWeeks, moveDate } from '../../data/calendar'

const props = defineProps<{ selected: Date; today: string }>()
const emit = defineEmits<{ select: [date: Date] }>()
const month = shallowRef(monthStart(props.selected))
const selectedKey = computed(() => dateKey(props.selected))
const weeks = computed(() => monthWeeks(month.value).map(week => week.map(date => ({
  date,
  key: dateKey(date),
  label: calendarDateFormat.format(date),
  outside: date.getUTCMonth() !== month.value.getUTCMonth(),
}))))
watch(selectedKey, () => { month.value = monthStart(props.selected) })

function select(date: Date) {
  month.value = monthStart(date)
  emit('select', date)
}
</script>

<template>
  <aside aria-label="Choose a date" class="rounded-2xl border border-line bg-surface p-3">
    <div class="mb-2 flex items-center justify-between gap-1">
      <SButton size="sm" variant="ghost" aria-label="Previous month in date picker" @click="month = moveDate(month, 'month', -1)">
        <SIcon name="chevronLeft" class="size-4 rtl:rotate-180" />
      </SButton>
      <h3 aria-live="polite" class="m-0 text-center text-sm font-semibold">{{ calendarMonthFormat.format(month) }}</h3>
      <SButton size="sm" variant="ghost" aria-label="Next month in date picker" @click="month = moveDate(month, 'month', 1)">
        <SIcon name="chevronRight" class="size-4 rtl:rotate-180" />
      </SButton>
    </div>
    <table aria-label="Date picker calendar" class="w-full table-fixed border-collapse text-center text-xs">
      <thead>
        <tr>
          <th v-for="[short, full] in calendarWeekdays" :key="full" scope="col" :aria-label="full" class="pb-1 font-medium text-content-muted">{{ short }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]?.key">
          <td v-for="day in week" :key="day.key" class="p-0">
            <button
              type="button"
              :aria-label="day.label"
              :aria-pressed="day.key === selectedKey"
              :aria-current="day.key === today ? 'date' : undefined"
              class="mx-auto grid size-8 cursor-pointer place-items-center rounded-full font-medium focus-visible:outline-offset-0"
              :class="day.key === selectedKey ? 'bg-primary-soft text-primary-content ring-1 ring-inset ring-primary' : day.key === today ? 'font-bold text-primary-content hover:bg-primary-soft' : day.outside ? 'text-content-subtle hover:bg-surface-hover' : 'text-content hover:bg-surface-hover'"
              @click="select(day.date)"
            >{{ day.date.getUTCDate() }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </aside>
</template>

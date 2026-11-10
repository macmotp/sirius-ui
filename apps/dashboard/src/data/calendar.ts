import type { SBadgeColor } from '@sirius-ui/vue'

export type CalendarView = 'day' | 'week' | 'month'
export interface CalendarEvent {
  id: string
  date: string
  title: string
  time?: string
  detail: string
  color: SBadgeColor
}
export type CalendarEventDraft = Omit<CalendarEvent, 'id' | 'color'>
export interface CalendarDay {
  date: Date
  key: string
  label: string
  events: readonly CalendarEvent[]
}

export const calendarWeekdays = [
  ['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'],
  ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday'],
] as const
export const calendarDateFormat = new Intl.DateTimeFormat('en-SG', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
})
export const calendarMonthFormat = new Intl.DateTimeFormat('en-SG', {
  month: 'long', year: 'numeric', timeZone: 'UTC',
})
export const calendarEventStyles = {
  primary: 'bg-primary-soft text-primary-content',
  success: 'bg-success-soft text-success-content',
  warning: 'bg-warning-soft text-warning-content',
  danger: 'bg-danger-soft text-danger-content',
} satisfies Record<SBadgeColor, string>

export const calendarEvents: readonly CalendarEvent[] = [
  { id: 'launch', date: '2026-11-02', title: 'November collection launch', detail: 'Publish the new collection to the online store.', color: 'primary' },
  { id: 'dispatch', date: '2026-11-06', time: '18:35', title: 'Order #1048 ready', detail: 'The parcel is packed and ready for the next pickup.', color: 'success' },
  { id: 'planning', date: '2026-11-09', time: '10:00', title: 'Weekly operations planning', detail: 'Review fulfillment, stock and customer enquiries.', color: 'primary' },
  { id: 'pickup', date: '2026-11-10', time: '09:30', title: 'Courier pickup', detail: 'Hand over parcels at the Acme dispatch desk.', color: 'success' },
  { id: 'inventory', date: '2026-11-10', time: '14:00', title: 'Stock check', detail: 'Reconcile the remaining stock for the November collection.', color: 'warning' },
  { id: 'follow-up', date: '2026-11-12', time: '11:00', title: 'Checkout feedback review', detail: 'Discuss the delivery notes and updated checkout copy.', color: 'primary' },
  { id: 'invoice', date: '2026-11-16', title: 'Supplier invoice due', detail: 'Review the invoice and confirm payment.', color: 'warning' },
  { id: 'report', date: '2026-11-27', time: '16:00', title: 'Monthly sales review', detail: 'Review sales by channel and plan December targets.', color: 'primary' },
]

function dateAt(year: number, month: number, day: number) {
  const date = new Date(0)
  date.setUTCFullYear(year, month, day)
  return date
}

export function dateKey(date: Date) {
  return date.toISOString().split('T', 1)[0]!
}

export function addDays(date: Date, count: number) {
  return dateAt(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + count)
}

export function weekStart(date: Date) {
  return addDays(date, -((date.getUTCDay() + 6) % 7))
}

export function monthStart(date: Date) {
  return dateAt(date.getUTCFullYear(), date.getUTCMonth(), 1)
}

export function monthWeeks(date: Date) {
  const start = weekStart(monthStart(date))
  return Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 7 }, (_, column) => addDays(start, row * 7 + column)))
}

export function moveDate(date: Date, view: CalendarView, direction: -1 | 1) {
  if (view !== 'month') return addDays(date, direction * (view === 'week' ? 7 : 1))

  const month = date.getUTCMonth() + direction
  const year = date.getUTCFullYear()
  const daysInMonth = dateAt(year, month + 1, 0).getUTCDate()
  return dateAt(year, month, Math.min(date.getUTCDate(), daysInMonth))
}

const singaporeDate = new Intl.DateTimeFormat('en-SG', {
  timeZone: 'Asia/Singapore', year: 'numeric', month: 'numeric', day: 'numeric',
})

export function todayInSingapore(now = new Date()) {
  const parts = singaporeDate.formatToParts(now)
  const part = (type: 'year' | 'month' | 'day') => Number(parts.find(item => item.type === type)?.value)
  return dateAt(part('year'), part('month') - 1, part('day'))
}

import type { SDateRangeConstraints, SDateRangeValue } from './SDateRange.types'

function isCalendarDate(value: string): boolean {
  if (!/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function getDateRangeError(range: SDateRangeValue, { min, max, required }: SDateRangeConstraints = {}): string {
  const { from, to } = range
  const dates = [from, to].filter(Boolean)
  if (dates.some(date => !isCalendarDate(date))) return 'Enter valid dates for the date range.'
  if (from && to && from > to) return 'The start date must be on or before the end date.'
  if (min && dates.some(date => date < min)) return 'Choose dates on or after the earliest allowed date.'
  if (max && dates.some(date => date > max)) return 'Choose dates on or before the latest allowed date.'
  if (required && (!from || !to)) return 'Enter both a start and an end date.'
  return ''
}

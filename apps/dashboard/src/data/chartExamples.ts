import type { SLineChartPoint } from '@sirius-ui/charts'

// Fixed illustrative daily SGD values; the application owns periods/aggregation.
export const weeklySales: readonly SLineChartPoint[] = [420, 640, 580, 910, 720, 1060, 980].map((value, index) => ({ label: `${index + 1} Nov`, value }))
export const fortnightSales: readonly SLineChartPoint[] = [
  ...[310, 460, 390, 540, 470, 620, 510].map((value, index) => ({ label: `${index + 25} Oct`, value })),
  ...weeklySales,
]
export const salesMoney = (value: number) => new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 }).format(value)
export const salesAxis = (value: number) => new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', notation: 'compact', maximumFractionDigits: 1 }).format(value)


export const chartColors = {
  theme: 'var(--sirius-primary-content)',
  indigo: 'var(--acme-chart-indigo)',
  pink: 'var(--acme-chart-pink)',
  orange: 'var(--acme-chart-orange)',
  cyan: 'var(--acme-chart-cyan)',
  emerald: 'var(--acme-chart-emerald)',
}
export type ChartColor = keyof typeof chartColors
export const chartColorOptions = [
  { value: 'theme', label: 'Theme accent' }, { value: 'indigo', label: 'Indigo' },
  { value: 'pink', label: 'Pink' }, { value: 'orange', label: 'Orange' },
  { value: 'cyan', label: 'Cyan' }, { value: 'emerald', label: 'Emerald' },
]

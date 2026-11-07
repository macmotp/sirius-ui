import type { SLineChartProps } from './SLineChart.types'

export interface SDonutChartItem {
  id: string
  label: string
  /** Nonnegative finite amount. Null, negative and nonfinite values are missing. */
  value: number | null
  color?: string
}
export interface SDonutChartProps extends Pick<SLineChartProps, 'title' | 'description' | 'height' | 'valueFormatter' | 'loading' | 'error' | 'loadingText' | 'emptyText' | 'dataTableLabel' | 'categoryLabel' | 'instructions'> {
  data?: readonly SDonutChartItem[]
  /** Inner radius as a fraction of outer radius, clamped to 0.35–0.85. */
  innerRadius?: number
  showTotal?: boolean
  totalLabel?: string
  valueLabel?: string
  percentageLabel?: string
  totalFormatter?: (value: number) => string
  /** Receives a fraction in [0, 1], not a number in [0, 100]. */
  percentageFormatter?: (fraction: number) => string
}

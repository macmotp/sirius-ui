export interface SLineChartPoint {
  label: string
  /** A finite number; null represents a gap, never a zero or an interpolated value. */
  value: number | null
}
export type SLineChartPattern = 'solid' | 'dashed' | 'dotted'

export interface SLineChartSeries {
  id: string
  label: string
  data: readonly SLineChartPoint[]
  /** Optional CSS color, including a theme custom property reference. */
  color?: string
  /** Defaults to solid/dashed/dotted by series position; legend matches the stroke. */
  pattern?: SLineChartPattern
}
export interface SLineChartProps {
  title: string
  data?: readonly SLineChartPoint[]
  /** When supplied, replaces data/seriesLabel. Use unique category labels within each series. */
  series?: readonly SLineChartSeries[]
  /** Monotone cubic curves; does not bridge gaps or change the observations. */
  smooth?: boolean
  /** All labels use horizontal scrolling when they cannot fit. */
  xLabels?: 'auto' | 'all'
  description?: string
  seriesLabel?: string
  /** Plot height in pixels, clamped to 180–600. Width follows the container. */
  height?: number
  includeZero?: boolean
  valueFormatter?: (value: number) => string
  axisFormatter?: (value: number) => string
  loading?: boolean
  error?: string
  loadingText?: string
  emptyText?: string
  dataTableLabel?: string
  categoryLabel?: string
  instructions?: string
}

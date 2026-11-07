import type { SLineChartPoint, SLineChartProps } from './SLineChart.types'

export type SBarChartPoint = SLineChartPoint
export interface SBarChartSeries {
  id: string
  label: string
  data: readonly SBarChartPoint[]
  /** CSS fill color; accepts a theme custom property reference. */
  color?: string
}

/** Numeric axes always include zero so bar lengths remain meaningful. */
export interface SBarChartProps extends Omit<SLineChartProps, 'series' | 'smooth' | 'xLabels' | 'includeZero'> {
  series?: readonly SBarChartSeries[]
  orientation?: 'vertical' | 'horizontal'
}

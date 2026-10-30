export type SProgressColor = 'primary' | 'success' | 'warning' | 'danger'
export type SProgressSize = 'sm' | 'md' | 'lg'

export interface SProgressProps {
  label: string
  /** Omit or pass null for indeterminate progress. */
  value?: number | null
  max?: number
  color?: SProgressColor
  size?: SProgressSize
  showLabel?: boolean
  showValue?: boolean
  valueText?: string
}

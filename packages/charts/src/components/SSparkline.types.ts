export interface SSparklineProps {
  data: readonly (number | null)[]
  /** Accessible summary of the trend. Omit when adjacent text describes it. */
  label?: string
  height?: number
  smooth?: boolean
  showValues?: boolean
  valueFormatter?: (value: number) => string
}

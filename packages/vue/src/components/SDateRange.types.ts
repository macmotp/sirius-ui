import type { SInputSize } from './SInput.types'

export interface SDateRangeValue {
  from: string
  to: string
}

export interface SDateRangePreset {
  id: string
  label: string
  range: SDateRangeValue
}

export interface SDateRangeConstraints {
  min?: string
  max?: string
  required?: boolean
}

export interface SDateRangeProps extends SDateRangeConstraints {
  label?: string
  fromLabel?: string
  toLabel?: string
  fromName?: string
  toName?: string
  size?: SInputSize
  disabled?: boolean
  presets?: readonly SDateRangePreset[]
  clearable?: boolean
  clearLabel?: string
  error?: string
}

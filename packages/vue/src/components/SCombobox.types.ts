import type { SInputSize } from './SInput.types'

export interface SComboboxOption {
  value: string
  label: string
  disabled?: boolean
  keywords?: readonly string[]
}
export interface SComboboxProps<T extends SComboboxOption = SComboboxOption> {
  options?: readonly T[]
  placeholder?: string
  size?: SInputSize
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  valid?: boolean
  required?: boolean
  requiredMessage?: string
  clearable?: boolean
  clearLabel?: string
  emptyText?: string
}

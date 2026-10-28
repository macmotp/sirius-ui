export type SSelectSize = 'sm' | 'md' | 'lg'

export interface SSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SSelectProps {
  options?: readonly SSelectOption[]
  placeholder?: string
  size?: SSelectSize
  disabled?: boolean
  invalid?: boolean
  valid?: boolean
}

export type SInputSize = 'sm' | 'md' | 'lg'
export type SInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'number' | 'color' | 'range'

export interface SInputProps {
  type?: SInputType
  size?: SInputSize
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  valid?: boolean
}

export type SChoiceSize = 'sm' | 'md' | 'lg'

export interface SChoiceProps {
  id?: string
  label?: string
  description?: string
  error?: string
  size?: SChoiceSize
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  valid?: boolean
}

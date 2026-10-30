import type { SInputSize } from './SInput.types'

export interface STagsInputProps {
  size?: SInputSize
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  valid?: boolean
  required?: boolean
  requiredMessage?: string
  placeholder?: string
  maxTags?: number
}

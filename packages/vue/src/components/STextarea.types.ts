export type STextareaSize = 'sm' | 'md' | 'lg'
export type STextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface STextareaProps {
  size?: STextareaSize
  rows?: number
  resize?: STextareaResize
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  valid?: boolean
}

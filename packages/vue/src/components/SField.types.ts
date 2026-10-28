export interface SFieldProps {
  /** ID of the control rendered in the default slot. Generated when omitted. */
  id?: string
  label: string
  description?: string
  error?: string
  required?: boolean
  fullWidth?: boolean
}

export interface SFieldControl {
  id: string
  required: boolean
  'aria-describedby'?: string
  'aria-invalid'?: true
}

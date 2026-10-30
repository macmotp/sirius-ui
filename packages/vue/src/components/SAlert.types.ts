export type SAlertColor = 'primary' | 'success' | 'warning' | 'danger'
export type SAlertVariant = 'soft' | 'solid' | 'outline'

export interface SAlertProps {
  color?: SAlertColor
  variant?: SAlertVariant
  title?: string
  icon?: boolean
  dismissible?: boolean
  dismissLabel?: string
  role?: 'status' | 'alert'
}

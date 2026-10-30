import type { SAlertColor } from './SAlert.types'

export type SToastDismissReason = 'timeout' | 'close-button'
export interface SToastOptions {
  title: string
  description?: string
  color?: SAlertColor
  /** Milliseconds; zero disables automatic dismissal. */
  duration?: number
  role?: 'status' | 'alert'
}
export interface SToastProps extends SToastOptions {
  dismissLabel?: string
}
export interface SToastItem extends SToastOptions {
  id: string
}
export interface SToasterProps {
  toasts: readonly SToastItem[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  label?: string
}

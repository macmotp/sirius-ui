export type SDrawerSize = 'sm' | 'md' | 'lg' | 'xl'
export type SDrawerDismissReason = 'escape' | 'backdrop' | 'close-button'

export interface SDrawerProps {
  side?: 'left' | 'right'
  title?: string
  description?: string
  size?: SDrawerSize
  showClose?: boolean
  closeLabel?: string
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
}

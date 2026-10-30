export type SDialogSize = 'sm' | 'md' | 'lg' | 'xl'
export type SDialogDismissReason = 'escape' | 'backdrop' | 'close-button'

export interface SDialogProps {
  title?: string
  description?: string
  size?: SDialogSize
  showClose?: boolean
  closeLabel?: string
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
}

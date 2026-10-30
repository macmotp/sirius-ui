export type SPopoverPlacement = 'top' | 'bottom' | 'left' | 'right'
export type SPopoverDismissReason = 'escape' | 'outside' | 'close'
export interface SPopoverProps {
  title: string
  description?: string
  placement?: SPopoverPlacement
  align?: 'start' | 'center' | 'end'
  disabled?: boolean
  closeLabel?: string
}
export interface SPopoverTrigger {
  'aria-haspopup': 'dialog'
  'aria-expanded': boolean
  'aria-controls': string
  disabled: boolean
  onClick: (event: MouseEvent) => void
}

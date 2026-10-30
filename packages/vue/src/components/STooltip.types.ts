export type STooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
export interface STooltipProps {
  text?: string
  placement?: STooltipPlacement
  delay?: number
  disabled?: boolean
  describedBy?: string
}
export interface STooltipTrigger {
  'aria-describedby'?: string
  onFocus: () => void
  onBlur: () => void
  onKeydown: (event: KeyboardEvent) => void
}

import type { SButtonColor, SButtonSize, SButtonVariant } from './SButton.types'

export interface SCopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  errorLabel?: string
  errorDescription?: string
  disabled?: boolean
  size?: SButtonSize
  variant?: SButtonVariant
  color?: SButtonColor
  resetDelay?: number
}
export interface SCopyButtonState {
  copied: boolean
  failed: boolean
  pending: boolean
}

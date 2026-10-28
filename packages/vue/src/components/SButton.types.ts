import type { Component } from 'vue'

export type SButtonColor = 'primary' | 'success' | 'warning' | 'danger'
export type SButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost'
export type SButtonSize = 'sm' | 'md' | 'lg'

export type SButtonAs = 'button' | 'a' | Component

export interface SButtonProps {
  as?: SButtonAs
  href?: string
  color?: SButtonColor
  variant?: SButtonVariant
  size?: SButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

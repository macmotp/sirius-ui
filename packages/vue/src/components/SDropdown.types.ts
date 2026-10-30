import type { Component } from 'vue'
import type { SButtonSize, SButtonVariant } from './SButton.types'

export interface SDropdownItem {
  id: string
  label: string
  href?: string
  target?: string
  rel?: string
  icon?: Component
  disabled?: boolean
  danger?: boolean
  separatorBefore?: boolean
}
export interface SDropdownProps {
  items?: readonly SDropdownItem[]
  label?: string
  disabled?: boolean
  align?: 'start' | 'end'
  size?: SButtonSize
  variant?: SButtonVariant
}

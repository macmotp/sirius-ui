export type SBadgeColor = 'primary' | 'success' | 'warning' | 'danger'
export type SBadgeVariant = 'soft' | 'solid' | 'outline'
export type SBadgeSize = 'sm' | 'md' | 'lg'

export interface SBadgeProps {
  color?: SBadgeColor
  variant?: SBadgeVariant
  size?: SBadgeSize
}

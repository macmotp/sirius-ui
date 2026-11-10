import type { SBadgeColor } from '@sirius-ui/vue'

export interface SMetricCardComparison {
  value: string
  label?: string
  color?: SBadgeColor
}

export interface SMetricCardProps {
  label: string
  value?: string | number
  detail?: string
  color?: SBadgeColor
  comparison?: SMetricCardComparison
  loading?: boolean
  loadingLabel?: string
}

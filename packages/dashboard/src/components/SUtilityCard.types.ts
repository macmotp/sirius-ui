export interface SUtilityCardRow {
  id: string
  label: string
  value: string | number
}

export interface SUtilityCardProps {
  title: string
  rows: readonly SUtilityCardRow[]
}

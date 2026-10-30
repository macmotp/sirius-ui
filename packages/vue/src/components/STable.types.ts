export interface STableColumn<T extends object = Record<string, unknown>> {
  key: string
  label: string
  value?: (row: T) => unknown
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
}
export interface STableSort {
  key: string
  direction: 'asc' | 'desc'
}
export interface STableCell<T extends object> {
  row: T
  column: STableColumn<T>
  value: unknown
  index: number
  loading: boolean
}
export interface STableProps<T extends object> {
  rows?: readonly T[]
  columns: readonly STableColumn<T>[]
  rowKey: Extract<keyof T, string> | ((row: T) => string | number)
  caption: string
  loading?: boolean
  sort?: STableSort | null
  emptyText?: string
  loadingText?: string
}

export interface STimelineItem {
  id: string
  title: string
  detail?: string
  time?: { label: string; datetime: string }
}

export interface STimelineProps<T extends STimelineItem = STimelineItem> {
  items: readonly T[]
  label?: string
  emptyText?: string
}

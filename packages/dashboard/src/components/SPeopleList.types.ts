export interface SPeopleListItem {
  id: string
  name: string
  email?: string
  role?: string
  avatarSrc?: string
  href?: string
  presence?: { kind: 'online' } | { kind: 'last-seen'; label: string; datetime: string }
}

export interface SPeopleListProps {
  people: readonly SPeopleListItem[]
  label?: string
  onlineLabel?: string
  lastSeenLabel?: string
  emptyText?: string
}

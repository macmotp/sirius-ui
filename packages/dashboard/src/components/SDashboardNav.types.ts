import type { Component } from 'vue'

export interface SDashboardNavItem {
  id: string
  label: string
  href: string
  icon?: Component
  badge?: string | number
  /** Accessible badge text, for example "3 unread updates". */
  badgeLabel?: string
  disabled?: boolean
  target?: string
  rel?: string
  linkProps?: Record<string, unknown>
}
export interface SDashboardNavGroup<T extends SDashboardNavItem = SDashboardNavItem> {
  id: string
  label?: string
  items: readonly T[]
}
export interface SDashboardNavProps<T extends SDashboardNavItem = SDashboardNavItem> {
  groups: readonly SDashboardNavGroup<T>[]
  current?: string
  linkAs?: 'a' | Component
}

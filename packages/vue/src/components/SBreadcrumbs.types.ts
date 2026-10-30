import type { Component } from 'vue'

export interface SBreadcrumbsItem {
  value: string
  label: string
  href?: string
  icon?: Component
  linkProps?: Record<string, unknown>
}

export interface SBreadcrumbsProps<T extends SBreadcrumbsItem = SBreadcrumbsItem> {
  items?: readonly T[]
  label?: string
  linkAs?: 'a' | Component
}

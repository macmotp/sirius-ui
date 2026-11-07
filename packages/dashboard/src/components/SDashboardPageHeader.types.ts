import type { Component } from 'vue'
import type { SBreadcrumbsItem } from '@sirius-ui/vue'

export interface SDashboardPageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  breadcrumbs?: readonly SBreadcrumbsItem[]
  breadcrumbLabel?: string
  breadcrumbLinkAs?: 'a' | Component
}

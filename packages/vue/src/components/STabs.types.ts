import type { Component } from 'vue'

export interface STabsItem {
  value: string
  label: string
  disabled?: boolean
  icon?: Component
}
export type STabsSize = 'sm' | 'md' | 'lg'
export interface STabsProps<T extends STabsItem = STabsItem> {
  items?: readonly T[]
  label?: string
  orientation?: 'horizontal' | 'vertical'
  activation?: 'automatic' | 'manual'
  variant?: 'line' | 'pills'
  size?: STabsSize
  keepAlive?: boolean
}

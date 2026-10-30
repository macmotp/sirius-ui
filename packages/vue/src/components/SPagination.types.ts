import type { Component } from 'vue'

export interface SPaginationLink {
  url: string | null
  label: string
  active: boolean
}
export interface SPaginationMeta {
  current_page?: number
  last_page?: number
  from?: number | null
  to?: number | null
  total?: number
  links?: readonly SPaginationLink[]
}
export interface SPaginationData {
  current_page?: number
  last_page?: number
  from?: number | null
  to?: number | null
  total?: number
  prev_page_url?: string | null
  next_page_url?: string | null
  links?: readonly SPaginationLink[] | {
    first?: string | null
    last?: string | null
    prev?: string | null
    next?: string | null
  }
  meta?: SPaginationMeta
}
export interface SPaginationProps {
  pagination: SPaginationData
  mode?: 'link' | 'event'
  linkAs?: 'a' | Component
  linkProps?: Record<string, unknown>
  loading?: boolean
  label?: string
  previousLabel?: string
  nextLabel?: string
}

import type { Component } from 'vue'

export interface SEmptyStateProps {
  title?: string
  description?: string
  icon?: Component | false
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

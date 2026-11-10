<script setup lang="ts">
import { CircleHelp, House, Settings2, Calendar, FileText, Package, ChartColumn } from '../../../shared/icons'
import { SDashboardNav } from '@sirius-ui/dashboard'
import type { SDashboardNavGroup, SDashboardNavItem } from '@sirius-ui/dashboard'

import type { DemoPage } from '../data/demo'
import { isPlainLinkClick } from '../data/demo'
defineProps<{ current: DemoPage }>()
const emit = defineEmits<{ navigate: [page: DemoPage] }>()
const groups: SDashboardNavGroup[] = [
  { id: 'home', items: [{ id: 'overview', label: 'Overview', href: '#overview', icon: House }] },
  {
    id: 'examples', label: 'Page examples', items: [
      { id: 'cards', label: 'Cards', href: '#cards', icon: Package },
      { id: 'orders', label: 'Tables', href: '#tables', icon: FileText },
      { id: 'calendar', label: 'Calendar', href: '#calendar', icon: Calendar },
      { id: 'charts', label: 'Charts', href: '#charts', icon: ChartColumn },
      { id: 'settings', label: 'Settings', href: '#settings', icon: Settings2 },
    ],
  },
]
function select(item: SDashboardNavItem, event: MouseEvent) {
  // Preserve browser behavior for modified clicks and links to other browsing contexts.
  if (!isPlainLinkClick(event) || (item.target && item.target !== '_self')) return
  if (item.id !== 'overview' && item.id !== 'settings' && item.id !== 'orders' && item.id !== 'charts' && item.id !== 'cards' && item.id !== 'calendar') return
  event.preventDefault()
  emit('navigate', item.id)
}
</script>

<template>
  <div>
    <SDashboardNav :groups="groups" :current="current" @select="select" />
    <div class="mt-8 rounded-2xl bg-surface p-4 ring-1 ring-inset ring-line">
      <CircleHelp aria-hidden="true" class="mb-3 size-5 text-primary-content" />
      <p class="text-sm font-medium">Built with Sirius.</p>
      <p class="mt-2 text-xs leading-relaxed text-content-muted">Explore page patterns, try the controls and make the workspace your own.</p>
    </div>
  </div>
</template>

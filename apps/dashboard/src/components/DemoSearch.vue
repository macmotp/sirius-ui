<script setup lang="ts">
import { computed, shallowRef, useId, watch } from 'vue'
import { ArrowUpRight, Search } from '../../../shared/icons'
import { SDialog, SInput } from '@sirius-ui/vue'
import { isPlainLinkClick } from '../data/demo'
import type { DemoPage } from '../data/demo'
const emit = defineEmits<{ navigate: [page: DemoPage] }>()
const open = shallowRef(false)
const query = shallowRef('')
const id = useId()
const entries: { id: string; title: string; description: string; page: DemoPage; keywords: string }[] = [
  { id: 'overview', title: 'Workspace overview', description: 'Business metrics and daily tasks', page: 'overview', keywords: 'home dashboard business' },
  { id: 'charts', title: 'Charts', description: 'Simple line charts, daily trends and chart states', page: 'charts', keywords: 'line graph chart sales trends' },
  { id: 'activity', title: 'Recent activity', description: 'Orders, products, and customer updates', page: 'activity', keywords: 'history updates' },
  { id: 'order', title: 'Tables', description: 'Search, filter and browse the orders table', page: 'orders', keywords: 'table tables order dispatch delivery package' },
  { id: 'example-order', title: 'Order #1048', description: 'Processing · View orders', page: 'orders', keywords: '1048' },
  { id: 'collection', title: 'Spring collection', description: 'Six product drafts · View in recent activity', page: 'activity', keywords: 'products catalogue collection' },
  { id: 'enquiry', title: 'Customer enquiry', description: 'Delivery question · View in recent activity', page: 'activity', keywords: 'customer support help delivery' },
  { id: 'settings', title: 'Appearance settings', description: 'Background color and dark mode', page: 'settings', keywords: 'preferences theme light dark palette' },
  { id: 'profile', title: 'Alex Morgan', description: 'Operations manager · View profile', page: 'profile', keywords: 'account profile email owner' },
]
const term = computed(() => query.value.trim().toLowerCase())
const results = computed(() => term.value ? entries.filter(entry => `${entry.title} ${entry.description} ${entry.keywords}`.toLowerCase().includes(term.value)) : [])
watch(open, value => { if (value) query.value = '' })
function choose(page: DemoPage, event: MouseEvent) {
  if (!isPlainLinkClick(event)) return
  event.preventDefault()
  open.value = false
  emit('navigate', page)
}
</script>

<template>
  <button type="button" class="acme-icon-button" aria-label="Search Acme" aria-haspopup="dialog" :aria-expanded="open" :aria-controls="`${id}-search`" @click="open = true"><Search aria-hidden="true" class="size-5" /></button>
  <SDialog :id="`${id}-search`" v-model:open="open" title="Search Acme" description="Find pages and example business records." size="md">
    <SInput v-model="query" type="search" autofocus autocomplete="off" aria-label="Search pages and records" :aria-describedby="`${id}-search-status`" placeholder="Search orders, customers, settings…"><template #leading><Search /></template></SInput>
    <p :id="`${id}-search-status`" role="status" aria-atomic="true" class="mt-4 text-xs text-content-muted">{{ !term ? 'Start typing to search.' : results.length ? `${results.length} result${results.length === 1 ? '' : 's'} found. Use Tab to browse results.` : 'No results found. Try a different search.' }}</p>
    <ul v-if="results.length" aria-label="Search results" class="mt-3 max-h-80 space-y-1 overflow-y-auto">
      <li v-for="result in results" :key="result.id"><a :href="`#${result.page}`" class="acme-menu-item justify-between" @click="choose(result.page, $event)"><span class="min-w-0"><span class="block break-words font-medium">{{ result.title }}</span><span class="mt-1 block break-words text-xs text-content-muted">{{ result.description }}</span></span><ArrowUpRight aria-hidden="true" class="size-4 shrink-0" /></a></li>
    </ul>
  </SDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import SButton from './SButton.vue'
import { paginationLabel, paginationState } from './pagination'
import type { SPaginationProps } from './SPagination.types'

const props = withDefaults(defineProps<SPaginationProps>(), {
  mode: 'link', linkAs: 'a', loading: false, label: 'Pagination', previousLabel: 'Previous', nextLabel: 'Next',
})
const emit = defineEmits<{ navigate: [url: string, event: MouseEvent] }>()
defineSlots<{ summary?(props: { currentPage?: number; lastPage?: number; from?: number | null; to?: number | null; total?: number }): unknown }>()
const state = computed(() => paginationState(props.pagination))
const controls = computed(() => [
  { key: 'previous', url: state.value.previous, text: props.previousLabel, active: false, kind: 'previous' },
  ...state.value.pages.map((link, index) => ({ key: `page-${index}`, url: link.url, text: paginationLabel(link.label), active: link.active, kind: 'page' })),
  { key: 'next', url: state.value.next, text: props.nextLabel, active: false, kind: 'next' },
])
function navigate(url: string | null, event: MouseEvent) {
  if (!url || props.loading) return
  emit('navigate', url, event)
}
</script>

<template>
  <nav :aria-label="label" :aria-busy="loading" class="flex min-w-0 flex-wrap items-center justify-between gap-4 font-sans text-sm">
    <div class="text-content-muted">
      <slot name="summary" :current-page="state.meta.current_page" :last-page="state.meta.last_page" :from="state.meta.from" :to="state.meta.to" :total="state.meta.total">
        <span v-if="state.meta.total === 0">{{ loading ? 'Loading results…' : 'No results' }}</span>
        <span v-else-if="state.meta.from != null && state.meta.to != null && state.meta.total != null">Showing {{ state.meta.from }}–{{ state.meta.to }} of {{ state.meta.total }}</span>
        <span v-else-if="state.meta.current_page != null">Page {{ state.meta.current_page }}<template v-if="state.meta.last_page != null"> of {{ state.meta.last_page }}</template></span>
      </slot>
    </div>
    <ul class="m-0 flex list-none flex-wrap items-center gap-1 p-0">
      <li v-for="control in controls" :key="control.key">
        <span v-if="control.active" aria-current="page" :aria-label="`Page ${control.text}`" class="inline-flex min-h-8 min-w-8 items-center justify-center rounded-control bg-primary-soft px-3 py-1.5 font-medium text-primary-content">{{ control.text }}</span>
        <span v-else-if="control.kind === 'page' && control.url === null" class="px-2 text-content-muted">{{ control.text }}</span>
        <SButton
          v-else
          v-bind="mode === 'link' ? linkProps : undefined"
          :as="mode === 'link' ? linkAs : 'button'"
          :href="mode === 'link' ? control.url ?? undefined : undefined"
          type="button"
          :disabled="loading || !control.url"
          :aria-label="control.kind === 'page' ? `Go to page ${control.text}` : control.text"
          :rel="control.kind === 'previous' ? 'prev' : control.kind === 'next' ? 'next' : undefined"
          variant="ghost"
          size="sm"
          @click="navigate(control.url, $event)"
        >
          <template v-if="control.kind === 'previous'" #leading><ChevronLeft class="rtl:rotate-180" /></template>
          {{ control.text }}
          <template v-if="control.kind === 'next'" #trailing><ChevronRight class="rtl:rotate-180" /></template>
        </SButton>
      </li>
    </ul>
  </nav>
</template>

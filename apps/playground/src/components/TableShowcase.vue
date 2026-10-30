<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { SBadge, SButton, SCheckbox, SPagination, STable } from '@sirius-ui/vue'
import type { STableColumn, STableSort } from '@sirius-ui/vue'
import { memberUrl, requestMembers } from '../demos/tableApi'
import SelectionTableShowcase from './SelectionTableShowcase.vue'
import LargePaginationShowcase from './LargePaginationShowcase.vue'
import type { DemoMember } from '../demos/tableApi'

const columns: STableColumn<DemoMember>[] = [
  { key: 'name', label: 'Member', sortable: true },
  { key: 'team', label: 'Team', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', align: 'end' },
]
const response = shallowRef<Awaited<ReturnType<typeof requestMembers>>>({ data: [], current_page: 1, last_page: 1, per_page: 3, total: 0, from: null, to: null, prev_page_url: null, next_page_url: null, links: [] })
const sort = shallowRef<STableSort | null>(null)
const loading = shallowRef(true)
const resource = shallowRef(false)
const empty = shallowRef(false)
const message = shallowRef('Loading demo members…')
let controller: AbortController | undefined
const pagination = computed(() => resource.value ? {
  links: { prev: response.value.prev_page_url, next: response.value.next_page_url },
  meta: { current_page: response.value.current_page, last_page: response.value.last_page, total: response.value.total, from: response.value.from, to: response.value.to, links: response.value.links },
} : response.value)
async function load(url: string, nextSort = sort.value) {
  controller?.abort()
  const request = new AbortController()
  controller = request
  loading.value = true
  try {
    const result = await requestMembers(url, request.signal)
    if (request.signal.aborted) return
    response.value = result
    sort.value = nextSort
    message.value = `Page ${result.current_page} loaded. ${result.data.length} members shown.`
  } catch (error) {
    if (!request.signal.aborted) message.value = 'Unable to load demo members. Use Reload to retry.'
  } finally { if (!request.signal.aborted) loading.value = false }
}
function sortMembers(next: STableSort) { load(memberUrl(1, next, empty.value), next) }
function toggleEmpty(value: boolean) { empty.value = value; load(memberUrl(1, sort.value, value)) }
onMounted(() => load(memberUrl(1, null)))
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <section id="tables" class="border-t border-line py-10" aria-labelledby="tables-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3">
      <h3 id="tables-title" class="text-xl font-semibold">Rows from your API</h3>
      <SBadge>STable · SPagination</SBadge>
    </div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">This demo service simulates Laravel responses with a short delay. Components render only the returned page; sorting and page changes request another response.</p>
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <SCheckbox v-model="resource" label="Use API Resource response shape" />
      <SCheckbox :model-value="empty" label="Return an empty result" @update:model-value="toggleEmpty" />
      <SButton variant="outline" size="sm" :disabled="loading" @click="load(memberUrl(response.current_page, sort, empty))">Reload members</SButton>
    </div>
    <STable :rows="response.data" :columns="columns" row-key="id" caption="Workspace members" :loading="loading" :sort="sort" @sort="sortMembers">
      <template #cell="{ row, column, value, loading: pending }">
        <div v-if="column.key === 'name'" class="min-w-48"><span class="font-medium">{{ row.name }}</span><p class="m-0 text-xs text-content-muted">{{ row.email }}</p></div>
        <SBadge v-else-if="column.key === 'status'" :color="row.status === 'Active' ? 'success' : 'warning'">{{ row.status }}</SBadge>
        <SButton v-else-if="column.key === 'actions'" size="sm" variant="ghost" :disabled="pending" :aria-label="`View ${row.name}`" @click="message = `${row.name} selected. This action is local to the demo.`">View</SButton>
        <span v-else class="whitespace-nowrap">{{ value }}</span>
      </template>
    </STable>
    <div id="pagination" class="mt-5">
      <SPagination :pagination="pagination" mode="event" :loading="loading" label="Members pagination" @navigate="url => load(url)" />
    </div>
    <p role="status" class="mt-4 text-xs text-content-muted">{{ message }}</p>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;STable :rows="response.data" :columns="columns" row-key="id" caption="Members" /&gt;
&lt;SPagination :pagination="response" mode="event" @navigate="loadPage" /&gt;</code></pre>
    <h4 class="mt-8 text-sm font-semibold">Simple or cursor pagination</h4>
    <p class="my-3 text-sm text-content-muted">When the API supplies only previous/next URLs, no page numbers or totals are invented. These native links demonstrate navigation only.</p>
    <SPagination :pagination="{ prev_page_url: null, next_page_url: '#tables' }" label="Simple pagination example" />
    <LargePaginationShowcase />
    <SelectionTableShowcase />
  </section>
</template>

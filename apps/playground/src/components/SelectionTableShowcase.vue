<script setup lang="ts">
import { computed, nextTick, shallowRef, useTemplateRef } from 'vue'
import { SBadge, SButton, SCheckbox, SDropdown, STable } from '@sirius-ui/vue'
import type { SDropdownItem, STableColumn } from '@sirius-ui/vue'

interface Member { id: number; name: string; team: string; status: string }
const root = useTemplateRef<HTMLDivElement>('root')
const rows = shallowRef<Member[]>([
  { id: 11, name: 'Alex Morgan', team: 'Design', status: 'Active' },
  { id: 12, name: 'Sam Chen', team: 'Engineering', status: 'Invited' },
  { id: 13, name: 'Jordan Lee', team: 'Operations', status: 'Invited' },
])
const columns: STableColumn<Member>[] = [
  { key: 'selection', label: 'Selection', align: 'center' },
  { key: 'name', label: 'Member' },
  { key: 'team', label: 'Team' },
  { key: 'status', label: 'Status' },
]
const selected = shallowRef<number[]>([])
const announcement = shallowRef('No members selected.')
const allSelected = computed(() => rows.value.length > 0 && selected.value.length === rows.value.length)
const partiallySelected = computed(() => selected.value.length > 0 && !allSelected.value)
const actions: SDropdownItem[] = [
  { id: 'active', label: 'Mark as active (demo)' },
  { id: 'invited', label: 'Mark as invited (demo)' },
]
function announceSelection() {
  announcement.value = selected.value.length ? `${selected.value.length} member${selected.value.length === 1 ? '' : 's'} selected on this page.` : 'No members selected.'
}
function toggleRow(id: number, checked: boolean) {
  selected.value = checked ? [...new Set([...selected.value, id])] : selected.value.filter(value => value !== id)
  announceSelection()
}
function toggleAll(checked: boolean) {
  selected.value = checked ? rows.value.map(row => row.id) : []
  announceSelection()
}
function applyAction(action: SDropdownItem) {
  const status = action.id === 'active' ? 'Active' : 'Invited'
  rows.value = rows.value.map(row => selected.value.includes(row.id) ? { ...row, status } : row)
  announcement.value = `Marked ${selected.value.length} selected members as ${status.toLowerCase()}. Demo only; no API request was sent.`
}
async function clearSelection() {
  toggleAll(false)
  await nextTick()
  root.value?.querySelector<HTMLInputElement>('thead input')?.focus()
}
</script>

<template>
  <div ref="root" class="mt-10">
    <h4 class="text-lg font-semibold">Select rows and apply a bulk action</h4>
    <p class="my-3 max-w-2xl text-sm leading-relaxed text-content-muted">Selection belongs to this example. Select-all affects the three displayed rows only. The action menu appears when any row is selected and opens when you activate it.</p>
    <div v-if="selected.length" class="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-primary-soft p-4 text-sm text-primary-content">
      <span class="font-medium">{{ selected.length }} selected on this page</span>
      <SDropdown label="Selected member actions" :items="actions" variant="outline" size="sm" align="start" @select="applyAction" />
      <SButton size="sm" variant="ghost" @click="clearSelection">Clear selection</SButton>
    </div>
    <STable :rows="rows" :columns="columns" row-key="id" caption="Members with row selection">
      <template #header="{ column }">
        <SCheckbox
          v-if="column.key === 'selection'"
          :model-value="allSelected"
          :indeterminate="partiallySelected"
          aria-label="Select all displayed members"
          @update:model-value="toggleAll"
        />
        <span v-else>{{ column.label }}</span>
      </template>
      <template #cell="{ row, column, value }">
        <SCheckbox
          v-if="column.key === 'selection'"
          :model-value="selected.includes(row.id)"
          :aria-label="`Select ${row.name}`"
          @update:model-value="toggleRow(row.id, $event)"
        />
        <SBadge v-else-if="column.key === 'status'" :color="row.status === 'Active' ? 'success' : 'warning'">{{ value }}</SBadge>
        <span v-else>{{ value }}</span>
      </template>
    </STable>
    <p role="status" class="mt-3 text-xs text-content-muted">{{ announcement }}</p>
  </div>
</template>

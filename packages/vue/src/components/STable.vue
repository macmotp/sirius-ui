<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle } from '@lucide/vue'
import type { STableCell, STableColumn, STableProps, STableSort } from './STable.types'

const { rows = [], columns, rowKey, caption, loading = false, sort = null, emptyText = 'No results found.', loadingText = 'Loading results…' } = defineProps<STableProps<T>>()
const emit = defineEmits<{ sort: [sort: STableSort] }>()
defineSlots<{
  cell?(props: STableCell<T>): unknown
  header?(props: { column: STableColumn<T> }): unknown
  empty?(): unknown
  loading?(): unknown
}>()
const alignment = { start: 'text-start', center: 'text-center', end: 'text-end' }
function keyFor(row: T) {
  return typeof rowKey === 'function' ? rowKey(row) : row[rowKey] as string | number
}
function cellValue(row: T, column: STableColumn<T>) {
  return column.value ? column.value(row) : row[column.key as keyof T]
}
const displayRows = computed(() => rows.map(row => ({
  row,
  key: keyFor(row),
  cells: columns.map(column => ({ column, value: cellValue(row, column) })),
})))
function requestSort(column: STableColumn<T>) {
  if (loading || !column.sortable) return
  emit('sort', { key: column.key, direction: sort?.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc' })
}
</script>

<template>
  <div :aria-busy="loading" class="relative min-w-0 rounded-2xl bg-surface font-sans text-content after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line">
    <div role="region" :aria-label="caption" tabindex="0" class="overflow-x-auto rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus">
      <table class="w-full border-collapse text-sm leading-6">
        <caption class="sr-only">{{ caption }}</caption>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="column.sortable ? sort?.key === column.key ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined"
              class="border-b border-solid border-line px-5 py-3 font-semibold"
              :class="alignment[column.align ?? 'start']"
            >
              <button
                v-if="column.sortable"
                type="button"
                :disabled="loading"
                :aria-label="`Sort by ${column.label}, ${sort?.key === column.key && sort.direction === 'asc' ? 'descending' : 'ascending'}`"
                class="inline-flex cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent p-0 text-[inherit] font-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50"
                @click="requestSort(column)"
              >
                <slot name="header" :column="column">{{ column.label }}</slot>
                <component :is="sort?.key === column.key ? sort.direction === 'asc' ? ArrowUp : ArrowDown : ArrowUpDown" aria-hidden="true" focusable="false" class="size-4 shrink-0" />
              </button>
              <slot v-else name="header" :column="column">{{ column.label }}</slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in displayRows" :key="entry.key" class="hover:bg-surface-hover">
            <td v-for="{ column, value } in entry.cells" :key="column.key" class="border-b border-solid border-line px-5 py-4" :class="alignment[column.align ?? 'start']">
              <slot name="cell" :row="entry.row" :column="column" :value="value" :index="index" :loading="loading">{{ value }}</slot>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td :colspan="Math.max(1, columns.length)" class="px-5 py-10 text-center text-content-muted">
              <slot v-if="loading" name="loading">{{ loadingText }}</slot>
              <slot v-else name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="loading && rows.length > 0" role="status" class="m-0 flex items-center gap-2 px-5 py-3 text-sm text-content-muted">
      <LoaderCircle aria-hidden="true" focusable="false" class="size-4 motion-safe:animate-spin" />{{ loadingText }}
    </p>
  </div>
</template>

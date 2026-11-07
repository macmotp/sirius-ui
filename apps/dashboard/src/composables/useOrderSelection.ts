import { computed, readonly, shallowRef, watch } from 'vue'
import type { Order } from '../data/orders'

export function useOrderSelection(rows: () => readonly Order[], busy: () => boolean) {
  const selected = shallowRef<number[]>([])
  const selectedRows = computed(() => rows().filter(row => selected.value.includes(row.id)))
  const fulfillable = computed(() => selectedRows.value.filter(row => row.status === 'processing').map(row => row.id))
  function clear() { selected.value = [] }
  watch(rows, clear)
  function toggle(id: number, checked: boolean) {
    if (busy() || !rows().some(row => row.id === id)) return
    selected.value = checked ? [...new Set([...selected.value, id])] : selected.value.filter(value => value !== id)
  }
  function all(checked: boolean) { if (!busy()) selected.value = checked ? rows().map(row => row.id) : [] }
  return { selected: readonly(selected), selectedRows, fulfillable, clear, toggle, all }
}

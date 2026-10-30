import { readonly, shallowRef } from 'vue'
import type { SToastItem, SToastOptions } from '../components/SToast.types'

// Call once per intended host/app scope. Separate calls have independent state.
export function useToasts() {
  const items = shallowRef<SToastItem[]>([])
  let sequence = 0
  function notify(options: SToastOptions) {
    const id = `toast-${++sequence}`
    items.value = [...items.value, { ...options, id }]
    return id
  }
  function dismiss(id: string) { items.value = items.value.filter(item => item.id !== id) }
  function clear() { items.value = [] }
  return { items: readonly(items), notify, dismiss, clear }
}

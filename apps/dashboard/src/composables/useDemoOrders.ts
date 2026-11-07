import { computed, onScopeDispose, readonly, shallowRef } from 'vue'
import { defaultOrdersQuery, ordersQueryFromUrl } from '../data/orders'
import type { OrdersApi, OrderFilters, OrdersPage, OrdersQuery } from '../data/orders'
import type { STableSort } from '@sirius-ui/vue'

export function useDemoOrders(api: OrdersApi, initialQuery: Partial<OrdersQuery> = {}) {
  const query = shallowRef<OrdersQuery>({ ...defaultOrdersQuery(), ...initialQuery })
  const page = shallowRef<OrdersPage>()
  const loading = shallowRef(false)
  const mutating = shallowRef(false)
  const error = shallowRef('')
  const mutationError = shallowRef('')
  const busy = computed(() => loading.value || mutating.value)
  let controller: AbortController | undefined
  let mutationController: AbortController | undefined
  let sequence = 0
  let disposed = false

  async function load(next = query.value): Promise<boolean> {
    if (disposed || mutating.value) return false
    const request = ++sequence
    controller?.abort()
    const current = new AbortController()
    controller = current
    query.value = { ...next }
    loading.value = true
    error.value = ''
    mutationError.value = ''
    try {
      const response = await api.list({ ...next }, current.signal)
      if (disposed || current.signal.aborted || request !== sequence) return false
      page.value = response
      query.value = { ...next, page: response.current_page }
      return true
    } catch (cause) {
      if (!disposed && !current.signal.aborted && request === sequence) error.value = cause instanceof Error ? cause.message : 'Orders could not be loaded.'
      return false
    } finally {
      if (!disposed && request === sequence) loading.value = false
    }
  }
  function applyFilters(filters: OrderFilters) { return load({ ...query.value, ...filters, q: filters.q.trim(), page: 1 }) }
  function sort(value: STableSort) {
    if (!['id', 'customer', 'created_at', 'total'].includes(value.key)) return Promise.resolve(false)
    return load({ ...query.value, sort: value.key as OrdersQuery['sort'], direction: value.direction, page: 1 })
  }
  function navigate(url: string) {
    try { return load(ordersQueryFromUrl(url)) }
    catch { error.value = 'This orders pagination link is invalid.'; return Promise.resolve(false) }
  }
  function pageSize(value: string) { return load({ ...query.value, per_page: Number(value), page: 1 }) }
  async function fulfill(ids: readonly number[]): Promise<boolean> {
    if (busy.value || disposed) return false
    mutationController = new AbortController()
    mutating.value = true
    mutationError.value = ''
    try {
      await api.fulfill([...ids], mutationController.signal)
      if (disposed) return false
      mutating.value = false
      await load()
      return true // Mutation succeeded even if the subsequent refresh failed.
    } catch (cause) {
      if (!disposed) mutationError.value = cause instanceof Error ? cause.message : 'Orders could not be updated.'
      return false
    } finally { if (!disposed) mutating.value = false }
  }
  onScopeDispose(() => { disposed = true; sequence++; controller?.abort(); mutationController?.abort() })
  void load()
  return { query: readonly(query), page: readonly(page), loading: readonly(loading), mutating: readonly(mutating), busy, error: readonly(error), mutationError: readonly(mutationError), reload: () => load(), applyFilters, sort, navigate, pageSize, fulfill, clearMutationError: () => { mutationError.value = '' } }
}

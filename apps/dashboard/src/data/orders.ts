import type { SPaginationData } from '@sirius-ui/vue'

export type OrderStatus = 'processing' | 'fulfilled' | 'cancelled'
export type OrderSort = 'id' | 'customer' | 'created_at' | 'total'
export interface OrderLine { name: string; quantity: number; price: number }
export interface Order {
  id: number
  customer: string
  email: string
  created_at: string
  status: OrderStatus
  items: readonly OrderLine[]
  total: number // Integer cents, always SGD in this fixture.
}
export interface OrderFilters { q: string; status: string; from: string; to: string }
export interface OrdersQuery extends OrderFilters { page: number; per_page: number; sort: OrderSort; direction: 'asc' | 'desc' }
export interface OrdersPage extends SPaginationData {
  data: Order[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  summary: { processing: number; fulfilled: number; sales: number }
}
export interface OrdersApi {
  list(query: OrdersQuery, signal: AbortSignal): Promise<OrdersPage>
  fulfill(ids: readonly number[], signal: AbortSignal): Promise<void>
}
export const emptyOrderFilters = (): OrderFilters => ({ q: '', status: '', from: '', to: '' })
export const defaultOrdersQuery = (): OrdersQuery => ({ ...emptyOrderFilters(), page: 1, per_page: 10, sort: 'created_at', direction: 'desc' })
export const statusLabels: Record<OrderStatus, string> = { processing: 'Processing', fulfilled: 'Fulfilled', cancelled: 'Cancelled' }
export const statusColors = { processing: 'primary', fulfilled: 'success', cancelled: 'danger' } as const
export const statusOptions = [{ value: 'all', label: 'All statuses' }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))]
export const pageSizeOptions = [10, 25, 50].map(value => ({ value: String(value), label: String(value) }))
const money = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' })
const date = new Intl.DateTimeFormat('en-SG', { dateStyle: 'medium', timeZone: 'UTC' })
export const orderMoney = (cents: number) => money.format(cents / 100)
export const orderDate = (value: string) => date.format(new Date(value))
export const orderQuantity = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
export function ordersUrl(query: OrdersQuery): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) if (value !== '') params.set(key, String(value))
  return `/api/orders?${params}`
}
export function ordersQueryFromUrl(url: string): OrdersQuery {
  const parsed = new URL(url, 'https://acme.example')
  if (parsed.pathname !== '/api/orders') throw new Error('Invalid orders pagination link.')
  const params = parsed.searchParams
  const query = defaultOrdersQuery()
  for (const key of ['q', 'status', 'from', 'to'] as const) query[key] = params.get(key) ?? ''
  query.page = Number(params.get('page') ?? 1)
  query.per_page = Number(params.get('per_page') ?? 10)
  query.sort = (params.get('sort') ?? query.sort) as OrderSort
  query.direction = (params.get('direction') ?? query.direction) as OrdersQuery['direction']
  return query
}
export function filterError(filters: OrderFilters): string {
  for (const value of [filters.from, filters.to]) {
    if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) return 'Enter valid dates for the date range.'
  }
  return filters.from && filters.to && filters.from > filters.to ? 'The start date must be on or before the end date.' : ''
}
export function ordersCsv(rows: readonly Order[]): string {
  const cell = (value: string | number) => {
    const raw = String(value)
    const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw
    return `"${safe.replaceAll('"', '""')}"`
  }
  const lines = [
    ['Order', 'Customer', 'Email', 'Date (UTC)', 'Status', 'Items', 'Currency', 'Total'],
    ...rows.map(row => [row.id, row.customer, row.email, row.created_at, statusLabels[row.status], orderQuantity(row), 'SGD', (row.total / 100).toFixed(2)]),
  ]
  return '\uFEFF' + lines.map(line => line.map(cell).join(',')).join('\r\n')
}
export function downloadOrdersCsv(rows: readonly Order[]) {
  const url = URL.createObjectURL(new Blob([ordersCsv(rows)], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'acme-orders.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

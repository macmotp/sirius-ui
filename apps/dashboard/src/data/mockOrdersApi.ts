import { filterError, ordersUrl } from './orders'
import type { Order, OrdersApi, OrdersPage, OrdersQuery, OrderStatus } from './orders'

const people = [
  { name: 'Sam Chen', email: 'sam@acme.example' },
  { name: 'Jordan Lee', email: 'jordan@acme.example' },
  { name: 'Taylor Brooks', email: 'taylor@acme.example' },
  { name: 'Casey Tan', email: 'casey@acme.example' },
  { name: 'Riley James', email: 'riley@acme.example' },
  { name: 'Jamie Lim', email: 'jamie@acme.example' },
  { name: 'Morgan Ellis', email: 'morgan@acme.example' },
  { name: 'Avery Ng', email: 'avery@acme.example' },
  { name: 'Robin Shaw', email: 'robin@acme.example' },
  { name: 'Drew Wong', email: 'drew@acme.example' },
  { name: 'Quinn Park', email: 'quinn@acme.example' },
  { name: 'Alex Carter', email: 'alex.carter@acme.example' },
]
const products = [{ name: 'Everyday tote', price: 2800 }, { name: 'Stoneware mug', price: 2400 }, { name: 'Desk notebook', price: 1800 }, { name: 'Linen cushion', price: 4200 }, { name: 'Glass carafe', price: 3600 }, { name: 'Cotton throw', price: 6800 }]
function fixtures(): Order[] {
  return Array.from({ length: 96 }, (_, index) => {
    const first = products[index % products.length]!
    const second = products[(index + 2) % products.length]!
    const items = [{ ...first, quantity: index % 3 + 1 }, { ...second, quantity: 1 }]
    const created = new Date(Date.UTC(2026, 10, 6, 10) - index * 8 * 60 * 60 * 1000)
    const statuses: OrderStatus[] = ['processing', 'fulfilled', 'fulfilled', 'processing', 'fulfilled', 'cancelled']
    const customer = people[index % people.length]!
    return { id: 1048 - index, customer: customer.name, email: customer.email, created_at: created.toISOString(), status: statuses[index % statuses.length]!, items, total: items.reduce((sum, line) => sum + line.price * line.quantity, 0) }
  })
}
function validate(query: OrdersQuery) {
  const error = filterError(query)
  if (error) throw new Error(error)
  if (!Number.isInteger(query.page) || query.page < 1 || ![5, 10, 25, 50].includes(query.per_page)) throw new Error('Invalid pagination parameters.')
  if (!['id', 'customer', 'created_at', 'total'].includes(query.sort) || !['asc', 'desc'].includes(query.direction)) throw new Error('Invalid sort parameters.')
  if (!['', 'processing', 'fulfilled', 'cancelled'].includes(query.status)) throw new Error('Invalid order status.')
}
function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(new DOMException('Request cancelled.', 'AbortError')) }
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, milliseconds)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
}

// This module stands in for a backend: all filtering, sorting, aggregates and
// page slicing happen here, never in the table or its request controller.
export function createDemoOrdersApi(delay = 260): OrdersApi & { failNextList(): void } {
  let records = fixtures()
  let failNext = false
  return {
    failNextList() { failNext = true },
    async list(request, signal): Promise<OrdersPage> {
      const query = { ...request }
      const shouldFail = failNext
      failNext = false
      await wait(delay, signal)
      validate(query)
      if (shouldFail) throw new Error('Orders could not be loaded. Please try again.')
      const term = query.q.trim().toLowerCase()
      const matching = records.filter(row => (!term || `${row.id} ${row.customer} ${row.email}`.toLowerCase().includes(term))
        && (!query.status || row.status === query.status)
        && (!query.from || row.created_at.slice(0, 10) >= query.from)
        && (!query.to || row.created_at.slice(0, 10) <= query.to))
      const summary = {
        processing: matching.filter(row => row.status === 'processing').length,
        fulfilled: matching.filter(row => row.status === 'fulfilled').length,
        sales: matching.reduce((sum, row) => sum + (row.status === 'cancelled' ? 0 : row.total), 0),
      }
      const sorted = [...matching].sort((a, b) => {
        const x = a[query.sort], y = b[query.sort]
        const comparison = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en')
        return (comparison || a.id - b.id) * (query.direction === 'asc' ? 1 : -1)
      })
      const last = Math.max(1, Math.ceil(sorted.length / query.per_page))
      const current = Math.min(query.page, last)
      const offset = (current - 1) * query.per_page
      const url = (page: number) => ordersUrl({ ...query, page })
      const numbers = [...new Set([1, current - 1, current, current + 1, last])].filter(value => value >= 1 && value <= last).sort((a, b) => a - b)
      const pageLinks: { label: string; url: string | null; active: boolean }[] = []
      numbers.forEach((number, index) => {
        if (index && number - numbers[index - 1]! > 1) pageLinks.push({ label: '…', url: null, active: false })
        pageLinks.push({ label: String(number), url: url(number), active: number === current })
      })
      const data = sorted.slice(offset, offset + query.per_page).map(row => ({ ...row, items: row.items.map(item => ({ ...item })) }))
      return {
        data, current_page: current, last_page: last, per_page: query.per_page, total: sorted.length,
        from: data.length ? offset + 1 : null, to: data.length ? offset + data.length : null,
        prev_page_url: current > 1 ? url(current - 1) : null, next_page_url: current < last ? url(current + 1) : null,
        links: [
          { label: '&laquo; Previous', url: current > 1 ? url(current - 1) : null, active: false },
          ...pageLinks,
          { label: 'Next &raquo;', url: current < last ? url(current + 1) : null, active: false },
        ], summary,
      }
    },
    async fulfill(ids, signal) {
      await wait(delay, signal)
      const unique = [...new Set(ids)]
      if (!unique.length || unique.some(id => !records.some(row => row.id === id && row.status === 'processing'))) throw new Error('Only processing orders can be marked as fulfilled. Refresh and try again.')
      records = records.map(row => unique.includes(row.id) ? { ...row, status: 'fulfilled' } : row)
    },
  }
}

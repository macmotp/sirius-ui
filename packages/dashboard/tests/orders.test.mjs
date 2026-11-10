import assert from 'node:assert/strict'
import test from 'node:test'
import { effectScope, nextTick, shallowRef } from 'vue'
import { loadDemo } from './demo-loader.mjs'
import { mountComponent } from '../../vue/tests/renderer.mjs'

async function fixture() {
  const demo = await loadDemo()
  const { createDemoOrdersApi } = await demo.module('data/mockOrdersApi.ts')
  const types = await demo.module('data/orders.ts')
  const api = createDemoOrdersApi(0)
  return { demo, api, types, query: types.defaultOrdersQuery(), signal: () => new AbortController().signal }
}
const nodes = (node, predicate) => [...(predicate(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, predicate))]
const find = (view, predicate) => nodes(view.element.parent ?? view.element, predicate)[0]
const text = node => (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')

test('orders adapter supplies Laravel metadata, stable page links and aggregates across the whole result', async () => {
  const f = await fixture()
  try {
    const first = await f.api.list(f.query, f.signal())
    assert.equal(first.data.length, 10)
    assert.equal(first.total, 96)
    assert.equal(first.last_page, 10)
    assert.equal(first.from, 1)
    assert.equal(first.to, 10)
    assert.equal(first.prev_page_url, null)
    const second = await f.api.list(f.types.ordersQueryFromUrl(first.next_page_url), f.signal())
    assert.equal(second.current_page, 2)
    assert.equal(second.from, 11)
    assert.equal(second.to, 20)
    assert.equal(second.data.some(row => first.data.some(previous => previous.id === row.id)), false)
    const last = await f.api.list({ ...f.query, page: 999 }, f.signal())
    assert.equal(last.current_page, 10)
    assert.equal(last.data.length, 6)
    assert.equal(last.to, 96)
    assert.equal(last.next_page_url, null)
    const a = await f.api.list({ ...f.query, per_page: 50 }, f.signal())
    const b = await f.api.list({ ...f.query, per_page: 50, page: 2 }, f.signal())
    const all = [...a.data, ...b.data]
    assert.equal(first.summary.processing, 32)
    assert.equal(first.summary.fulfilled, 48)
    assert.equal(first.summary.sales, all.reduce((sum, row) => sum + (row.status === 'cancelled' ? 0 : row.total), 0))
  } finally { await f.demo.close() }
})

test('adapter filters inclusively by date, searches records, sorts totals and preserves query parameters in links', async () => {
  const f = await fixture()
  try {
    const filtered = await f.api.list({ ...f.query, q: ' sam ', status: 'processing', from: '2026-11-01', to: '2026-11-06' }, f.signal())
    assert.equal(filtered.total, 2)
    assert.ok(filtered.data.every(row => row.customer === 'Sam Chen' && row.status === 'processing'))
    const byTotal = await f.api.list({ ...f.query, q: '@acme.example', status: 'fulfilled', sort: 'total', direction: 'asc', per_page: 25, from: '2026-10-01', to: '2026-11-06' }, f.signal())
    assert.ok(byTotal.data.every((row, index) => !index || row.total >= byTotal.data[index - 1].total))
    const next = f.types.ordersQueryFromUrl(byTotal.next_page_url)
    assert.equal(next.q, '@acme.example')
    assert.equal(next.status, 'fulfilled')
    assert.equal(next.from, '2026-10-01')
    assert.equal(next.to, '2026-11-06')
    assert.equal(next.per_page, 25)
    assert.equal(next.sort, 'total')
    assert.equal(next.direction, 'asc')
  } finally { await f.demo.close() }
})

test('empty responses and invalid request parameters have explicit behavior', async () => {
  const f = await fixture()
  try {
    const empty = await f.api.list({ ...f.query, q: 'no-such-customer', page: 9 }, f.signal())
    assert.equal(empty.total, 0)
    assert.equal(empty.current_page, 1)
    assert.equal(empty.last_page, 1)
    assert.equal(empty.from, null)
    assert.equal(empty.to, null)
    assert.equal(empty.next_page_url, null)
    assert.equal(empty.prev_page_url, null)
    await assert.rejects(f.api.list({ ...f.query, from: '2026-11-06', to: '2026-11-01' }, f.signal()), /start date/)
    await assert.rejects(f.api.list({ ...f.query, sort: 'unknown' }, f.signal()), /sort/)
    await assert.rejects(f.api.list({ ...f.query, per_page: 999 }, f.signal()), /pagination/)
    await assert.rejects(f.api.list({ ...f.query, from: '2026-02-31' }, f.signal()), /valid dates/)
  } finally { await f.demo.close() }
})

test('fulfillment validates the whole batch before changing records and refreshes filtered totals', async () => {
  const f = await fixture()
  try {
    await assert.rejects(f.api.fulfill([1048, 1043], f.signal()), /Only processing/)
    assert.equal((await f.api.list({ ...f.query, q: '1048' }, f.signal())).data[0].status, 'processing')
    await f.api.fulfill([1048, 1045, 1048], f.signal())
    const processing = await f.api.list({ ...f.query, status: 'processing' }, f.signal())
    assert.equal(processing.total, 30)
    assert.equal(processing.summary.processing, 30)
    await assert.rejects(f.api.fulfill([1048], f.signal()), /Only processing/)
  } finally { await f.demo.close() }
})

test('request cancellation rejects cleanly and the error preview fails only one request', async () => {
  const f = await fixture()
  try {
    const controller = new AbortController()
    const pending = f.api.list(f.query, controller.signal)
    controller.abort()
    await assert.rejects(pending, { name: 'AbortError' })
    f.api.failNextList()
    await assert.rejects(f.api.list(f.query, f.signal()), /could not be loaded/)
    assert.equal((await f.api.list(f.query, f.signal())).total, 96)
  } finally { await f.demo.close() }
})

test('request controller aborts superseded work, ignores late responses and stops work on disposal', async () => {
  const f = await fixture()
  const scope = effectScope()
  try {
    const { useDemoOrders } = await f.demo.module('composables/useDemoOrders.ts')
    const response = await f.api.list(f.query, f.signal())
    const requests = []
    const api = { list(query, signal) { return new Promise(resolve => requests.push({ query, signal, resolve })) }, fulfill: async () => {} }
    const orders = scope.run(() => useDemoOrders(api))
    const newer = orders.applyFilters({ q: 'Sam', status: '', from: '', to: '' })
    assert.equal(requests[0].signal.aborted, true)
    requests[0].resolve(response)
    await nextTick()
    assert.equal(orders.loading.value, true)
    assert.equal(orders.page.value, undefined)
    requests[1].resolve({ ...response, total: 8, data: [response.data[0]] })
    await newer
    assert.equal(orders.page.value.total, 8)
    assert.equal(orders.query.value.q, 'Sam')
    const last = orders.reload()
    scope.stop()
    assert.equal(requests[2].signal.aborted, true)
    requests[2].resolve(response)
    await last
    assert.equal(orders.page.value.total, 8)
  } finally { scope.stop(); await f.demo.close() }
})

test('page selection ignores unknown IDs, blocks while busy and resets when the response changes', async () => {
  const f = await fixture()
  const scope = effectScope()
  try {
    const { useOrderSelection } = await f.demo.module('composables/useOrderSelection.ts')
    const first = await f.api.list(f.query, f.signal())
    const rows = shallowRef(first.data)
    const busy = shallowRef(false)
    const selection = scope.run(() => useOrderSelection(() => rows.value, () => busy.value))
    selection.toggle(9999, true)
    assert.equal(selection.selected.value.length, 0)
    selection.all(true)
    assert.equal(selection.selected.value.length, 10)
    assert.equal(selection.fulfillable.value.length, 4)
    busy.value = true
    selection.all(false)
    assert.equal(selection.selected.value.length, 10)
    rows.value = (await f.api.list({ ...f.query, page: 2 }, f.signal())).data
    await nextTick()
    assert.equal(selection.selected.value.length, 0)
  } finally { scope.stop(); await f.demo.close() }
})

test('CSV escapes quotes and spreadsheet formula prefixes and exports only supplied rows', async () => {
  const f = await fixture()
  try {
    const row = (await f.api.list(f.query, f.signal())).data[0]
    const csv = f.types.ordersCsv([{ ...row, customer: '=SUM(1,2)', email: 'a"b@example.test' }])
    assert.match(csv, /"'=SUM\(1,2\)"/)
    assert.match(csv, /"a""b@example.test"/)
    assert.equal(csv.split('\r\n').length, 2)
    assert.match(csv, /"SGD"/)
  } finally { await f.demo.close() }
})

test('Orders page composes API pagination, row selection, detail view, filters and error retry', async () => {
  const f = await fixture()
  let view
  try {
    const Orders = await f.demo.component('components/DemoOrders.vue')
    let pending
    const api = { ...f.api, list(...args) { pending = f.api.list(...args); return pending } }
    view = mountComponent(Orders, { api, onSimulateError: () => f.api.failNextList() })
    const settle = async () => { await pending.catch(() => {}); await nextTick() }
    await settle()
    assert.equal(nodes(view.element, node => node.type === 'tbody')[0].children.filter(node => node.type === 'tr').length, 10)
    const checkbox = find(view, node => node.type === 'input' && node.props['aria-label'] === 'Select order #1048')
    checkbox.props.onChange({ target: { checked: true } })
    await nextTick()
    assert.ok(find(view, node => node.type === 'button' && text(node).includes('Bulk actions')))
    find(view, node => node.type === 'button' && node.props['aria-label'] === 'Next').props.onClick({})
    await settle()
    assert.equal(find(view, node => node.type === 'button' && text(node).includes('Bulk actions')), undefined)
    for (const dialog of nodes(view.element, node => node.type === 'dialog')) {
      dialog.showModal = () => { dialog.open = true }
      dialog.close = () => { dialog.open = false }
    }
    find(view, node => node.type === 'button' && node.props['aria-label'] === 'View order #1038').props.onClick({})
    await nextTick()
    assert.ok(find(view, node => node.type === 'h2' && text(node) === 'Order #1038'))
    find(view, node => node.type === 'button' && text(node) === 'Close order').props.onClick({})
    find(view, node => node.type === 'button' && text(node) === 'Filters').props.onClick({})
    await nextTick()
    find(view, node => node.type === 'input' && node.props.name === 'orderSearch').props.onInput({ target: { value: 'no-match' } })
    await nextTick()
    find(view, node => node.type === 'form' && node.props['aria-label'] === 'Filter orders').props.onSubmit({ preventDefault() {} })
    await settle()
    assert.ok(find(view, node => node.type === 'h2' && text(node) === 'No orders found'))
    find(view, node => node.type === 'button' && text(node) === 'Simulate request error').props.onClick({})
    await settle()
    assert.match(text(find(view, node => node.props.role === 'alert')), /couldn’t load/)
    find(view, node => node.type === 'button' && text(node) === 'Try again').props.onClick({})
    await settle()
    assert.equal(find(view, node => node.props.role === 'alert'), undefined)
  } finally { view?.unmount(); await f.demo.close() }
})

test('overview table card requests five-row API pages and browses without slicing the response', async () => {
  const f = await fixture()
  let view
  try {
    const Preview = await f.demo.component('components/orders/DemoOrdersPreview.vue')
    let pending
    const requests = [], browsed = []
    const api = { ...f.api, list(query, signal) { requests.push({ ...query }); pending = f.api.list(query, signal); return pending } }
    view = mountComponent(Preview, { api, onBrowse: () => browsed.push(true) })
    const settle = async () => { await pending; await nextTick() }
    await settle()
    const root = () => view.element.parent ?? view.element
    const rows = () => nodes(root(), node => node.type === 'tbody')[0].children.filter(node => node.type === 'tr')
    assert.equal(requests[0].per_page, 5)
    assert.equal(rows().length, 5)
    assert.ok(find(view, node => node.type === 'button' && node.props['aria-label'] === 'Preview order #1048'))
    find(view, node => node.type === 'button' && node.props['aria-label'] === 'Next').props.onClick({})
    await settle()
    assert.equal(requests.at(-1).page, 2)
    assert.equal(requests.at(-1).per_page, 5)
    assert.equal(rows().length, 5)
    assert.ok(find(view, node => node.type === 'button' && node.props['aria-label'] === 'Preview order #1043'))
    assert.ok(find(view, node => node.type === 'span' && text(node) === '…'))
    find(view, node => node.type === 'button' && text(node) === 'Open Tables').props.onClick({})
    assert.deepEqual(browsed, [true])
  } finally { view?.unmount(); await f.demo.close() }
})

test('order date presets update only the draft and apply submits the complete filter range', async () => {
  const demo = await loadDemo()
  try {
    const Filters = await demo.component('components/orders/DemoOrderFilters.vue')
    const applied = []
    const initial = { q: 'Sam', status: 'processing', from: '', to: '' }
    const view = mountComponent(Filters, {
      modelValue: initial,
      loading: false,
      disabled: false,
      'onUpdate:modelValue': range => { view.state.value = { ...view.state.value, modelValue: range } },
      onApply: range => applied.push(range),
    })
    try {
      const button = label => find(view, node => node.type === 'button' && text(node) === label)
      const submit = () => find(view, node => node.type === 'form').props.onSubmit({ preventDefault() {} })
      button('Last 7 days').props.onClick({})
      await nextTick()
      assert.deepEqual(initial, { q: 'Sam', status: 'processing', from: '', to: '' })
      assert.equal(applied.length, 0)
      assert.equal(button('Last 7 days').props['aria-pressed'], true)
      submit()
      assert.deepEqual(applied[0], { q: 'Sam', status: 'processing', from: '2026-10-31', to: '2026-11-06' })
      const dates = nodes(view.element, node => node.type === 'input' && node.props.type === 'date')
      dates[1].props.onInput({ target: { value: '2026-10-30' } })
      await nextTick()
      assert.equal(dates[0].props['aria-invalid'], true)
      assert.equal(dates[1].props['aria-describedby'], dates[0].props['aria-describedby'])
      submit()
      assert.equal(applied.length, 1)
      button('Clear dates').props.onClick({})
      await nextTick()
      submit()
      assert.deepEqual(applied[1], initial)
    } finally { view.unmount() }
  } finally { await demo.close() }
})

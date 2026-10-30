import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SPagination, STable } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = node => renderToString(createSSRApp({ render: () => node }))
function find(node, type) { return [node, ...node.children.flatMap(child => find(child, type))].filter(node => node.type === type) }
const url = page => `/api/users?team=design&sort=name&page=${page}`
const pageLinks = [
  { url: url(1), label: '&laquo; Previous', active: false },
  { url: url(1), label: '1', active: false },
  { url: url(2), label: '2', active: true },
  { url: null, label: '&hellip;', active: false },
  { url: url(10), label: '10', active: false },
  { url: url(3), label: 'Next &raquo;', active: false },
]
const raw = { current_page: 2, last_page: 10, from: 11, to: 20, total: 100, prev_page_url: url(1), next_page_url: url(3), links: pageLinks }

test('pagination accepts Laravel paginator and API Resource shapes with identical server URLs', async () => {
  const resource = { meta: { current_page: 2, last_page: 10, from: 11, to: 20, total: 100, links: pageLinks }, links: { prev: url(1), next: url(3) } }
  const direct = await render(h(SPagination, { pagination: raw }))
  const wrapped = await render(h(SPagination, { pagination: resource }))
  assert.equal(direct, wrapped)
  assert.match(direct, /Showing 11–20 of 100/)
  assert.match(direct, /aria-current="page" aria-label="Page 2"/)
  assert.match(direct, /…/)
  assert.match(direct, /href="\/api\/users\?team=design&amp;sort=name&amp;page=10"/)
  assert.equal([...direct.matchAll(/aria-current="page"/g)].length, 1)
})

test('pagination honours explicit null boundaries and works without totals or numbered links', async () => {
  const html = await render(h(SPagination, { pagination: { links: { prev: null, next: '/api/users?cursor=abc' }, meta: { links: pageLinks } } }))
  assert.doesNotMatch(html, /href="\/api\/users\?team=design&amp;sort=name&amp;page=1"[^>]*rel="prev"/)
  assert.match(html, /aria-disabled="true"/)
  assert.match(html, /href="\/api\/users\?cursor=abc"/)
  const simple = await render(h(SPagination, { pagination: { prev_page_url: null, next_page_url: '/next?cursor=x' } }))
  assert.doesNotMatch(simple, /Go to page|Showing|Page \d/)
  assert.match(simple, /cursor=x/)
  const metadataOnly = await render(h(SPagination, { pagination: { current_page: 3, last_page: 90 } }))
  assert.doesNotMatch(metadataOnly, /href=/)
  assert.match(metadataOnly, /Page 3.*of 90/)
})

test('event pagination emits the exact server URL and waits for replacement data', async () => {
  const requests = []
  const view = mountComponent(SPagination, { pagination: raw, mode: 'event', onNavigate: (...args) => requests.push(args) })
  try {
    const event = new Event('click')
    const next = find(view.element, 'button').find(node => node.props['aria-label'] === 'Next')
    next.props.onClick(event)
    assert.deepEqual(requests, [[url(3), event]])
    assert.equal(find(view.element, 'span').find(node => node.props['aria-current'] === 'page').props['aria-label'], 'Page 2')
    view.state.value = { ...view.state.value, pagination: { current_page: 3, last_page: 10, prev_page_url: url(2), next_page_url: null } }
    await nextTick()
    assert.equal(find(view.element, 'button').find(node => node.props['aria-label'] === 'Next').props.disabled, true)
  } finally { view.unmount() }
})

test('loading pagination blocks API events and unmounts link adapters', async () => {
  const requests = []
  let mounts = 0
  const Link = defineComponent({ setup: (_, { attrs, slots }) => { mounts++; return () => h('a', attrs, slots.default?.()) } })
  const html = await render(h(SPagination, { pagination: raw, loading: true, linkAs: Link }))
  assert.equal(mounts, 0)
  assert.doesNotMatch(html, /href=/)
  assert.match(html, /aria-busy="true"/)
  const view = mountComponent(SPagination, { pagination: raw, loading: true, mode: 'event', onNavigate: url => requests.push(url) })
  try {
    find(view.element, 'button')[0].props.onClick({ preventDefault() {}, stopPropagation() {} })
    assert.deepEqual(requests, [])
  } finally { view.unmount() }
})

test('pagination forwards Inertia options and renders server labels as text rather than HTML', async () => {
  const received = []
  const Link = defineComponent({ inheritAttrs: false, props: ['href', 'preserveScroll'], setup(props, { attrs, slots }) { received.push({ ...props }); return () => h('a', { ...attrs, href: props.href }, slots.default?.()) } })
  const html = await render(h(SPagination, { pagination: raw, linkAs: Link, linkProps: { preserveScroll: true } }))
  assert.ok(received.length > 0)
  assert.ok(received.every(props => props.preserveScroll === true && props.href.startsWith('/api/users?')))
  assert.match(html, /rel="next"/)
  const malicious = await render(h(SPagination, { pagination: { links: [pageLinks[0], { url: null, active: false, label: '&lt;img src=x onerror=alert(1)&gt;' }, pageLinks.at(-1)] } }))
  assert.doesNotMatch(malicious, /<img/)
  assert.match(malicious, /&lt;img/)
})

test('pagination shows zero results and does not fabricate number links without a server list', async () => {
  const html = await render(h(SPagination, { pagination: { current_page: 1, last_page: 1, from: null, to: null, total: 0, prev_page_url: null, next_page_url: null } }))
  assert.match(html, /No results/)
  assert.doesNotMatch(html, /href=|Go to page/)
})

const columns = [{ key: 'name', label: 'Name', sortable: true }, { key: 'team', label: 'Team' }]
const rows = [{ id: 7, name: 'Zoe', team: 'Design' }, { id: 4, name: 'Alex', team: 'Engineering' }]
test('table preserves API order, native semantics, caption and escaped cell values', async () => {
  const html = await render(h(STable, { rows, columns, caption: 'Members', rowKey: 'id', sort: { key: 'name', direction: 'asc' } }))
  assert.match(html, /<table/)
  assert.match(html, /<caption[^>]*>Members<\/caption>/)
  assert.match(html, /scope="col" aria-sort="ascending"/)
  assert.ok(html.indexOf('Zoe') < html.indexOf('Alex'))
  assert.equal([...html.matchAll(/<td\b/g)].length, 4)
  const escaped = await render(h(STable, { rows: [{ id: 1, name: '<script>bad</script>' }], columns, caption: 'Safe', rowKey: 'id' }))
  assert.doesNotMatch(escaped, /<script>/)
})

test('table sorting requests are controlled and disabled while loading', async () => {
  const changes = []
  const view = mountComponent(STable, { rows, columns, caption: 'Members', rowKey: 'id', onSort: sort => changes.push(sort) })
  try {
    find(view.element, 'button')[0].props.onClick()
    assert.deepEqual(changes, [{ key: 'name', direction: 'asc' }])
    assert.equal(find(view.element, 'th')[0].props['aria-sort'], 'none')
    view.state.value = { ...view.state.value, sort: { key: 'name', direction: 'asc' } }
    await nextTick()
    find(view.element, 'button')[0].props.onClick()
    assert.deepEqual(changes.at(-1), { key: 'name', direction: 'desc' })
    view.state.value = { ...view.state.value, loading: true }
    await nextTick()
    find(view.element, 'button')[0].props.onClick()
    assert.equal(changes.length, 2)
    assert.equal(find(view.element, 'tr').length, 3)
  } finally { view.unmount() }
})

test('table custom cells receive rows and cached values, with reactive API replacement', async () => {
  let calls = 0
  const view = mountComponent(STable, { rows, columns: [{ key: 'name', label: 'Name', value: row => { calls++; return row.name.toUpperCase() } }], rowKey: row => row.id, caption: 'Custom' }, {
    cell: ({ row, value, loading }) => h('a', { href: `/members/${row.id}`, 'data-loading': loading }, value),
  })
  try {
    assert.equal(calls, 2)
    assert.deepEqual(find(view.element, 'a').map(node => node.props.href), ['/members/7', '/members/4'])
    view.state.value = { ...view.state.value, rows: [{ id: 8, name: 'New' }] }
    await nextTick()
    assert.deepEqual(find(view.element, 'a').map(node => node.props.href), ['/members/8'])
  } finally { view.unmount() }
})

test('empty and initial loading table states span all columns and keep headings', async () => {
  for (const loading of [true, false]) {
    const html = await render(h(STable, { rows: [], columns, caption: 'Empty', rowKey: 'id', loading }, {
      empty: () => h('span', {}, 'Custom empty'), loading: () => h('span', {}, 'Custom loading'),
    }))
    assert.match(html, /colspan="2"/)
    assert.match(html, /scope="col"/)
    assert.match(html, loading ? /Custom loading/ : /Custom empty/)
    assert.doesNotMatch(html, loading ? /Custom empty/ : /Custom loading/)
  }
})


test('pagination initial loading does not announce an empty result prematurely', async () => {
  const html = await render(h(SPagination, { pagination: { total: 0, current_page: 1 }, loading: true }))
  assert.match(html, /Loading results…/)
  assert.doesNotMatch(html, /No results/)
})

test('100-page pagination renders only the server window and preserves ellipses', async () => {
  const numbers = [1, 48, 49, 50, 51, 52, 100]
  const links = [{ url: url(49), label: 'Previous', active: false }]
  numbers.forEach((number, index) => {
    if (index > 0 && number - numbers[index - 1] > 1) links.push({ url: null, label: '...', active: false })
    links.push({ url: url(number), label: String(number), active: number === 50 })
  })
  links.push({ url: url(51), label: 'Next', active: false })
  const html = await render(h(SPagination, { pagination: { current_page: 50, last_page: 100, links } }))
  assert.equal([...html.matchAll(/<li\b/g)].length, 11)
  assert.equal([...html.matchAll(/>\.\.\.<\/span>/g)].length, 2)
  assert.match(html, /aria-current="page" aria-label="Page 50"/)
  assert.match(html, /Go to page 100/)
  assert.doesNotMatch(html, /Go to page 47|Go to page 53/)
})

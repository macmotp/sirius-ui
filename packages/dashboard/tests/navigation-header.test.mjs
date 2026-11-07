import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SDashboardNav, SDashboardPageHeader } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

const render = async node => (await renderToString(createSSRApp({ render: () => node }))).replace(/<!--[\s\S]*?-->/g, '')
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
function text(node) { return (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('') }
const groups = [{ id: 'workspace', label: 'Workspace', items: [
  { id: 'overview', label: 'Overview', href: '/overview' },
  { id: 'activity', label: 'Activity', href: '/activity', badge: 0, badgeLabel: '0 unread updates' },
  { id: 'reports', label: 'Reports', href: '/reports', disabled: true, linkProps: { to: '/reports', tabindex: 0 } },
] }, { id: 'empty', label: 'Hidden empty group', items: [] }]

test('dashboard navigation labels groups uniquely, preserves zero badges and marks current links', async () => {
  const item = () => h(SDashboardNav, { groups, current: 'activity' })
  const html = await render(h('div', [item(), item()]))
  const ids = [...html.matchAll(/<ul aria-labelledby="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, 2)
  for (const id of ids) assert.ok(html.includes(`id="${id}"`))
  assert.doesNotMatch(html, /Hidden empty group|role="menu"|role="menuitem"|<nav/)
  assert.match(html, /href="\/activity" aria-current="page"/)
  assert.match(html, /aria-hidden="true">0<\/span>/)
  assert.match(html, /0 unread updates/)
  const disabled = html.match(/<span[^>]*role="link"[^>]*>/)[0]
  assert.match(disabled, /aria-disabled="true"/)
  assert.doesNotMatch(disabled, /href=|to=|tabindex=|aria-current=/)
})
test('select emits the original event without changing native link behavior; disabled items do not emit', async () => {
  const selected = []
  const view = mountComponent(SDashboardNav, { groups, current: 'overview', onSelect: (item, event) => selected.push([item.id, event]) })
  try {
    const activity = nodes(view.element, node => node.props.href === '/activity')[0]
    let prevented = false
    const event = { ctrlKey: true, preventDefault() { prevented = true } }
    activity.props.onClick(event)
    assert.deepEqual(selected, [['activity', event]])
    assert.equal(prevented, false)
    assert.equal(nodes(view.element, node => node.props['aria-current'] === 'page')[0].props.href, '/overview')
    nodes(view.element, node => node.props['aria-disabled'] === true)[0].props.onClick(event)
    assert.equal(selected.length, 1)
    view.state.value = { ...view.state.value, current: 'activity' }
    await nextTick()
    assert.equal(nodes(view.element, node => node.props['aria-current'] === 'page')[0].props.href, '/activity')
  } finally { view.unmount() }
})
test('custom link adapters receive link props and are unmounted when the item becomes disabled', async () => {
  let mounted = 0, unmounted = 0
  const { onMounted, onUnmounted } = await import('vue')
  const Link = defineComponent({
    props: ['to', 'href'],
    setup(props, { attrs, slots }) {
      onMounted(() => { mounted++ })
      onUnmounted(() => { unmounted++ })
      return () => h('a', { ...attrs, href: props.to, 'data-adapter': true }, slots.default?.())
    },
  })
  const item = { id: 'orders', label: 'Orders', href: '/orders', linkProps: { to: '/orders?status=open' } }
  const view = mountComponent(SDashboardNav, { groups: [{ id: 'main', items: [item] }], linkAs: Link, current: 'orders' })
  try {
    assert.equal(mounted, 1)
    assert.equal(nodes(view.element, node => node.props['data-adapter'])[0].props.href, '/orders?status=open')
    view.state.value = { ...view.state.value, groups: [{ id: 'main', items: [{ ...item, disabled: true }] }] }
    await nextTick()
    assert.equal(unmounted, 1)
    assert.equal(nodes(view.element, node => node.props['data-adapter']).length, 0)
    assert.equal(nodes(view.element, node => node.props['aria-current']).length, 0)
  } finally { view.unmount() }
})
test('page headers compose one h1, breadcrumb navigation and ordinary action controls', async () => {
  const html = await render(h(SDashboardPageHeader, { title: 'Orders', description: 'Review customer orders.', eyebrow: 'Commerce', breadcrumbs: [{ value: 'home', label: 'Acme', href: '/' }, { value: 'orders', label: 'Orders' }] }, { actions: () => h('button', { type: 'button' }, 'Create order') }))
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
  assert.match(html, />Orders<\/h1>/)
  assert.match(html, /Review customer orders\./)
  assert.match(html, /<nav aria-label="Breadcrumb"/)
  assert.match(html, /aria-current="page"/)
  assert.match(html, /<button type="button">Create order<\/button>/)
  assert.doesNotMatch(html, /role="toolbar"/)
})
test('page headers update their title and omit unused metadata and navigation', async () => {
  const view = mountComponent(SDashboardPageHeader, { title: 'Overview' })
  try {
    assert.equal(nodes(view.element, node => node.type === 'nav').length, 0)
    assert.equal(nodes(view.element, node => node.type === 'p').length, 0)
    view.state.value = { title: 'A long title for a different page', description: 'Updated context', breadcrumbs: [{ value: 'current', label: 'Settings' }] }
    await nextTick()
    assert.equal(text(nodes(view.element, node => node.type === 'h1')[0]), 'A long title for a different page')
    assert.equal(nodes(view.element, node => node.type === 'nav').length, 1)
  } finally { view.unmount() }
})

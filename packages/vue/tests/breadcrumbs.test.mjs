import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SBreadcrumbs } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = node => renderToString(createSSRApp({ render: () => node }))
const items = [
  { value: 'home', label: 'Home', href: '/' },
  { value: 'group', label: 'Group' },
  { value: 'page', label: 'Current', href: '/current', linkProps: { id: 'should-not-forward' } },
]
function find(node, type) { return [node, ...node.children.flatMap(child => find(child, type))].filter(node => node.type === type) }

test('breadcrumbs use named navigation, ordered list, native links and one nonlinked current page', async () => {
  const html = await render(h(SBreadcrumbs, { items, label: 'Location' }))
  assert.match(html, /<nav aria-label="Location"/)
  assert.match(html, /<ol/)
  assert.equal([...html.matchAll(/<li\b/g)].length, 3)
  assert.equal([...html.matchAll(/<a\b/g)].length, 1)
  assert.equal([...html.matchAll(/aria-current="page"/g)].length, 1)
  assert.match(html, /href="\/"/)
  assert.doesNotMatch(html, /href="\/current"|should-not-forward/)
  assert.equal([...html.matchAll(/<span aria-hidden="true"/g)].length, 2)
})

test('breadcrumbs pass link options to custom adapters without introducing nested anchors', async () => {
  const received = []
  const Link = defineComponent({
    inheritAttrs: false,
    props: { href: String, preserveScroll: Boolean },
    setup(props, { attrs, slots }) {
      received.push({ ...props })
      return () => h('a', { ...attrs, href: props.href, 'data-adapter': 'true' }, slots.default?.())
    },
  })
  const html = await render(h(SBreadcrumbs, {
    linkAs: Link,
    items: [{ value: 'a', label: 'Ancestor', href: '/real', linkProps: { href: '/wrong', preserveScroll: true, 'aria-current': 'step' } }, { value: 'b', label: 'Page' }],
  }))
  assert.deepEqual(received, [{ href: '/real', preserveScroll: true }])
  assert.equal([...html.matchAll(/<a\b/g)].length, 1)
  assert.match(html, /data-adapter="true"/)
  assert.doesNotMatch(html, /aria-current="step"|\/wrong/)
})

test('breadcrumb custom labels and separators preserve semantics and root attributes', async () => {
  const icon = defineComponent({ render: () => h('svg') })
  const html = await render(h(SBreadcrumbs, { items: [{ value: 'a', label: 'Home', href: '/', icon }, { value: 'b', label: 'Page' }], id: 'trail', 'aria-label': 'Custom landmark' }, {
    item: ({ item, current }) => h('strong', {}, `${item.label}${current ? ' now' : ''}`),
    separator: () => '/',
  }))
  assert.match(html, /id="trail"/)
  assert.match(html, /aria-label="Custom landmark"/)
  assert.match(html, /Home<\/strong>/)
  assert.match(html, /Page now<\/strong>/)
  assert.doesNotMatch(html, /<svg/)
  assert.match(html.replace(/<!--.*?-->/g, ''), /aria-hidden="true"[^>]*>\//)
})

test('updating a trail changes which item is current without stale state', async () => {
  const view = mountComponent(SBreadcrumbs, { items: items.slice(0, 1) })
  try {
    assert.equal(find(view.element, 'a').length, 0)
    view.state.value = { items: [items[0], items[2]] }
    await nextTick()
    assert.equal(find(view.element, 'a').length, 1)
    assert.equal(find(view.element, 'span').filter(node => node.props['aria-current'] === 'page').length, 1)
    view.state.value = { items: [] }
    await nextTick()
    assert.equal(find(view.element, 'li').length, 0)
  } finally { view.unmount() }
})

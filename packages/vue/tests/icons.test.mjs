import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { SButton, SIcon, createSiriusIcon, createSiriusIcons, provideSiriusIcons } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const glyph = name => defineComponent({ setup: (_, { attrs }) => () => h('svg', { ...attrs, 'data-glyph': name }) })
function find(node, predicate) {
  return predicate(node) ? node : node.children.map(child => find(child, predicate)).find(Boolean)
}

test('icons have dependency-free defaults and explicit decorative or labelled semantics', async () => {
  const decorative = await renderToString(createSSRApp({ render: () => h(SIcon, { name: 'close', class: 'size-4' }) }))
  assert.match(decorative, /aria-hidden="true"/)
  assert.match(decorative, /focusable="false"/)
  assert.match(decorative, /<path d=/)
  const labelled = await renderToString(createSSRApp({ render: () => h(SIcon, { name: 'check', label: 'Complete' }) }))
  assert.match(labelled, /role="img"/)
  assert.match(labelled, /aria-label="Complete"/)
  assert.doesNotMatch(labelled, /aria-hidden="true"/)
})

test('app plugins keep icon maps isolated and allow partial overrides', async () => {
  const render = () => h('div', [h(SIcon, { name: 'close' }), h(SIcon, { name: 'check' })])
  const first = createSSRApp({ render }).use(createSiriusIcons({ close: glyph('first') }))
  const second = createSSRApp({ render }).use(createSiriusIcons({ close: glyph('second') }))
  const [a, b] = await Promise.all([renderToString(first), renderToString(second)])
  assert.match(a, /data-glyph="first"/)
  assert.doesNotMatch(a, /data-glyph="second"/)
  assert.match(b, /data-glyph="second"/)
  assert.match(a, /<path d=/) // Unconfigured check retains its fallback.
})

test('reactive providers update internal loading controls and component-valued application icons', async () => {
  const icons = shallowRef({ loading: glyph('first'), custom: glyph('custom-first') })
  const Custom = createSiriusIcon('custom')
  const Host = defineComponent({
    setup() {
      provideSiriusIcons(icons)
      return () => h('div', [h(SButton, { loading: true }, () => 'Save'), h(Custom, { class: 'custom-size' })])
    },
  })
  const view = mountComponent(Host)
  try {
    assert.ok(find(view.element, node => node.props['data-glyph'] === 'first'))
    assert.ok(find(view.element, node => node.props['data-glyph'] === 'custom-first' && node.props.class === 'custom-size'))
    icons.value = { loading: glyph('second'), custom: glyph('custom-second') }
    await nextTick()
    assert.equal(find(view.element, node => node.props['data-glyph'] === 'first'), undefined)
    const loader = find(view.element, node => node.props['data-glyph'] === 'second')
    assert.ok(loader.props.class.includes('animate-spin'))
    assert.equal(loader.props['aria-hidden'], 'true')
    assert.ok(find(view.element, node => node.props['data-glyph'] === 'custom-second'))
  } finally { view.unmount() }
})

test('nested providers inherit missing entries and override only their own descendants', async () => {
  const Child = defineComponent({ setup() {
    provideSiriusIcons({ close: glyph('inner') })
    return () => h('section', [h(SIcon, { name: 'close' }), h(SIcon, { name: 'check' })])
  } })
  const Parent = defineComponent({ setup() {
    provideSiriusIcons({ close: glyph('outer'), check: glyph('inherited') })
    return () => h('div', [h(SIcon, { name: 'close' }), h(Child)])
  } })
  const html = await renderToString(createSSRApp(Parent))
  assert.match(html, /data-glyph="outer"/)
  assert.match(html, /<section><svg[^>]*data-glyph="inner"/)
  assert.match(html, /data-glyph="inherited"/)
})

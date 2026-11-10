import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SSparkline } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

const render = props => renderToString(createSSRApp({ render: () => h(SSparkline, props) }))

test('sparklines preserve gaps, retain isolated observations and expose their text summary', async () => {
  const html = await render({ data: [1, 3, null, 5, 6, Infinity, 9], label: 'Values generally rose' })
  assert.match(html, /role="img" aria-label="Values generally rose"/)
  assert.equal((html.match(/<path\b/g) ?? []).length, 2)
  assert.equal((html.match(/<circle\b/g) ?? []).length, 1)
  assert.doesNotMatch(html, /NaN|Infinity/)
  const curved = await render({ data: [1, 4, 2] })
  const straight = await render({ data: [1, 4, 2], smooth: false })
  assert.match(curved, /d="M[^"]+ C/)
  assert.match(straight, /d="M[^"]+ L/)
  assert.doesNotMatch(straight, /d="M[^"]+ C/)
  const decorative = await render({ data: [5, 5] })
  assert.match(decorative, /aria-hidden="true"/)
  assert.doesNotMatch(decorative, /NaN|Infinity/)
})


test('sparkline inspection finds the nearest finite point and uses the same formatted value for pointer and keyboard', async () => {
  const view = mountComponent(SSparkline, {
    data: [15, null, 0, 32], showValues: true, valueFormatter: value => `S$${value}`,
  })
  const readout = () => view.element.children.find(node => node.props.class === 'sirius-sparkline__readout')
  const key = key => view.element.props.onKeydown({ key, preventDefault() {} })
  try {
    const svg = view.element.children.find(node => node.type === 'svg')
    svg.getBoundingClientRect = () => ({ left: 40, width: 480 })
    svg.props.onPointermove({ clientX: 510 })
    await nextTick()
    assert.equal(readout().text, 'S$32')
    view.element.props.onPointerleave()
    await nextTick()
    assert.equal(readout(), undefined)
    view.element.props.onFocus()
    await nextTick()
    assert.equal(readout().text, 'S$15')
    key('ArrowRight')
    await nextTick()
    assert.equal(readout().text, 'S$0')
    assert.equal(view.element.children.find(node => node.props.role === 'status').text, 'S$0')
    key('Escape')
    await nextTick()
    assert.equal(readout(), undefined)
  } finally { view.unmount() }
})

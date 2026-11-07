import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { nextTick } from 'vue'
import { SLineChart, SBarChart } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

const nodes = (node, match) => [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))]
const text = node => (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')
const find = (view, match) => nodes(view.element, match)[0]
const panel = view => find(view, node => node.props.class === 'sirius-chart__tooltip')
const series = Array.from({ length: 12 }, (_, index) => ({ id: `series-${index}`, label: `Long descriptive series ${index}`, color: '#4338ca', data: [{ label: 'Monday with a long category name', value: index + 1 }, { label: 'Tuesday', value: null }, { label: 'Wednesday', value: index + 3 }] }))
const event = key => ({ key, preventDefault() {} })

for (const Component of [SLineChart, SBarChart]) {
  test(`${Component.__name} keeps hover values out of the legend and clamps long tooltip content`, async () => {
    const view = mountComponent(Component, { title: 'Comparison', series })
    try {
      const group = find(view, node => node.props.role === 'group')
      const legend = find(view, node => node.props.class === 'sirius-line-chart__legend')
      const originalLegend = text(legend)
      assert.equal(panel(view), undefined)
      group.clientWidth = 320
      group.clientHeight = 240
      const listeners = new Map()
      group.addEventListener = (name, handler) => listeners.set(name, handler)
      group.removeEventListener = (name, handler) => { if (listeners.get(name) === handler) listeners.delete(name) }
      group.props.onFocus()
      await nextTick()
      assert.ok(panel(view))
      assert.equal(panel(view).props['aria-hidden'], 'true')
      assert.equal(panel(view).parent.props.class, 'sirius-chart__viewport')
      assert.equal(nodes(panel(view), node => node.props.class === 'sirius-chart__tooltip-row').length, 12)
      assert.match(text(panel(view)), /Monday with a long category name/)
      assert.equal(text(legend), originalLegend)
      const status = find(view, node => node.props.role === 'status')
      assert.equal(status.props.class, 'sirius-line-chart__sr-only')
      assert.match(text(status), /Monday with a long category name/)
      panel(view).offsetWidth = 900
      panel(view).offsetHeight = 900
      listeners.get('scroll')()
      await nextTick()
      const style = panel(view).props.style
      assert.equal(style.maxWidth, '288px')
      assert.equal(style.maxHeight, '224px')
      assert.ok(parseFloat(style.left) >= 8 && parseFloat(style.left) + 288 <= 312)
      assert.ok(parseFloat(style.top) >= 8 && parseFloat(style.top) + 224 <= 232)
      group.scrollLeft = 10000
      listeners.get('scroll')()
      await nextTick()
      assert.equal(panel(view).props.style.visibility, 'hidden')
      group.scrollLeft = 0
      group.clientWidth = 160
      listeners.get('scroll')()
      await nextTick()
      assert.equal(panel(view).props.style.maxWidth, '144px')
      find(view, node => node.props.class === 'sirius-chart__viewport').props.onPointerleave()
      await nextTick()
      assert.ok(panel(view), 'keyboard inspection persists while leaving the viewport')
      group.props.onKeydown(event('Escape'))
      await nextTick()
      assert.equal(panel(view), undefined)
      assert.equal(listeners.has('scroll'), false)
    } finally { view.unmount() }
  })

  test(`${Component.__name} dismisses pointer tooltips on leaving, Escape and unavailable data`, async () => {
    const view = mountComponent(Component, { title: 'Comparison', series })
    const previousWindow = globalThis.window
    const listeners = new Map()
    // Install only after mount: test the tooltip's window lifecycle independently.
    globalThis.window = {
      addEventListener(name, handler) { const handlers = listeners.get(name) ?? new Set(); handlers.add(handler); listeners.set(name, handlers) },
      removeEventListener(name, handler) { listeners.get(name)?.delete(handler) },
    }
    try {
      const svg = () => find(view, node => node.type === 'svg')
      svg().getBoundingClientRect = () => ({ left: 0, top: 0, width: 640, height: 280 })
      svg().props.onPointermove({ clientX: 10, clientY: 30 })
      await nextTick()
      assert.ok(panel(view))
      for (const handler of listeners.get('keydown')) handler(event('Escape'))
      await nextTick()
      assert.equal(panel(view), undefined)
      assert.equal(listeners.get('keydown').size, 0)
      svg().props.onPointermove({ clientX: 10, clientY: 30 })
      await nextTick()
      find(view, node => node.props.class === 'sirius-chart__viewport').props.onPointerleave()
      await nextTick()
      assert.equal(panel(view), undefined)
      svg().props.onPointermove({ clientX: 10, clientY: 30 })
      await nextTick()
      assert.ok(panel(view))
      view.state.value = { title: 'Comparison', series, loading: true }
      await nextTick()
      assert.equal(panel(view), undefined)
      assert.equal(listeners.get('keydown').size, 0)
      assert.equal(listeners.get('resize').size, 0)
    } finally {
      view.unmount()
      if (previousWindow === undefined) delete globalThis.window
      else globalThis.window = previousWindow
    }
  })
}

test('tooltip layout is an absolute overlay with wrapping/scrolling rather than an in-flow readout', async () => {
  const css = await readFile(new URL('../dist/style.css', import.meta.url), 'utf8')
  assert.match(css, /\.sirius-chart__viewport\{[^}]*position:relative/)
  assert.match(css, /\.sirius-chart__tooltip\{[^}]*position:absolute/)
  assert.match(css, /\.sirius-chart__tooltip\{[^}]*overflow:auto/)
  assert.match(css, /\.sirius-chart__tooltip\{[^}]*overflow-wrap:anywhere/)
  assert.doesNotMatch(css, /\.sirius-line-chart__readout\{/)
})

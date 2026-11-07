import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SBarChart } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

const data = [{ label: 'Food', value: 20 }, { label: 'Apparel', value: 40 }, { label: 'Home', value: 10 }]
const nodes = (node, match) => [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))]
const text = node => (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')
const find = (view, match) => nodes(view.element, match)[0]
const bars = view => nodes(view.element, node => node.type === 'rect' && node.props.fill)
const mount = props => mountComponent(SBarChart, { title: 'Sales', data, ...props })
const event = key => ({ key, prevented: false, preventDefault() { this.prevented = true } })

test('bar charts expose named SVGs, unique names, escaped categories and complete data tables', async () => {
  const html = await renderToString(createSSRApp({ render: () => h('div', [h(SBarChart, { title: 'Sales', data }), h(SBarChart, { title: 'Horizontal sales', data, orientation: 'horizontal' })]) }))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  assert.equal([...html.matchAll(/role="img"/g)].length, 2)
  assert.equal([...html.matchAll(/<table>/g)].length, 2)
  assert.match(html, /Use Up and Down arrow keys/)
  assert.match(html, /Use Left and Right arrow keys/)
  const escaped = await renderToString(createSSRApp({ render: () => h(SBarChart, { title: 'Safe', data: [{ label: '<script>x</script>', value: 1 }] }) }))
  assert.doesNotMatch(escaped, /<script>/)
  assert.match(escaped, /&lt;script&gt;/)
})

test('signed bars start at zero in both orientations; zero is a marker and missing values stay absent', () => {
  for (const orientation of ['vertical', 'horizontal']) {
    const view = mount({ orientation, data: [{ label: 'Positive', value: 10 }, { label: 'Negative', value: -10 }, { label: 'Zero', value: 0 }, { label: 'Missing', value: null }, { label: 'Invalid', value: Infinity }] })
    try {
      const baseline = find(view, node => node.props.class === 'sirius-bar-chart__baseline')
      const rectangles = bars(view)
      assert.equal(rectangles.length, 2)
      const [positive, negative] = rectangles.map(node => node.props)
      if (orientation === 'vertical') {
        assert.equal(positive.y + positive.height, baseline.props.y1)
        assert.equal(negative.y, baseline.props.y1)
        assert.equal(positive.height, negative.height)
      } else {
        assert.equal(positive.x, baseline.props.x1)
        assert.equal(negative.x + negative.width, baseline.props.x1)
        assert.equal(positive.width, negative.width)
      }
      assert.equal(nodes(view.element, node => node.type === 'line' && node.props['stroke-width'] === '2').length, 1)
      const rows = find(view, node => node.type === 'tbody').children.filter(node => node.type === 'tr')
      assert.deepEqual(rows.map(text), ['Positive10', 'Negative-10', 'Zero0', 'Missing—', 'Invalid—'])
    } finally { view.unmount() }
  }
})

test('grouped series share a scale, preserve missing slots and update colors without changing values', async () => {
  const series = [
    { id: 'online', label: 'Online', color: 'var(--online)', data: [{ label: 'Food', value: 20 }, { label: 'Apparel', value: 40 }] },
    { id: 'store', label: 'Store', color: '#4338ca', data: [{ label: 'Food', value: 20 }, { label: 'Home', value: 80 }] },
  ]
  const view = mount({ data: undefined, series })
  try {
    assert.equal(bars(view).length, 4)
    const rectangles = bars(view).map(node => node.props)
    assert.equal(rectangles[0].height, rectangles[2].height)
    assert.ok(rectangles[3].height > rectangles[1].height)
    assert.ok(rectangles[2].x > rectangles[0].x)
    assert.equal(rectangles[0].fill, 'var(--online)')
    assert.equal(rectangles[2].fill, '#4338ca')
    const table = () => text(find(view, node => node.type === 'table'))
    assert.match(table(), /CategoryOnlineStoreFood2020Apparel40—Home—80/)
    const before = table()
    view.state.value = { title: 'Sales', series: [{ ...series[0], color: '#be185d' }, series[1]] }
    await nextTick()
    assert.equal(bars(view)[0].props.fill, '#be185d')
    assert.equal(table(), before)
    assert.ok(nodes(view.element, node => node.props.class === 'sirius-bar-chart__key').some(node => node.props.style.backgroundColor === '#be185d'))
  } finally { view.unmount() }
})

test('bar scales stay finite for single, zero, flat, negative and extreme finite observations', () => {
  for (const orientation of ['vertical', 'horizontal']) {
    for (const values of [[0], [-10], [5, 5], [Number.MIN_VALUE], [Number.MAX_VALUE], [-Number.MAX_VALUE, Number.MAX_VALUE]]) {
      const view = mount({ orientation, data: values.map((value, index) => ({ label: String(index), value })) })
      try {
        const bounds = find(view, node => node.type === 'svg').props.viewBox.split(' ').map(Number)
        for (const bar of bars(view)) {
          for (const name of ['x', 'y', 'width', 'height']) assert.ok(Number.isFinite(bar.props[name]), name)
          assert.ok(bar.props.width >= 0 && bar.props.height >= 0)
          assert.ok(bar.props.x >= 0 && bar.props.y >= 0)
          assert.ok(bar.props.x + bar.props.width <= bounds[2] + .001)
          assert.ok(bar.props.y + bar.props.height <= bounds[3] + .001)
        }
      } finally { view.unmount() }
    }
  }
})

test('bar inspection follows orientation, skips wholly missing categories and announces all series', async () => {
  for (const orientation of ['vertical', 'horizontal']) {
    const view = mount({ orientation, series: [
      { id: 'a', label: 'Online', data: [{ label: 'A', value: 10 }, { label: 'Missing', value: null }, { label: 'C', value: 0 }] },
      { id: 'b', label: 'Store', data: [{ label: 'A', value: 20 }, { label: 'C', value: -10 }] },
    ], valueFormatter: value => `SGD ${value}` })
    const group = () => find(view, node => node.props.role === 'group')
    const readout = () => text(find(view, node => node.props.role === 'status'))
    try {
      group().props.onFocus()
      await nextTick()
      assert.match(readout(), /A · Online: SGD 10 · Store: SGD 20/)
      group().props.onKeydown(event(orientation === 'horizontal' ? 'ArrowDown' : 'ArrowRight'))
      await nextTick()
      assert.match(readout(), /C · Online: SGD 0 · Store: SGD -10/)
      const other = event(orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown')
      group().props.onKeydown(other)
      assert.equal(other.prevented, false)
      group().props.onKeydown(event('Home'))
      await nextTick()
      assert.match(readout(), /A · /)
      group().props.onKeydown(event('End'))
      await nextTick()
      assert.match(readout(), /C · /)
      group().props.onKeydown(event('Escape'))
      await nextTick()
      assert.equal(readout().endsWith('—'), true)
      group().props.onBlur()
      view.state.value = { title: 'Changed', data: [{ label: 'New', value: 2 }], orientation }
      await nextTick()
      group().props.onKeydown(event('End'))
      await nextTick()
      assert.match(readout(), /New · Value: 2/)
    } finally { view.unmount() }
  }
})

test('pointer inspection uses SVG coordinates along the category axis in either orientation', async () => {
  for (const orientation of ['vertical', 'horizontal']) {
    const view = mount({ orientation })
    try {
      const svg = find(view, node => node.type === 'svg')
      svg.getBoundingClientRect = () => ({ left: 10, top: 20, width: 640, height: 280 })
      svg.props.onPointermove({ clientX: 640, clientY: 295 })
      await nextTick()
      assert.match(text(find(view, node => node.props.role === 'status')), /Home · Value: 10/)
      find(view, node => node.props.class === 'sirius-chart__viewport').props.onPointerleave()
      await nextTick()
      assert.match(text(find(view, node => node.props.role === 'status')), /—$/)
    } finally { view.unmount() }
  }
})

test('busy, error and empty bar states replace all graphics/data and support custom content', async () => {
  for (const props of [{ loading: true, error: 'Failed' }, { error: 'Failed' }, { data: [] }, { series: [] }, { data: [{ label: 'Missing', value: null }] }]) {
    const view = mount(props)
    try {
      assert.equal(nodes(view.element, node => node.type === 'svg' || node.type === 'table').length, 0)
      assert.match(text(view.element), props.loading ? /Loading chart/ : props.error ? /Failed/ : /No data to display/)
    } finally { view.unmount() }
  }
  const html = await renderToString(createSSRApp({ render: () => h(SBarChart, { title: 'Error', error: 'Failed' }, { error: () => h('button', 'Retry') }) }))
  assert.match(html, /role="alert"/)
  assert.match(html, /<button>Retry<\/button>/)
})

test('narrow/large category lists retain labels and grouped bars with scrolling and resize cleanup', async () => {
  const previous = globalThis.ResizeObserver
  const observers = []
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const many = Array.from({ length: 14 }, (_, index) => ({ label: `Category ${index}`, value: index + 1 }))
  const view = mount({ data: many })
  try {
    await nextTick()
    observers[0].callback([{ contentRect: { width: 320 } }])
    await nextTick()
    assert.ok(Number(find(view, node => node.type === 'svg').props.viewBox.split(' ')[2]) > 320)
    assert.equal(nodes(view.element, node => node.type === 'text' && node.children.some(child => child.type === 'title')).length, 14)
    assert.equal(bars(view).length, 14)
    view.state.value = { title: 'Sales', data: many, orientation: 'horizontal' }
    await nextTick()
    assert.ok(Number(find(view, node => node.type === 'svg').props.viewBox.split(' ')[3]) > 280)
    const group = find(view, node => node.props.role === 'group')
    let scrolling
    group.scrollTo = options => { scrolling = options }
    group.props.onKeydown(event('End'))
    await nextTick()
    assert.ok(scrolling.top > 0)
    assert.match(text(find(view, node => node.props.role === 'status')), /Category 13/)
    view.state.value = { title: 'Sales', data: many, loading: true }
    await nextTick()
    assert.equal(observers[0].disconnected, true)
  } finally {
    view.unmount()
    if (previous === undefined) delete globalThis.ResizeObserver
    else globalThis.ResizeObserver = previous
  }
})

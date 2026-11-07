import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SDonutChart } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

const data = [{ id: 'online', label: 'Online', value: 30, color: 'var(--online)' }, { id: 'store', label: 'Store', value: 70, color: '#4338ca' }]
const nodes = (node, match) => [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))]
const text = node => (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')
const find = (view, match) => nodes(view.element, match)[0]
const mount = props => mountComponent(SDonutChart, { title: 'Sales share', data, ...props })
const event = key => ({ key, prevented: false, preventDefault() { this.prevented = true } })

test('donuts expose unique SVG names, totals, shares, escaped labels and a full accessible table', async () => {
  const html = await renderToString(createSSRApp({ render: () => h('div', [h(SDonutChart, { title: 'Sales', data }), h(SDonutChart, { title: 'Orders', data })]) }))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  assert.equal([...html.matchAll(/role="img"/g)].length, 2)
  assert.match(html, /<summary>View data<\/summary>/)
  assert.match(html, /30%/)
  assert.match(html, /70%/)
  assert.match(html, /<tfoot>/)
  const view = mount({ valueFormatter: value => `SGD ${value}`, totalFormatter: value => `${value} total` })
  try {
    assert.equal(text(find(view, node => node.props.class === 'sirius-donut-chart__total')), '100 total')
    assert.match(text(find(view, node => node.type === 'tbody')), /OnlineSGD 3030%StoreSGD 7070%/)
  } finally { view.unmount() }
  const escaped = await renderToString(createSSRApp({ render: () => h(SDonutChart, { title: 'Safe', data: [{ id: 'a', label: '<script>x</script>', value: 1 }] }) }))
  assert.doesNotMatch(escaped, /<script>/)
  assert.match(escaped, /&lt;script&gt;/)
})

test('single slices draw complete rings; extreme amounts and radius limits retain finite geometry', () => {
  for (const values of [[100], [Number.MIN_VALUE], [Number.MAX_VALUE], [Number.MAX_VALUE, Number.MAX_VALUE], [1e-250, 1e250]]) {
    for (const innerRadius of [.1, .65, 1, NaN]) {
      const view = mount({ data: values.map((value, index) => ({ id: String(index), label: String(index), value })), innerRadius })
      try {
        const paths = nodes(view.element, node => node.props.class === 'sirius-donut-chart__slice')
        assert.ok(paths.length >= 1)
        for (const path of paths) {
          assert.doesNotMatch(path.props.d, /NaN|Infinity/)
          assert.equal([...path.props.d.matchAll(/A/g)].length, 4, 'two outer and two reverse inner arcs also cover a full circle')
          assert.ok(path.props.d.endsWith('Z'))
        }
        if (values.length === 1) assert.match(text(find(view, node => node.type === 'tbody')), /100%/)
        if (values.length === 2 && values[0] === Number.MAX_VALUE) {
          assert.equal(text(find(view, node => node.props.class === 'sirius-donut-chart__total')), '—')
          assert.equal((text(find(view, node => node.type === 'tbody')).match(/50%/g) ?? []).length, 2)
        }
      } finally { view.unmount() }
    }
  }
})

test('missing/invalid values contribute no area; zero stays in the table and does not become a slice', () => {
  const view = mount({ data: [
    { id: 'a', label: 'Positive', value: 30 }, { id: 'b', label: 'Zero', value: 0 },
    { id: 'c', label: 'Missing', value: null }, { id: 'd', label: 'Negative', value: -10 },
    { id: 'e', label: 'Nonfinite', value: Infinity },
  ] })
  try {
    assert.equal(nodes(view.element, node => node.props.class === 'sirius-donut-chart__slice').length, 1)
    const rows = find(view, node => node.type === 'tbody').children.filter(node => node.type === 'tr')
    assert.deepEqual(rows.map(text), ['Positive30100%', 'Zero00%', 'Missing——', 'Negative——', 'Nonfinite——'])
    assert.equal(text(find(view, node => node.props.class === 'sirius-donut-chart__total')), '30')
  } finally { view.unmount() }
})

test('donut keyboard inspection skips zeros/missing slices and preserves a stable center and legend', async () => {
  const view = mount({ data: [...data, { id: 'zero', label: 'Zero', value: 0 }], percentageFormatter: value => `${Math.round(value * 100)} percent` })
  const group = () => find(view, node => node.props.role === 'group')
  const status = () => text(find(view, node => node.props.role === 'status'))
  try {
    const legend = text(find(view, node => node.props.class === 'sirius-line-chart__legend'))
    group().props.onFocus()
    await nextTick()
    assert.equal(status(), 'Online · 30 · 30 percent')
    group().props.onKeydown(event('ArrowDown'))
    await nextTick()
    assert.equal(status(), 'Store · 70 · 70 percent')
    assert.equal(text(find(view, node => node.props.class === 'sirius-donut-chart__total')), '100')
    assert.equal(text(find(view, node => node.props.class === 'sirius-line-chart__legend')), legend)
    assert.ok(find(view, node => node.props.class === 'sirius-chart__tooltip'))
    group().props.onKeydown(event('Home'))
    await nextTick()
    assert.match(status(), /Online/)
    group().props.onKeydown(event('End'))
    await nextTick()
    assert.match(status(), /Store/)
    group().props.onKeydown(event('Escape'))
    await nextTick()
    assert.equal(find(view, node => node.props.class === 'sirius-chart__tooltip'), undefined)
    view.state.value = { title: 'Updated', data: [{ id: 'new', label: 'New', value: 10 }] }
    await nextTick()
    group().props.onKeydown(event('End'))
    await nextTick()
    assert.match(status(), /New · 10 · 100%/)
    group().props.onBlur()
    await nextTick()
    assert.equal(status(), '—')
  } finally { view.unmount() }
})

test('donut pointer hit testing selects the correct angle and ignores the hole/background', async () => {
  const view = mount({ data: [{ id: 'a', label: 'Right', value: 50 }, { id: 'b', label: 'Left', value: 50 }] })
  try {
    const svg = find(view, node => node.type === 'svg')
    svg.getBoundingClientRect = () => ({ left: 10, top: 20, width: 640, height: 280 })
    const hover = async (x, y) => { svg.props.onPointermove({ clientX: x + 10, clientY: y + 20 }); await nextTick() }
    const status = () => text(find(view, node => node.props.role === 'status'))
    await hover(425, 140)
    assert.match(status(), /Right · 50 · 50%/)
    await hover(215, 140)
    assert.match(status(), /Left · 50 · 50%/)
    await hover(320, 140)
    assert.equal(status(), '—')
    await hover(0, 0)
    assert.equal(status(), '—')
    await hover(425, 140)
    find(view, node => node.props.class === 'sirius-chart__viewport').props.onPointerleave()
    await nextTick()
    assert.equal(status(), '—')
  } finally { view.unmount() }
})

test('donut states replace stale graphics; hidden totals and color updates do not change proportions', async () => {
  const view = mount({ showTotal: false })
  try {
    assert.equal(find(view, node => node.props.class === 'sirius-donut-chart__center'), undefined)
    const paths = () => nodes(view.element, node => node.props.class === 'sirius-donut-chart__slice')
    const original = paths()[0].props.d
    view.state.value = { title: 'Sales', data: [{ ...data[0], color: '#be185d' }, data[1]] }
    await nextTick()
    assert.equal(paths()[0].props.fill, '#be185d')
    assert.equal(paths()[0].props.d, original)
    for (const props of [{ loading: true, error: 'Failed' }, { error: 'Failed' }, { data: [] }, { data: data.map(item => ({ ...item, value: 0 })) }, { data: [{ id: 'a', label: 'Missing', value: null }] }]) {
      view.state.value = { title: 'Sales', data, ...props }
      await nextTick()
      assert.equal(nodes(view.element, node => node.type === 'svg' || node.type === 'table').length, 0)
      assert.match(text(view.element), props.loading ? /Loading chart/ : props.error ? /Failed/ : /No data to display/)
    }
  } finally { view.unmount() }
})

test('donuts recompute dimensions after resize and release plot observers across states', async () => {
  const previous = globalThis.ResizeObserver
  const observers = []
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const view = mount()
  try {
    await nextTick()
    const original = find(view, node => node.type === 'path').props.d
    observers[0].callback([{ contentRect: { width: 240 } }])
    await nextTick()
    assert.equal(find(view, node => node.type === 'svg').props.viewBox, '0 0 240 280')
    assert.notEqual(find(view, node => node.type === 'path').props.d, original)
    view.state.value = { title: 'Sales', data, loading: true }
    await nextTick()
    assert.equal(observers[0].disconnected, true)
    view.state.value = { title: 'Sales', data }
    await nextTick()
    assert.equal(observers.length, 2)
  } finally {
    view.unmount()
    assert.equal(observers.at(-1).disconnected, true)
    if (previous === undefined) delete globalThis.ResizeObserver
    else globalThis.ResizeObserver = previous
  }
})

test('donut borders contain only open inner/outer arcs and the active border renders last in the slice color', async () => {
  const view = mount()
  try {
    const borders = nodes(view.element, node => node.props.class === 'sirius-donut-chart__curves')
    assert.equal(borders.length, 2)
    for (const border of borders) {
      assert.equal([...border.props.d.matchAll(/M/g)].length, 2)
      assert.equal([...border.props.d.matchAll(/A/g)].length, 4)
      assert.doesNotMatch(border.props.d, /[LZ]/)
    }
    const group = find(view, node => node.props.role === 'group')
    group.props.onFocus()
    await nextTick()
    let active = find(view, node => node.props.class === 'sirius-donut-chart__curves sirius-donut-chart__curves--active')
    assert.equal(active.props.stroke, 'var(--online)')
    assert.equal(active.props.d, borders[0].props.d)
    assert.equal(active.parent.children.filter(node => node.type === 'path').at(-1), active)
    group.props.onKeydown(event('End'))
    await nextTick()
    active = find(view, node => node.props.class === 'sirius-donut-chart__curves sirius-donut-chart__curves--active')
    assert.equal(active.props.stroke, '#4338ca')
    assert.equal(active.props.d, borders[1].props.d)
  } finally { view.unmount() }
})

test('multiple slices have small visual gaps while a single positive slice keeps a seamless full ring', () => {
  const view = mount({ data: [{ id: 'a', label: 'A', value: 50 }, { id: 'b', label: 'B', value: 50 }] })
  const single = mount({ data: [{ id: 'a', label: 'A', value: 100 }, { id: 'zero', label: 'Zero', value: 0 }] })
  try {
    const paths = nodes(view.element, node => node.props.class === 'sirius-donut-chart__slice')
    const firstX = Number(paths[0].props.d.match(/^M([^,]+)/)[1])
    const secondX = Number(paths[1].props.d.match(/^M([^,]+)/)[1])
    assert.ok(firstX > 320 && firstX < 324)
    assert.ok(secondX < 320 && secondX > 316)
    assert.match(text(find(view, node => node.type === 'tbody')), /A5050%B5050%/)
    const fullRing = find(single, node => node.props.class === 'sirius-donut-chart__slice')
    assert.equal(Number(fullRing.props.d.match(/^M([^,]+)/)[1]), 320)
    assert.match(text(find(single, node => node.type === 'tbody')), /A100100%/)
  } finally { view.unmount(); single.unmount() }
})

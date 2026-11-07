import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SLineChart } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

const data = [{ label: 'Mon', value: 10 }, { label: 'Tue', value: 20 }, { label: 'Wed', value: 15 }]
const nodes = (node, match) => [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))]
const text = node => (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')
const find = (view, match) => nodes(view.element, match)[0]
const mount = props => mountComponent(SLineChart, { title: 'Daily sales', data, ...props })
const render = props => renderToString(createSSRApp({ render: () => h(SLineChart, { title: 'Daily sales', data, ...props }) }))
const event = key => ({ key, prevented: false, preventDefault() { this.prevented = true } })

test('SSR exposes a named SVG, full data table, instructions and unique chart IDs', async () => {
  const html = await renderToString(createSSRApp({ render: () => h('div', [h(SLineChart, { title: 'Sales', data }), h(SLineChart, { title: 'Visits', data })]) }))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  assert.equal([...html.matchAll(/role="img"/g)].length, 2)
  assert.equal([...html.matchAll(/<table>/g)].length, 2)
  assert.match(html, /<summary>View data<\/summary>/)
  assert.match(html, /Use Left and Right arrow keys/)
  assert.match(html.replace(/<!--.*?-->/g, ''), /<th scope="row">Mon<\/th><td>10<\/td>/)
  const escaped = await render({ data: [{ label: '<script>alert(1)</script>', value: 1 }] })
  assert.doesNotMatch(escaped, /<script>/)
  assert.match(escaped, /&lt;script&gt;/)
})

test('null/nonfinite values create gaps rather than zeroes and the data view retains every category', () => {
  const view = mount({ data: [{ label: 'A', value: 10 }, { label: 'B', value: null }, { label: 'C', value: 0 }, { label: 'D', value: -10 }, { label: 'E', value: NaN }, { label: 'F', value: Infinity }] })
  try {
    const paths = nodes(view.element, node => node.type === 'path')
    assert.equal(paths.length, 2)
    assert.equal(nodes(view.element, node => node.type === 'circle').length, 3)
    const rows = find(view, node => node.type === 'tbody').children.filter(node => node.type === 'tr')
    assert.equal(rows.length, 6)
    assert.equal(text(rows[1]), 'B—')
    assert.equal(text(rows[2]), 'C0')
    assert.equal(text(rows[4]), 'E—')
    for (const path of paths) assert.doesNotMatch(path.props.d, /NaN|Infinity/)
    const circles = nodes(view.element, node => node.type === 'circle')
    assert.ok(circles[0].props.cy < circles[1].props.cy)
    assert.ok(circles[1].props.cy < circles[2].props.cy)
  } finally { view.unmount() }
})

test('single, flat, zero and extreme finite values render finite geometry within the plot', () => {
  for (const values of [[0], [10], [-10], [5, 5, 5], [Number.MIN_VALUE], [Number.MAX_VALUE], [-Number.MAX_VALUE, 0, Number.MAX_VALUE]]) {
    for (const includeZero of [true, false]) {
      const view = mount({ data: values.map((value, index) => ({ label: String(index), value })), includeZero })
      try {
        for (const path of nodes(view.element, node => node.type === 'path')) assert.doesNotMatch(path.props.d, /NaN|Infinity/)
        for (const circle of nodes(view.element, node => node.type === 'circle')) {
          assert.ok(Number.isFinite(circle.props.cx))
          assert.ok(Number.isFinite(circle.props.cy))
          assert.ok(circle.props.cy >= 17.99 && circle.props.cy <= 208.01)
        }
      } finally { view.unmount() }
    }
  }
})

test('loading, error and empty states suppress stale chart graphics and data', async () => {
  const loading = await render({ loading: true, error: 'Failed' })
  assert.match(loading, /aria-busy="true"/)
  assert.match(loading, /Loading chart/)
  assert.doesNotMatch(loading, /<svg|<table/)
  const error = await render({ error: 'Request failed' })
  assert.match(error, /role="alert"/)
  assert.match(error, /Request failed/)
  assert.doesNotMatch(error, /<svg|<table/)
  for (const empty of [[], [{ label: 'Missing', value: null }]]) {
    const html = await render({ data: empty })
    assert.match(html, /No data to display/)
    assert.doesNotMatch(html, /<svg|<table/)
  }
})

test('keyboard inspection skips gaps, supports boundaries and announces formatted values', async () => {
  const view = mount({ data: [{ label: 'A', value: 10 }, { label: 'Gap', value: null }, { label: 'C', value: 30 }], valueFormatter: value => `SGD ${value}` })
  const group = () => find(view, node => node.props.role === 'group')
  const readout = () => text(find(view, node => node.props.role === 'status'))
  try {
    group().props.onFocus()
    await nextTick()
    assert.match(readout(), /A · SGD 10/)
    group().props.onKeydown(event('ArrowRight'))
    await nextTick()
    assert.match(readout(), /C · SGD 30/)
    group().props.onKeydown(event('Home'))
    await nextTick()
    assert.match(readout(), /A · SGD 10/)
    group().props.onKeydown(event('End'))
    await nextTick()
    assert.match(readout(), /C · SGD 30/)
    const orthogonal = event('ArrowDown')
    group().props.onKeydown(orthogonal)
    assert.equal(orthogonal.prevented, false)
    group().props.onKeydown(event('Escape'))
    await nextTick()
    assert.match(readout(), /—/)
    view.state.value = { title: 'Updated', data: [{ label: 'New', value: 2 }] }
    await nextTick()
    group().props.onKeydown(event('End'))
    await nextTick()
    assert.match(readout(), /New · 2/)
    group().props.onBlur()
    await nextTick()
    assert.match(readout(), /—/)
  } finally { view.unmount() }
})

test('pointer inspection uses SVG coordinates and resets when the pointer leaves', async () => {
  const view = mount()
  try {
    const svg = find(view, node => node.type === 'svg')
    svg.getBoundingClientRect = () => ({ left: 20, width: 640 })
    svg.props.onPointermove({ clientX: 640 })
    await nextTick()
    assert.match(text(find(view, node => node.props.role === 'status')), /Wed · 15/)
    find(view, node => node.props.class === 'sirius-chart__viewport').props.onPointerleave()
    await nextTick()
    assert.match(text(find(view, node => node.props.role === 'status')), /—/)
  } finally { view.unmount() }
})

test('responsive width follows the plot through state changes and cleans up observers', async () => {
  const previous = globalThis.ResizeObserver
  const observers = []
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this) }
    observe(target) { this.target = target }
    disconnect() { this.disconnected = true }
  }
  const view = mount({ loading: true })
  try {
    assert.equal(observers.length, 0)
    view.state.value = { title: 'Sales', data }
    await nextTick()
    assert.equal(observers.length, 1)
    observers[0].callback([{ contentRect: { width: 320 } }])
    await nextTick()
    const svg = find(view, node => node.type === 'svg')
    assert.equal(svg.props.viewBox, '0 0 320 240')
    const labels = nodes(view.element, node => node.type === 'text' && node.props.y === 232)
    assert.ok(labels.length <= 3)
    view.state.value = { title: 'Sales', data, error: 'Failed' }
    await nextTick()
    assert.equal(observers[0].disconnected, true)
    view.state.value = { title: 'Sales', data }
    await nextTick()
    assert.equal(observers.length, 2)
    view.unmount()
    assert.equal(observers[1].disconnected, true)
  } finally {
    if (!observers.at(-1)?.disconnected) view.unmount()
    if (previous === undefined) delete globalThis.ResizeObserver
    else globalThis.ResizeObserver = previous
  }
})

test('package keeps Vue external, has no chart-engine dependency and ships isolated themed CSS', async () => {
  const [code, css, metadata, license, rootLicense] = await Promise.all([
    readFile(new URL('../dist/index.js', import.meta.url), 'utf8'), readFile(new URL('../dist/style.css', import.meta.url), 'utf8'),
    readFile(new URL('../package.json', import.meta.url), 'utf8'), readFile(new URL('../LICENSE', import.meta.url), 'utf8'), readFile(new URL('../../../LICENSE', import.meta.url), 'utf8'),
  ])
  assert.match(code, /from ["']vue["']/)
  assert.deepEqual(Object.keys(JSON.parse(metadata).dependencies), ['@sirius-ui/theme'])
  assert.match(css, /--sirius-primary-content/)
  assert.match(css, /focus-visible/)
  assert.doesNotMatch(css, /(?:^|[{}])[^{}]*\*[^{}]*\{[^{}]*box-sizing:border-box/)
  assert.equal(license, rootLicense)
})

test('all category labels remain visible in a scrollable plot, without dropping observations', () => {
  const days = Array.from({ length: 14 }, (_, index) => ({ label: `${index + 1} Nov`, value: index }))
  const view = mount({ data: days, xLabels: 'all' })
  try {
    const labels = nodes(view.element, node => node.type === 'text' && node.props.y === 232)
    assert.equal(labels.length, 14)
    assert.deepEqual(labels.map(node => node.children[0].text), days.map(day => day.label))
    const svg = find(view, node => node.type === 'svg')
    assert.ok(Number(svg.props.viewBox.split(' ')[2]) > 640)
    assert.equal(nodes(view.element, node => node.type === 'tbody')[0].children.filter(node => node.type === 'tr').length, 14)
  } finally { view.unmount() }
})

test('multiple series align by category on a shared scale and inspect every value together', async () => {
  const series = [
    { id: 'online', label: 'Online', data: [{ label: 'Mon', value: 20 }, { label: 'Tue', value: 40 }, { label: 'Wed', value: null }] },
    { id: 'store', label: 'Store', data: [{ label: 'Mon', value: 20 }, { label: 'Wed', value: -10 }] },
    { id: 'partner', label: 'Partners', color: 'var(--custom-chart)', data: [{ label: 'Thu', value: 100 }] },
  ]
  const view = mount({ data: undefined, series })
  try {
    const table = find(view, node => node.type === 'table')
    assert.match(text(table), /PeriodOnlineStorePartners/)
    const rows = find(view, node => node.type === 'tbody').children.filter(node => node.type === 'tr')
    assert.deepEqual(rows.map(text), ['Mon2020—', 'Tue40——', 'Wed—-10—', 'Thu——100'])
    const circles = nodes(view.element, node => node.type === 'circle')
    assert.equal(circles.length, 5)
    assert.equal(circles[0].props.cy, circles[2].props.cy)
    assert.ok(circles[4].props.cy < circles[1].props.cy)
    const paths = nodes(view.element, node => node.type === 'path')
    assert.ok(paths.some(path => path.props['stroke-dasharray'] === '8 4'))
    assert.ok(paths.some(path => path.props['stroke-dasharray'] === '2 5'))
    const group = find(view, node => node.props.role === 'group')
    group.props.onFocus()
    await nextTick()
    const status = () => text(find(view, node => node.props.role === 'status'))
    assert.match(status(), /Mon · Online: 20 · Store: 20 · Partners: —/)
    group.props.onKeydown(event('ArrowRight'))
    group.props.onKeydown(event('ArrowRight'))
    await nextTick()
    assert.match(status(), /Wed · Online: — · Store: -10 · Partners: —/)
    group.props.onKeydown(event('End'))
    await nextTick()
    assert.match(status(), /Thu · Online: — · Store: — · Partners: 100/)
    view.state.value = { title: 'Changed', series: [] }
    await nextTick()
    assert.equal(nodes(view.element, node => node.type === 'svg').length, 0)
  } finally { view.unmount() }
})

test('rounded curves pass through observations, preserve gaps, and keep controls within each interval', () => {
  const values = [0, 10, 3, 3, -8, 20, null, 5, 9, 2]
  const view = mount({ data: values.map((value, index) => ({ label: String(index), value })), smooth: true })
  try {
    const paths = nodes(view.element, node => node.type === 'path')
    const points = nodes(view.element, node => node.type === 'circle')
    assert.equal(paths.length, 2)
    let offset = 0
    for (const path of paths) {
      assert.doesNotMatch(path.props.d, /NaN|Infinity/)
      const commands = [...path.props.d.matchAll(/([MC])([^MC]+)/g)]
      assert.equal(commands[0][1], 'M')
      for (let index = 1; index < commands.length; index++) {
        const [x1, y1, x2, y2, x, y] = commands[index][2].trim().split(/[ ,]+/).map(Number)
        const before = points[offset + index - 1].props, after = points[offset + index].props
        const low = Math.min(before.cy, after.cy) - .011, high = Math.max(before.cy, after.cy) + .011
        assert.ok(y1 >= low && y1 <= high)
        assert.ok(y2 >= low && y2 <= high)
        assert.ok(x1 >= before.cx && x2 <= after.cx)
        assert.ok(Math.abs(x - after.cx) <= .011 && Math.abs(y - after.cy) <= .011)
      }
      offset += commands.length
    }
    assert.equal(offset, values.filter(value => value !== null).length)
  } finally { view.unmount() }
})

test('per-series colors and patterns update graphics and matching legends independently of values', async () => {
  const series = [
    { id: 'a', label: 'Online', data, color: 'var(--my-online)', pattern: 'dotted' },
    { id: 'b', label: 'Store', data, color: '#7e22ce', pattern: 'solid' },
  ]
  const view = mount({ data: undefined, series })
  const paths = () => nodes(view.element, node => node.type === 'path')
  const keys = () => nodes(view.element, node => node.props.class === 'sirius-line-chart__key')
  const cells = () => nodes(view.element, node => node.type === 'td').map(text)
  try {
    assert.equal(paths()[0].props['stroke-dasharray'], '2 5')
    assert.equal(paths()[1].props['stroke-dasharray'], '')
    assert.equal(paths()[0].parent.props.style['--sirius-chart-color'], 'var(--my-online)')
    assert.equal(keys()[0].props.style.borderTopStyle, 'dotted')
    assert.equal(keys()[1].props.style.borderTopStyle, 'solid')
    const original = cells()
    view.state.value = { title: 'Sales', series: [{ ...series[0], pattern: 'dashed', color: '#be185d' }, series[1]] }
    await nextTick()
    assert.equal(paths()[0].props['stroke-dasharray'], '8 4')
    assert.equal(paths()[0].parent.props.style['--sirius-chart-color'], '#be185d')
    assert.equal(keys()[0].props.style.borderTopStyle, 'dashed')
    assert.equal(paths()[1].props['stroke-dasharray'], '')
    assert.deepEqual(cells(), original)
  } finally { view.unmount() }
})

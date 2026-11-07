import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SDashboardLayout } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
const find = (view, match) => nodes(view.element, match)[0]
const slots = {
  brand: () => h('a', { href: '/' }, 'My workspace'),
  navigation: ({ close, mobile }) => h('a', { href: '/orders', onClick: close }, mobile ? 'Mobile orders' : 'Orders'),
  default: () => h('h1', {}, 'Orders page'),
}
function mount(props = {}, slotOverrides = {}) {
  const view = mountComponent(SDashboardLayout, props, { ...slots, ...slotOverrides })
  const dialog = find(view, node => node.type === 'dialog')
  dialog.open = false
  dialog.showModal = () => { dialog.open = true }
  dialog.close = () => { dialog.open = false }
  const button = () => find(view, node => node.props['aria-haspopup'] === 'dialog')
  const finishClose = () => {
    dialog.props.onAnimationend({ target: dialog, animationName: 'sirius-drawer-out' })
    dialog.props.onClose(new Event('close'))
  }
  return { view, dialog, button, finishClose }
}

test('dashboard SSR supplies unique skip targets and named navigation without requiring a browser', async () => {
  const html = await renderToString(createSSRApp({ render: () => h('div', [h(SDashboardLayout, { navigationLabel: 'Store navigation' }, slots), h(SDashboardLayout, {}, slots)]) }))
  const skipTargets = [...html.matchAll(/href="#([^"]+-content)"/g)].map(match => match[1])
  assert.equal(new Set(skipTargets).size, 2)
  for (const id of skipTargets) assert.ok(html.includes(`<main id="${id}"`))
  assert.match(html, /<nav aria-label="Store navigation"/)
  assert.match(html, /<h1>Orders page<\/h1>/)
  assert.doesNotMatch(html, /Mobile orders/)
  assert.equal([...html.matchAll(/aria-expanded="false"/g)].length, 2)
})
test('mobile navigation reuses the native drawer and focuses content only after navigation dismissal completes', async () => {
  const { view, dialog, button, finishClose } = mount()
  let contentFocused = false
  find(view, node => node.type === 'main').focus = () => { contentFocused = true }
  try {
    button().props.onClick()
    await nextTick()
    assert.equal(dialog.open, true)
    assert.equal(button().props['aria-expanded'], true)
    find(view, node => node.type === 'a' && node.text === 'Mobile orders').props.onClick()
    await nextTick()
    assert.equal(button().props['aria-expanded'], false)
    assert.equal(dialog.open, true)
    assert.equal(contentFocused, false)
    finishClose()
    assert.equal(dialog.open, false)
    assert.equal(contentFocused, true)
  } finally { view.unmount() }
})
test('Escape delegates to the drawer without overriding its native opener focus restoration', async () => {
  const { view, dialog, button, finishClose } = mount()
  let contentFocused = false
  find(view, node => node.type === 'main').focus = () => { contentFocused = true }
  try {
    button().props.onClick()
    await nextTick()
    dialog.props.onCancel(new Event('cancel', { cancelable: true }))
    await nextTick()
    finishClose()
    assert.equal(button().props['aria-expanded'], false)
    assert.equal(contentFocused, false)
  } finally { view.unmount() }
})
test('application route keys close the drawer, while ordinary header updates leave it open', async () => {
  const { view, dialog, button, finishClose } = mount({ navigationKey: '/orders' })
  find(view, node => node.type === 'main').focus = () => {}
  try {
    button().props.onClick()
    await nextTick()
    view.state.value = { ...view.state.value, navigationLabel: 'Updated navigation' }
    await nextTick()
    assert.equal(button().props['aria-expanded'], true)
    view.state.value = { ...view.state.value, navigationKey: '/products' }
    await nextTick()
    assert.equal(button().props['aria-expanded'], false)
    finishClose()
    assert.equal(dialog.open, false)
  } finally { view.unmount() }
})
test('crossing the desktop breakpoint dismisses mobile modality and removes its listener on unmount', async () => {
  const previousWindow = globalThis.window
  let listener, removed = false
  const media = { matches: false, addEventListener(_type, callback) { listener = callback }, removeEventListener(_type, callback) { removed = callback === listener } }
  globalThis.window = { matchMedia: () => media }
  const { view, dialog, button, finishClose } = mount()
  let contentFocused = false
  find(view, node => node.type === 'main').focus = () => { contentFocused = true }
  try {
    button().props.onClick()
    await nextTick()
    assert.equal(dialog.open, true)
    media.matches = true
    listener({ matches: true })
    await nextTick()
    finishClose()
    assert.equal(contentFocused, true)
    button().props.onClick()
    await nextTick()
    assert.equal(dialog.open, false)
  } finally {
    view.unmount()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
  assert.equal(removed, true)
})
test('the package keeps primitives and Vue external and exports compiled styles without a global reset', async () => {
  const [code, css, metadata] = await Promise.all([
    readFile(new URL('../dist/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../dist/style.css', import.meta.url), 'utf8'),
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ])
  assert.match(code, /from ["']@sirius-ui\/vue["']/)
  assert.match(code, /from ["']vue["']/)
  assert.match(css, /--sirius-dashboard-sidebar-width/)
  assert.match(css, /--sirius-canvas/)
  assert.doesNotMatch(css, /(?:^|[{}])[^{}]*\*[^{}]*\{[^{}]*box-sizing:border-box/)
  assert.equal(JSON.parse(metadata).exports['./style.css'], './dist/style.css')
})

test('a heading in the shell header can label main content without a duplicate content heading', async () => {
  const html = await renderToString(createSSRApp({ render: () => h(SDashboardLayout, { mainLabelledby: 'tables-title' }, {
    brand: slots.brand, navigation: slots.navigation,
    header: () => h('h1', { id: 'tables-title' }, 'Tables'),
    default: () => h('p', 'Customer orders'),
  }) }))
  assert.match(html, /<main[^>]*aria-labelledby="tables-title"/)
  assert.match(html, /<h1 id="tables-title">Tables<\/h1>/)
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
})

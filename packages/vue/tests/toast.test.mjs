import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SToast, SToaster, useToasts } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'
const render = node => renderToString(createSSRApp({ render: () => node }))
function nodes(node, predicate) { return [...(predicate(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, predicate))] }
function panel(view) { return nodes(view.element, node => node.props.role === 'group')[0] }

test('toast collection state is scoped, immutable through the public ref, and dismisses by ID', () => {
  const first = useToasts(), second = useToasts()
  const id = first.notify({ title: 'Saved', color: 'success' })
  first.notify({ title: 'Another' })
  assert.equal(first.items.value.length, 2)
  assert.equal(second.items.value.length, 0)
  assert.equal(first.items.__v_isReadonly, true)
  first.dismiss(id)
  assert.deepEqual(first.items.value.map(item => item.title), ['Another'])
  first.clear()
  assert.equal(first.items.value.length, 0)
})

test('toast semantics keep live announcements separate from interactive content', async () => {
  const html = await render(h(SToast, { title: 'Saved', description: 'Your work is ready.', duration: 0 }, { actions: () => h('button', {}, 'Undo') }))
  assert.match(html, /role="status" aria-atomic="true"/)
  assert.match(html, /role="group" aria-labelledby="([^"]+)" aria-describedby=/)
  assert.match(html, /type="button" aria-label="Dismiss notification"/)
  assert.match(html, />Undo<\/button>/)
  const closed = await render(h(SToast, { title: 'Hidden', open: false }))
  assert.doesNotMatch(closed, /role="group"|Dismiss notification/)
  assert.match(closed, /role="status"/)
})

test('independent toast hosts do not leak duplicate item IDs into DOM attributes', async () => {
  const first = useToasts(), second = useToasts()
  first.notify({ title: 'First' }); second.notify({ title: 'Second' })
  const html = await render(h('div', [h(SToaster, { toasts: first.items.value }), h(SToaster, { toasts: second.items.value })]))
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  assert.doesNotMatch(html, /id="toast-1"/)
})

test('timer expires once and unmount clears outstanding work', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  const reasons = []
  const view = mountComponent(SToast, { title: 'Saved', duration: 1000, onDismiss: reason => reasons.push(reason) })
  t.mock.timers.tick(999)
  assert.deepEqual(reasons, [])
  t.mock.timers.tick(1)
  assert.deepEqual(reasons, ['timeout'])
  t.mock.timers.tick(1000)
  assert.equal(reasons.length, 1)
  view.unmount()
  const pending = mountComponent(SToast, { title: 'Pending', duration: 1000, onDismiss: reason => reasons.push(reason) })
  pending.unmount()
  t.mock.timers.tick(2000)
  assert.equal(reasons.length, 1)
})

test('hover pauses remaining time and touch does not pause', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  const reasons = []
  const view = mountComponent(SToast, { title: 'Pause', duration: 1000, onDismiss: reason => reasons.push(reason) })
  try {
    t.mock.timers.tick(400)
    panel(view).props.onPointerenter({ pointerType: 'mouse' })
    t.mock.timers.tick(5000)
    assert.deepEqual(reasons, [])
    panel(view).props.onPointerleave()
    t.mock.timers.tick(599)
    assert.deepEqual(reasons, [])
    t.mock.timers.tick(1)
    assert.deepEqual(reasons, ['timeout'])
  } finally { view.unmount() }
  const touch = mountComponent(SToast, { title: 'Touch', duration: 1000, onDismiss: reason => reasons.push(reason) })
  try { panel(touch).props.onPointerenter({ pointerType: 'touch' }); t.mock.timers.tick(1000); assert.equal(reasons.length, 2) }
  finally { touch.unmount() }
})

test('persistent messages close explicitly and reopening resets the timer and hover state', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  const updates = [], reasons = []
  const view = mountComponent(SToast, { title: 'Persistent', duration: 0, onDismiss: reason => reasons.push(reason) })
  try {
    t.mock.timers.tick(100000)
    assert.deepEqual(reasons, [])
    nodes(view.element, node => node.type === 'button')[0].props.onClick()
    await nextTick()
    assert.deepEqual(reasons, ['close-button'])
  } finally { view.unmount() }
  const controlled = mountComponent(SToast, { title: 'Controlled', open: true, duration: 1000, 'onUpdate:open': value => updates.push(value) })
  try {
    panel(controlled).props.onPointerenter({ pointerType: 'mouse' })
    controlled.state.value = { ...controlled.state.value, open: false }
    await nextTick()
    controlled.state.value = { ...controlled.state.value, open: true }
    await nextTick()
    t.mock.timers.tick(1000)
    assert.deepEqual(updates, [false])
  } finally { controlled.unmount() }
})

test('focus, hover, visibility and window pauses compose without premature expiry', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] })
  const keys = ['document', 'window', 'Node', 'HTMLElement']
  const descriptors = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  class FakeNode {}
  class FakeElement extends FakeNode {
    isConnected = true
    focused = false
    focus() { this.focused = true }
  }
  const document = Object.assign(new EventTarget(), { hidden: false, activeElement: null, hasFocus: () => true })
  const window = new EventTarget()
  Object.assign(globalThis, { document, window, Node: FakeNode, HTMLElement: FakeElement })
  const reasons = []
  const view = mountComponent(SToast, { title: 'Pause together', duration: 1000, onDismiss: reason => reasons.push(reason) })
  panel(view).contains = () => false
  try {
    t.mock.timers.tick(200)
    panel(view).props.onFocusin({ relatedTarget: new FakeElement() })
    panel(view).props.onPointerenter({ pointerType: 'mouse' })
    t.mock.timers.tick(3000)
    panel(view).props.onPointerleave()
    t.mock.timers.tick(3000)
    assert.deepEqual(reasons, [])
    window.dispatchEvent(new Event('blur'))
    document.hidden = true
    document.dispatchEvent(new Event('visibilitychange'))
    panel(view).props.onFocusout({ relatedTarget: new FakeElement() })
    document.hidden = false
    document.dispatchEvent(new Event('visibilitychange'))
    t.mock.timers.tick(3000)
    assert.deepEqual(reasons, [])
    window.dispatchEvent(new Event('focus'))
    t.mock.timers.tick(799)
    assert.deepEqual(reasons, [])
    t.mock.timers.tick(1)
    assert.deepEqual(reasons, ['timeout'])
  } finally {
    view.unmount()
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SDrawer } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = node => renderToString(createSSRApp({ render: () => node }))
function nativeDialog(props = {}) {
  const view = mountComponent(SDrawer, { open: false, ...props })
  const element = view.element
  element.open = false
  element.showModal = () => { element.open = true }
  element.close = () => { element.open = false }
  element.getBoundingClientRect = () => ({ left: 100, right: 500, top: 100, bottom: 400 })
  return { view, element, async open() { view.state.value = { ...view.state.value, open: true }; await nextTick() } }
}

test('drawer: dialog SSR links unique titles and descriptions without rendering a non-modal open attribute', async () => {
  const html = await render(h('div', [
    h(SDrawer, { open: true, title: 'First', description: 'Details', 'aria-describedby': 'external' }, () => 'Content'),
    h(SDrawer, { open: true, title: 'Second' }),
  ]))
  const tags = [...html.matchAll(/<dialog\b[^>]*>/g)].map(([tag]) => tag)
  const titleId = tags[0].match(/aria-labelledby="([^"]+)"/)[1]
  assert.match(html, new RegExp(`id="${titleId}"`))
  assert.ok(tags[0].includes(`aria-describedby="external ${titleId.replace('-title', '-description')}"`))
  assert.notEqual(tags[0].match(/aria-labelledby="([^"]+)"/)[1], tags[1].match(/aria-labelledby="([^"]+)"/)[1])
  assert.match(tags[0], /aria-modal="true"/)
  assert.doesNotMatch(tags[0], /\sopen(?:=|\s|>)/)
  assert.match(html, /type="button" aria-label="Close drawer"/)
})

test('drawer: closed dialog content is unmounted and titleless dialogs accept an accessible name', async () => {
  const closed = await render(h(SDrawer, { title: 'Hidden' }, () => h('input', { name: 'hidden-input' })))
  assert.doesNotMatch(closed, /<input|<h2|<button/)
  const named = await render(h(SDrawer, { open: true, 'aria-label': 'Quick preview', showClose: false }, { default: () => 'Preview', footer: () => h('button', {}, 'Done') }))
  assert.match(named, /aria-label="Quick preview"/)
  assert.doesNotMatch(named, /aria-labelledby|Close drawer/)
  assert.match(named, />Done<\/button>/)
})

test('drawer: native modal state follows the model and native close events synchronize visibility', async () => {
  const updates = [], closes = []
  const { view, element, open } = nativeDialog({ 'onUpdate:open': value => updates.push(value), onClose: event => closes.push(event) })
  try {
    await open()
    assert.equal(element.open, true)
    view.state.value = { ...view.state.value, open: false }
    await nextTick()
    assert.equal(element.open, true)
    assert.equal(element.props['data-state'], 'closed')
    element.props.onAnimationend({ target: element, animationName: 'sirius-drawer-out' })
    assert.equal(element.open, false)
    const event = new Event('close')
    element.props.onClose(event)
    assert.deepEqual(closes, [event])
    await open()
    element.props.onClose(new Event('close'))
    assert.equal(element.open, true)
    assert.equal(closes.length, 1)
    element.open = false
    element.props.onClose(new Event('close'))
    assert.deepEqual(updates, [false])
  } finally { view.unmount() }
})

test('drawer: Escape dismissal respects the option and keeps controlled dialogs open until the parent updates', async () => {
  const updates = [], reasons = []
  const { view, element, open } = nativeDialog({ 'onUpdate:open': value => updates.push(value), onDismiss: reason => reasons.push(reason) })
  try {
    await open()
    const cancel = new Event('cancel', { cancelable: true })
    element.props.onCancel(cancel)
    await nextTick()
    assert.equal(cancel.defaultPrevented, true)
    assert.equal(element.open, true)
    assert.deepEqual(updates, [false])
    assert.deepEqual(reasons, ['escape'])
    view.state.value = { ...view.state.value, closeOnEscape: false }
    await nextTick()
    element.props.onCancel(new Event('cancel', { cancelable: true }))
    assert.equal(reasons.length, 1)
  } finally { view.unmount() }
})

test('drawer: backdrop dismissal requires both pointer start and click outside the dialog rectangle', async () => {
  const reasons = []
  const { view, element, open } = nativeDialog({ onDismiss: reason => reasons.push(reason) })
  const pointer = (x, y) => ({ target: element, clientX: x, clientY: y })
  try {
    await open()
    element.props.onPointerdown(pointer(200, 200))
    element.props.onClick(pointer(0, 0))
    element.props.onPointerdown(pointer(0, 0))
    element.props.onClick(pointer(200, 200))
    assert.deepEqual(reasons, [])
    element.props.onPointerdown(pointer(0, 0))
    element.props.onClick(pointer(0, 0))
    assert.deepEqual(reasons, ['backdrop'])
    view.state.value = { ...view.state.value, closeOnBackdrop: false }
    await nextTick()
    element.props.onPointerdown(pointer(0, 0))
    element.props.onClick(pointer(0, 0))
    assert.equal(reasons.length, 1)
  } finally { view.unmount() }
})


test('drawer: reopening during the exit animation cancels closure and keeps modal content mounted', async () => {
  const { view, element, open } = nativeDialog()
  try {
    await open()
    view.state.value = { ...view.state.value, open: false }
    await nextTick()
    assert.equal(element.open, true)
    await open()
    element.props.onAnimationend({ target: element, animationName: 'sirius-drawer-out' })
    assert.equal(element.open, true)
    assert.equal(element.props['data-state'], 'open')
  } finally { view.unmount() }
})

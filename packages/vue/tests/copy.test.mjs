import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick } from 'vue'
import { SCopyButton } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
const button = view => nodes(view.element, node => node.type === 'button')[0]
const status = view => nodes(view.element, node => node.props.role === 'status')[0]
const text = node => node.text + node.children.map(text).join('')
const click = view => button(view).props.onClick({ preventDefault() {}, stopPropagation() {} })
async function flush() { await Promise.resolve(); await nextTick(); await nextTick() }
function clipboard(t, writeText) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: writeText ? { writeText } : undefined } })
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'navigator', previous)
    else delete globalThis.navigator
  })
}

test('copy writes exact text only on activation and resets its announced success', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const writes = []
  const copied = []
  clipboard(t, async value => writes.push(value))
  const value = '  const html = "<p>Hello</p>"\n\n  return html\n'
  const view = mountComponent(SCopyButton, { text: value, onCopied: value => copied.push(value), resetDelay: 50, href: '/unwanted', as: 'a' })
  try {
    assert.deepEqual(writes, [])
    assert.equal(button(view).props.type, 'button')
    assert.equal(button(view).props.href, undefined)
    click(view)
    await flush()
    assert.deepEqual(writes, [value])
    assert.deepEqual(copied, [value])
    assert.equal(text(status(view)), 'Copied')
    t.mock.timers.tick(50)
    await nextTick()
    assert.equal(text(status(view)), '')
  } finally { view.unmount() }
})

test('clipboard rejection and missing API report failure and preserve manual-copy guidance', async t => {
  const denied = new Error('Permission denied')
  clipboard(t, async () => { throw denied })
  const errors = []
  const view = mountComponent(SCopyButton, { text: 'example', resetDelay: 0, onError: error => errors.push(error) })
  try {
    click(view)
    await flush()
    assert.deepEqual(errors, [denied])
    assert.match(text(status(view)), /Copy failed.*Select the text/)
    const description = nodes(view.element, node => node.props.id === button(view).props['aria-describedby'])[0]
    assert.match(text(description), /copy it manually/)
    globalThis.navigator.clipboard = undefined
    click(view)
    await flush()
    assert.equal(errors.length, 2)
    assert.match(errors[1].message, /unavailable/)
  } finally { view.unmount() }
})

test('disabled and pending copies are blocked and stale completions are ignored after changes or unmount', async t => {
  const requests = []
  clipboard(t, value => new Promise(resolve => requests.push({ value, resolve })))
  const copied = []
  const view = mountComponent(SCopyButton, { text: 'first', disabled: true, onCopied: value => copied.push(value) })
  click(view)
  assert.equal(requests.length, 0)
  view.state.value = { ...view.state.value, disabled: false }
  await nextTick()
  click(view)
  click(view)
  assert.equal(requests.length, 1)
  view.state.value = { ...view.state.value, text: 'second' }
  await nextTick()
  requests[0].resolve()
  await flush()
  assert.deepEqual(copied, [])
  assert.equal(text(status(view)), '')
  click(view)
  assert.equal(requests[1].value, 'second')
  view.unmount()
  requests[1].resolve()
  await flush()
  assert.deepEqual(copied, [])
})

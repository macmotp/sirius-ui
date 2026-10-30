import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SAlert } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = (node) => renderToString(createSSRApp({ render: () => node }))
function find(node, type) {
  return node.type === type ? node : node.children.map(child => find(child, type)).find(Boolean)
}

test('alerts provide polite status semantics and support explicitly urgent messages', async () => {
  const html = await render(h(SAlert, { title: 'Saved', id: 'result', 'aria-label': 'Save result' }, () => 'Your changes are saved.'))
  assert.match(html, /role="status"/)
  assert.match(html, /aria-atomic="true"/)
  assert.match(html, /id="result"/)
  assert.match(html, /aria-label="Save result"/)
  assert.match(html, /Saved/)
  assert.match(html, /Your changes are saved/)
  assert.doesNotMatch(html, /<button/)
  const urgent = await render(h(SAlert, { color: 'danger', role: 'alert', icon: false }, () => 'Connection lost'))
  assert.match(urgent, /role="alert"/)
  assert.doesNotMatch(urgent, /<svg/)
})

test('dismissal hides an uncontrolled alert, emits the original event once, and uses a non-submit button', async () => {
  const changes = [], dismissals = []
  const view = mountComponent(SAlert, { dismissible: true, dismissLabel: 'Close update', 'onUpdate:open': value => changes.push(value), onDismiss: event => dismissals.push(event) }, { default: () => 'Saved' })
  try {
    const button = find(view.element, 'button')
    assert.equal(button.props.type, 'button')
    assert.equal(button.props['aria-label'], 'Close update')
    const event = new Event('click')
    button.props.onClick(event)
    await nextTick()
    assert.deepEqual(changes, [false])
    assert.deepEqual(dismissals, [event])
    assert.equal(view.element.type, '#comment')
  } finally { view.unmount() }
})

test('controlled alerts can be closed and reopened without losing content or attributes', async () => {
  const updates = []
  const view = mountComponent(SAlert, { open: true, dismissible: true, 'onUpdate:open': value => updates.push(value) }, { default: () => 'Persistent message' })
  try {
    find(view.element, 'button').props.onClick(new Event('click'))
    assert.deepEqual(updates, [false])
    view.state.value = { ...view.state.value, open: false }
    await nextTick()
    assert.equal(view.element.type, '#comment')
    view.state.value = { ...view.state.value, open: true, id: 'reopened' }
    await nextTick()
    assert.equal(view.element.type, 'div')
    assert.equal(view.element.props.id, 'reopened')
    assert.ok(find(view.element, 'button'))
  } finally { view.unmount() }
})

test('title, decorative icon, and action slots compose without hiding interactive actions', async () => {
  const html = await render(h(SAlert, { title: 'Fallback', color: 'warning', variant: 'solid' }, {
    title: () => 'Review changes',
    icon: () => h('svg', { 'data-custom-icon': 'true' }),
    default: () => 'Check the details.',
    actions: () => h('a', { href: '/review' }, 'Review'),
  }))
  assert.match(html, /Review changes/)
  assert.doesNotMatch(html, /Fallback/)
  assert.match(html, /aria-hidden="true"[^>]*><!--\[--><svg data-custom-icon="true"/)
  assert.match(html, /href="\/review"/)
  assert.match(html, /text-on-warning/)
  assert.doesNotMatch(html, /variant="solid"|color="warning"/)
  assert.equal(await render(h(SAlert, { open: false }, () => 'Hidden')), '<!---->')
})

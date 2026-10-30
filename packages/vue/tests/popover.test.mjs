import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SPopover } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
const slots = { trigger: ({ trigger }) => h('button', trigger, 'Preferences'), default: ({ close }) => h('button', { onClick: close }, 'Save') }
const find = (view, predicate) => nodes(view.element, predicate)[0]

test('popover slots associate real triggers with uniquely labelled interactive dialogs', async () => {
  const item = () => h(SPopover, { title: 'Preferences', description: 'Choose updates', open: true }, slots)
  const html = await renderToString(createSSRApp({ render: () => h('div', [item(), item()]) }))
  const ids = [...html.matchAll(/aria-controls="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, 2)
  for (const id of ids) assert.ok(html.includes(`id="${id}"`))
  assert.equal([...html.matchAll(/role="dialog"/g)].length, 2)
  assert.match(html, /aria-haspopup="dialog" aria-expanded="true"/)
  assert.match(html, /aria-labelledby="[^"]+" aria-describedby="[^"]+"/)
  assert.match(html, />Save<\/button>/)
})
test('click toggles, content closes, and Escape dismisses without reaching a parent dialog', async () => {
  const reasons = []
  const view = mountComponent(SPopover, { title: 'Preferences', onDismiss: reason => reasons.push(reason) }, slots)
  try {
    const trigger = () => find(view, node => node.props['aria-haspopup'] === 'dialog')
    trigger().props.onClick({ currentTarget: {} })
    await nextTick()
    assert.equal(trigger().props['aria-expanded'], true)
    let prevented = false, stopped = false
    view.element.props.onKeydown({ key: 'Escape', preventDefault() { prevented = true }, stopPropagation() { stopped = true } })
    await nextTick()
    assert.deepEqual([prevented, stopped], [true, true])
    assert.equal(trigger().props['aria-expanded'], false)
    trigger().props.onClick({ currentTarget: {} })
    await nextTick()
    find(view, node => node.type === 'button' && node.text === 'Save').props.onClick()
    await nextTick()
    assert.equal(trigger().props['aria-expanded'], false)
    assert.deepEqual(reasons, ['escape', 'close'])
  } finally { view.unmount() }
})
test('disabled popovers cannot be opened, including through a controlled model', async () => {
  const view = mountComponent(SPopover, { title: 'Preferences', disabled: true, open: true }, slots)
  try {
    assert.equal(find(view, node => node.props.role === 'dialog'), undefined)
    const trigger = find(view, node => node.type === 'button')
    assert.equal(trigger.props.disabled, true)
    trigger.props.onClick({ currentTarget: {} })
    await nextTick()
    assert.equal(find(view, node => node.props.role === 'dialog'), undefined)
  } finally { view.unmount() }
})

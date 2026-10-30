import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SDropdown } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const items = [{id: 'edit', label: 'Edit'}, {id: 'locked', label: 'Locked', disabled: true, href: '/private'}, {id: 'browse', label: 'Browse', href: '/projects', target: '_blank', separatorBefore: true}]
const render = node => renderToString(createSSRApp({ render: () => node }))
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
function mount(props = {}) {
  const view = mountComponent(SDropdown, { items, ...props })
  for (const node of nodes(view.element, () => true)) node.focus = () => {}
  return view
}
function trigger(view) { return nodes(view.element, node => node.props['aria-haspopup'] === 'menu')[0] }
function menu(view) { return nodes(view.element, node => node.props.role === 'menu')[0] }
function entries(view) { return nodes(view.element, node => node.props.role === 'menuitem') }
function key(value) { return { key: value, preventDefault() {}, stopPropagation() {} } }

test('menus connect their trigger and panel, retain anchor semantics, and remove destinations from disabled items', async () => {
  const html = await render(h(SDropdown, { open: true, label: 'Tools', items }))
  const button = html.match(/<button\b[^>]*aria-haspopup="menu"[^>]*>/)[0]
  const controlId = button.match(/aria-controls="([^"]+)"/)[1]
  assert.ok(html.includes(`id="${controlId}"`))
  assert.match(button, /aria-expanded="true"/)
  assert.match(html, /<button role="menuitem" type="button"/)
  assert.match(html, /<a role="menuitem" href="\/projects" target="_blank" rel="noopener noreferrer"/)
  assert.match(html, /<span role="menuitem" aria-disabled="true" tabindex="-1"/)
  assert.doesNotMatch(html, /href="\/private"/)
  assert.match(html, /role="separator"/)
  const closed = await render(h(SDropdown, { items }))
  assert.doesNotMatch(closed, /role="menuitem"/)
})

test('arrow navigation wraps, skips disabled items, and supports Home/End and typeahead', async () => {
  const view = mount()
  try {
    trigger(view).props.onKeydown(key('ArrowDown'))
    await nextTick(); await nextTick()
    assert.equal(entries(view)[0].props.tabindex, 0)
    menu(view).props.onKeydown(key('ArrowDown'))
    await nextTick()
    assert.equal(entries(view)[2].props.tabindex, 0)
    menu(view).props.onKeydown(key('ArrowDown'))
    await nextTick()
    assert.equal(entries(view)[0].props.tabindex, 0)
    menu(view).props.onKeydown(key('End'))
    await nextTick()
    assert.equal(entries(view)[2].props.tabindex, 0)
    menu(view).props.onKeydown(key('Home'))
    menu(view).props.onKeydown(key('b'))
    await nextTick()
    assert.equal(entries(view)[2].props.tabindex, 0)
  } finally { view.unmount() }
})

test('selection emits the original event and closes, while disabled entries block activation', async () => {
  const selected = []
  const view = mount({ onSelect: (item, event) => selected.push([item.id, event]) })
  try {
    trigger(view).props.onKeydown(key('ArrowUp'))
    await nextTick(); await nextTick()
    assert.equal(entries(view)[2].props.tabindex, 0)
    const disabled = new Event('click', {cancelable: true})
    entries(view)[1].props.onClick(disabled)
    assert.equal(disabled.defaultPrevented, true)
    assert.deepEqual(selected, [])
    const click = new Event('click')
    entries(view)[0].props.onClick(click)
    await nextTick()
    assert.deepEqual(selected, [['edit', click]])
    assert.equal(menu(view), undefined)
  } finally { view.unmount() }
})

test('Escape returns to the trigger, prevents bubbling, and disabled triggers cannot open', async () => {
  const view = mount()
  try {
    let focused = false, stopped = false
    trigger(view).focus = () => { focused = true }
    trigger(view).props.onKeydown(key('ArrowDown'))
    await nextTick(); await nextTick()
    menu(view).props.onKeydown({ ...key('Escape'), stopPropagation() { stopped = true } })
    await nextTick()
    assert.equal(stopped, true)
    assert.equal(focused, true)
    assert.equal(menu(view), undefined)
    view.state.value = { ...view.state.value, disabled: true }
    await nextTick()
    trigger(view).props.onKeydown(key('ArrowDown'))
    await nextTick()
    assert.equal(menu(view), undefined)
  } finally { view.unmount() }
})

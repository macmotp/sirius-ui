import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SAccordion } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'
const items = [{ value: 'a', label: 'First', content: 'First content' }, { value: 'b', label: 'Second', content: 'Second content' }, { value: 'c', label: 'Disabled', disabled: true }]
function descendants(node, type) { return [node, ...node.children.flatMap(child => descendants(child, type))].filter(node => node.type === type) }
test('accordion connects unique headings and panels and hides collapsed content', async () => {
  const html = await renderToString(createSSRApp({ render: () => h('div', [h(SAccordion, { items, modelValue: ['a'], headingLevel: 2 }), h(SAccordion, { items })]) }))
  assert.match(html, /<h2/)
  assert.match(html, /aria-expanded="true"/)
  assert.match(html, /First content/)
  assert.doesNotMatch(html, /Second content/)
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, new Set(ids).size)
  for (const [, id] of html.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(ids.includes(id))
})
test('accordion toggles single/multiple state and refuses disabled activation', async () => {
  const updates = []
  const view = mountComponent(SAccordion, { items, modelValue: ['a'], 'onUpdate:modelValue': value => updates.push(value) })
  try {
    const buttons = descendants(view.element, 'button')
    buttons[1].props.onClick()
    assert.deepEqual(updates.pop(), ['b'])
    buttons[2].props.onClick()
    assert.equal(updates.length, 0)
    view.state.value = { ...view.state.value, multiple: true }
    await nextTick()
    buttons[1].props.onClick()
    assert.deepEqual(updates.pop(), ['a', 'b'])
    buttons[0].props.onClick()
    assert.deepEqual(updates.pop(), [])
  } finally { view.unmount() }
})
test('accordion keepAlive preserves closed content while hiding its panel', async () => {
  const html = await renderToString(createSSRApp({ render: () => h(SAccordion, { items, keepAlive: true }) }))
  assert.match(html, /Second content/)
  assert.equal([...html.matchAll(/ hidden/g)].length, 3)
})

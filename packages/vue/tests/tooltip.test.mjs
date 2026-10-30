import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { STooltip } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = node => renderToString(createSSRApp({render: () => node}))
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
function mount(props = {}) { return mountComponent(STooltip, {text:'A helpful description', ...props}, {default: ({trigger}) => h('button', {...trigger, type:'button'}, 'Action')}) }
function button(view) { return nodes(view.element, node => node.type === 'button')[0] }
function tooltip(view) { return nodes(view.element, node => node.props.role === 'tooltip')[0] }

test('tooltips associate unique descriptions with actual trigger buttons and retain external hints', async () => {
  const create = () => h(STooltip, {text:'Create a copy',describedBy:'existing-help'}, {default: ({trigger}) => h('button', trigger, 'Duplicate')})
  const html = await render(h('div', [create(),create()]))
  const ids = [...html.matchAll(/role="tooltip"/g)]
  assert.equal(ids.length,2)
  const described = [...html.matchAll(/<button aria-describedby="existing-help ([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(described).size,2)
  for (const id of described) assert.ok(html.includes(`id="${id}"`))
  assert.match(html, /aria-hidden="true"/)
  assert.match(html, />Duplicate<\/button>/)
})

test('focus opens immediately and Escape dismisses without removing focus or reopening in the same interaction', async () => {
  const view = mount({delay:1000})
  try {
    button(view).props.onFocus()
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],false)
    let prevented = false, stopped = false
    button(view).props.onKeydown({key:'Escape',preventDefault() {prevented = true},stopPropagation() {stopped = true}})
    await nextTick()
    assert.equal(prevented,true)
    assert.equal(stopped,true)
    assert.equal(tooltip(view).props['aria-hidden'],true)
    button(view).props.onFocus()
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],true)
    button(view).props.onBlur()
    button(view).props.onFocus()
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],false)
  } finally { view.unmount() }
})

test('hover delay, pointer transfer, and delayed closure use cancellable timers', async t => {
  t.mock.timers.enable({apis:['setTimeout']})
  const view = mount({delay:300})
  try {
    view.element.props.onPointerenter({pointerType:'mouse'})
    t.mock.timers.tick(299)
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],true)
    t.mock.timers.tick(1)
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],false)
    view.element.props.onPointerleave()
    t.mock.timers.tick(50)
    view.element.props.onPointerenter({pointerType:'mouse'})
    t.mock.timers.tick(100)
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],false)
    view.element.props.onPointerleave()
    t.mock.timers.tick(100)
    await nextTick()
    assert.equal(tooltip(view).props['aria-hidden'],true)
  } finally { view.unmount() }
})

test('disabled tooltips remove only their own association and cancel pending hover', async t => {
  t.mock.timers.enable({apis:['setTimeout']})
  const view = mount({describedBy:'existing-help'})
  try {
    view.element.props.onPointerenter({pointerType:'mouse'})
    view.state.value = {...view.state.value,disabled:true}
    await nextTick()
    t.mock.timers.tick(500)
    button(view).props.onFocus()
    await nextTick()
    assert.equal(button(view).props['aria-describedby'],'existing-help')
    assert.equal(tooltip(view).props['aria-hidden'],true)
  } finally { view.unmount() }
})

test('touch pointer entry does not start the hover timer and unmount cancels pending work', async t => {
  t.mock.timers.enable({apis:['setTimeout']})
  const view = mount()
  view.element.props.onPointerenter({pointerType:'touch'})
  t.mock.timers.tick(500)
  await nextTick()
  assert.equal(tooltip(view).props['aria-hidden'],true)
  view.element.props.onPointerenter({pointerType:'mouse'})
  view.unmount()
  t.mock.timers.tick(500)
  await nextTick()
})

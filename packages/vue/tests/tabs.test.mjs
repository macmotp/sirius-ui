import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, defineComponent, h, nextTick, onMounted, onUnmounted } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { STabs } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const items = [{value:'a',label:'Overview'}, {value:'b',label:'Disabled',disabled:true}, {value:'c',label:'Notes'}]
const render = node => renderToString(createSSRApp({render: () => node}))
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
function tabs(view) { return nodes(view.element, node => node.props.role === 'tab') }
function panels(view) { return nodes(view.element, node => node.props.role === 'tabpanel') }
function mount(props = {}, slots) {
  const view = mountComponent(STabs, { items, ...props }, slots)
  const list = nodes(view.element, node => node.props.role === 'tablist')[0]
  list.querySelector = selector => {
    const index = selector.match(/"(\d+)"/)[1]
    return { focus() { view.focusedIndex = Number(index) } }
  }
  return view
}
function key(value) { return {key:value, preventDefault() {}} }

test('tabs and panels have matching unique IDs, a single entry point, and hidden inactive panels during SSR', async () => {
  const html = await render(h('div', [h(STabs, {items,label:'Workspace'}), h(STabs, {items,label:'Account'})]))
  const allTabs = [...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(([tag]) => tag)
  const allPanels = [...html.matchAll(/<div\b[^>]*role="tabpanel"[^>]*>/g)].map(([tag]) => tag)
  assert.equal(new Set(allTabs.map(tag => tag.match(/id="([^"]+)"/)[1])).size, 6)
  for (let index = 0; index < allTabs.length; index++) {
    const tabId = allTabs[index].match(/id="([^"]+)"/)[1]
    const panelId = allTabs[index].match(/aria-controls="([^"]+)"/)[1]
    assert.ok(allPanels[index].includes(`id="${panelId}"`))
    assert.ok(allPanels[index].includes(`aria-labelledby="${tabId}"`))
  }
  assert.equal(allTabs.filter(tag => tag.includes('tabindex="0"')).length, 2)
  assert.equal(allPanels.filter(tag => /\shidden(?:\s|=|>)/.test(tag)).length, 4)
  assert.match(allTabs[1], /disabled/)
  assert.match(html, /aria-orientation="horizontal"/)
})

test('automatic activation skips disabled tabs, wraps, supports Home/End, and ignores orthogonal arrows', async () => {
  const updates = []
  const view = mount({'onUpdate:modelValue': value => updates.push(value)})
  try {
    tabs(view)[0].props.onKeydown(key('ArrowRight'))
    await nextTick()
    assert.equal(tabs(view)[2].props['aria-selected'], true)
    assert.equal(view.focusedIndex, 2)
    tabs(view)[2].props.onKeydown(key('ArrowRight'))
    await nextTick()
    assert.equal(tabs(view)[0].props['aria-selected'], true)
    tabs(view)[0].props.onKeydown(key('End'))
    await nextTick()
    assert.equal(tabs(view)[2].props['aria-selected'], true)
    tabs(view)[2].props.onKeydown(key('Home'))
    await nextTick()
    tabs(view)[0].props.onKeydown(key('ArrowDown'))
    tabs(view)[1].props.onClick()
    assert.deepEqual(updates, ['c','a','c','a'])
  } finally { view.unmount() }
})

test('manual activation moves the tab stop without selecting until Space or Enter', async () => {
  const view = mount({activation:'manual'})
  try {
    tabs(view)[0].props.onKeydown(key('ArrowRight'))
    await nextTick()
    assert.equal(tabs(view)[0].props['aria-selected'], true)
    assert.equal(tabs(view)[2].props.tabindex, 0)
    assert.equal(panels(view)[0].props.hidden, false)
    tabs(view)[2].props.onKeydown(key(' '))
    await nextTick()
    assert.equal(tabs(view)[2].props['aria-selected'], true)
    tabs(view)[2].props.onKeydown(key('Home'))
    await nextTick()
    tabs(view)[0].props.onKeydown(key('Enter'))
    await nextTick()
    assert.equal(tabs(view)[0].props['aria-selected'], true)
  } finally { view.unmount() }
})

test('vertical tabs respond to up/down, and invalid/disabled selections fall back without rewriting the model', async () => {
  const updates = []
  const view = mount({orientation:'vertical',modelValue:'b','onUpdate:modelValue': value => updates.push(value)})
  try {
    assert.equal(tabs(view)[0].props['aria-selected'], true)
    assert.deepEqual(updates, [])
    tabs(view)[0].props.onKeydown(key('ArrowLeft'))
    assert.deepEqual(updates, [])
    tabs(view)[0].props.onKeydown(key('ArrowUp'))
    await nextTick()
    assert.deepEqual(updates, ['c'])
    // A controlled parent can keep the original selection.
    assert.equal(tabs(view)[0].props['aria-selected'], true)
    view.state.value = {...view.state.value, items:items.map(item => ({...item,disabled:true}))}
    await nextTick()
    assert.ok(tabs(view).every(tab => tab.props.tabindex === -1))
    assert.ok(panels(view).every(panel => panel.props.hidden))
  } finally { view.unmount() }
})

test('keepAlive preserves inactive component state while the default unmounts it', async () => {
  for (const keepAlive of [false,true]) {
    let mounted = 0, unmounted = 0
    const Child = defineComponent({setup() { onMounted(() => mounted++); onUnmounted(() => unmounted++); return () => h('input') }})
    const view = mount({keepAlive}, {panel: ({item}) => item.value === 'a' ? h(Child) : h('p', {}, item.label)})
    try {
      assert.equal(mounted,1)
      tabs(view)[2].props.onClick()
      await nextTick()
      assert.equal(unmounted, keepAlive ? 0 : 1)
      tabs(view)[0].props.onClick()
      await nextTick()
      assert.equal(mounted, keepAlive ? 1 : 2)
    } finally { view.unmount() }
  }
})

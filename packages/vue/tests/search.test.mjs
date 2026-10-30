import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SCombobox, SInput, STagsInput } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = node => renderToString(createSSRApp({ render: () => node }))
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
function mount(Component, props = {}, slots) {
  const view = mountComponent(Component, props, slots)
  for (const node of nodes(view.element, () => true)) {
    node.focus = () => {}
    node.setCustomValidity = message => { node.validityMessage = message }
    node.querySelector = () => null
    node.querySelectorAll = () => []
  }
  return view
}
function editor(view) { return nodes(view.element, node => node.type === 'input' && node.props.type === 'text')[0] }
function key(value, extra = {}) { return { key: value, preventDefault() {}, stopPropagation() {}, ...extra } }
function type(input, value) {
  const event = { target: { value } }
  for (const handler of [input.props.onInput].flat()) handler(event)
}

test('tags serialize committed values with repeated names and keep the editor associated with external hints', async () => {
  const html = await render(h(STagsInput, { modelValue: ['Vue', 'Design'], name: 'tags[]', id: 'tags', form: 'profile', 'aria-describedby': 'help' }))
  assert.equal((html.match(/type="hidden" name="tags\[\]"/g) ?? []).length, 2)
  assert.match(html, /value="Vue"/)
  const input = html.match(/<input\b[^>]*type="text"[^>]*>/)[0]
  assert.match(input, /id="tags"/)
  assert.match(input, /aria-describedby="help /)
  assert.doesNotMatch(input, /name="tags/)
  assert.match(html, /aria-label="Remove Vue"/)
  const readonly = await render(h(STagsInput, { modelValue: ['Vue'], readonly: true }))
  assert.doesNotMatch(readonly, /<button/)
})

test('tags trim additions, reject case-insensitive duplicates, honor limits, and ignore IME Enter', async () => {
  const updates = []
  const view = mount(STagsInput, { modelValue: ['Vue'], maxTags: 2, 'onUpdate:modelValue': value => updates.push(value) })
  try {
    const input = editor(view)
    type(input, ' Design ')
    input.props.onKeydown(key('Enter', { isComposing: true }))
    assert.equal(updates.length, 0)
    input.props.onKeydown(key('Enter'))
    assert.deepEqual(updates, [['Vue', 'Design']])
    view.state.value = { ...view.state.value, modelValue: ['Vue', 'Design'] }
    await nextTick()
    type(input, 'vue')
    input.props.onKeydown(key(','))
    type(input, 'Extra')
    input.props.onKeydown(key('Enter'))
    assert.equal(updates.length, 1)
  } finally { view.unmount() }
})

test('tags handle delimited paste and remove values without submitting a form', async () => {
  const updates = []
  const view = mount(STagsInput, { modelValue: ['Vue'], 'onUpdate:modelValue': value => updates.push(value) })
  try {
    let prevented = false
    editor(view).props.onPaste({ clipboardData: { getData: () => 'Design, vue\nComponents' }, preventDefault() { prevented = true } })
    assert.equal(prevented, true)
    assert.deepEqual(updates[0], ['Vue', 'Design', 'Components'])
    const button = nodes(view.element, node => node.type === 'button')[0]
    assert.equal(button.props.type, 'button')
    await button.props.onClick()
    assert.deepEqual(updates[1], [])
  } finally { view.unmount() }
})

const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta', disabled: true }, { value: 'c', label: 'Camera', keywords: ['photo'] }]

test('combobox exposes native input associations, selected labels, listbox semantics, and value serialization', async () => {
  const html = await render(h(SCombobox, { options, modelValue: 'a', id: 'icon', name: 'icon', 'aria-label': 'Icon', clearable: true }, { option: ({ option }) => h('strong', {}, option.label) }))
  const input = html.match(/<input\b[^>]*role="combobox"[^>]*>/)[0]
  assert.match(input, /id="icon"/)
  assert.match(input, /value="Alpha"/)
  assert.match(input, /aria-expanded="false"/)
  assert.match(input, /aria-controls="[^"]+-listbox"/)
  assert.match(html, /type="hidden" name="icon" value="a"/)
  assert.match(html, /role="listbox"/)
  assert.match(html, /<strong>Camera<\/strong>/)
  assert.match(html, /aria-disabled="true"/)
})

test('combobox filters keywords, selects with Enter, skips disabled options, and clears the stored value', async () => {
  const updates = []
  const view = mount(SCombobox, { options, modelValue: '', clearable: true, 'onUpdate:modelValue': value => updates.push(value) })
  try {
    const input = editor(view)
    input.props.onKeydown(key('ArrowDown'))
    await nextTick()
    input.props.onKeydown(key('ArrowDown'))
    input.props.onKeydown(key('Enter'))
    assert.deepEqual(updates, ['c'])
    view.state.value = { ...view.state.value, modelValue: 'c' }
    await nextTick()
    type(input, 'photo')
    await nextTick()
    assert.equal(nodes(view.element, node => node.props.role === 'option').length, 1)
    input.props.onKeydown(key('Enter'))
    assert.equal(updates.at(-1), 'c')
    await nextTick()
    nodes(view.element, node => node.type === 'button')[0].props.onClick()
    assert.equal(updates.at(-1), '')
  } finally { view.unmount() }
})

test('combobox Escape cancels search without clearing selection; disabled and readonly controls cannot select', async () => {
  const view = mount(SCombobox, { options, modelValue: 'a' })
  try {
    const input = editor(view)
    type(input, 'does not exist')
    await nextTick()
    assert.equal(nodes(view.element, node => node.props.role === 'option').length, 0)
    let stopped = false
    input.props.onKeydown(key('Escape', { stopPropagation() { stopped = true } }))
    await nextTick()
    assert.equal(stopped, true)
    assert.equal(input.props.value, 'Alpha')
    assert.equal(input.props['aria-expanded'], false)
  } finally { view.unmount() }
  for (const state of [{ disabled: true }, { readonly: true }]) {
    const updates = []
    const blocked = mount(SCombobox, { options, ...state, 'onUpdate:modelValue': value => updates.push(value) })
    try {
      editor(blocked).props.onKeydown(key('ArrowDown'))
      editor(blocked).props.onKeydown(key('Enter'))
      assert.deepEqual(updates, [])
    } finally { blocked.unmount() }
  }
})

test('range progress honors min/max, clamps values, and does not use the filled input wrapper', async () => {
  const html = await render(h(SInput, { type: 'range', min: 20, max: 60, modelValue: '30' }))
  assert.match(html, /--sirius-range-progress:25%/)
  assert.match(html, /sirius-range/)
  assert.doesNotMatch(html, /bg-control|shadow-xs/)
  const clamped = await render(h(SInput, { type: 'range', min: 20, max: 60, modelValue: '90' }))
  assert.match(clamped, /--sirius-range-progress:100%/)
})

test('combobox arrow toggles the listbox and respects disabled and readonly states', async () => {
  const view = mount(SCombobox, { options })
  try {
    const arrow = nodes(view.element, node => node.type === 'button' && node.props['aria-haspopup'] === 'listbox')[0]
    assert.equal(arrow.props.type, 'button')
    arrow.props.onClick()
    await nextTick()
    assert.equal(editor(view).props['aria-expanded'], true)
    arrow.props.onClick()
    await nextTick()
    assert.equal(editor(view).props['aria-expanded'], false)
    for (const state of [{ disabled: true }, { readonly: true }]) {
      view.state.value = { ...view.state.value, disabled: false, readonly: false, ...state }
      await nextTick()
      arrow.props.onClick()
      await nextTick()
      assert.equal(editor(view).props['aria-expanded'], false)
    }
  } finally { view.unmount() }
})


test('range fill updates when only the native bounds change', async () => {
  const view = mount(SInput, { type: 'range', modelValue: '30', min: 20, max: 60 })
  try {
    const input = nodes(view.element, node => node.type === 'input')[0]
    assert.equal(input.props.style['--sirius-range-progress'], '25%')
    view.state.value = { ...view.state.value, min: 0 }
    await nextTick()
    assert.equal(input.props.style['--sirius-range-progress'], '50%')
    assert.doesNotMatch(view.element.props.class, /focus-within:ring|ring-1/)
  } finally { view.unmount() }
})

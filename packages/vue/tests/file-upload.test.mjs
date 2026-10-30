import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SField, SFileUpload } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
const find = (view, predicate) => nodes(view.element, predicate)[0]
const file = (name, size = 10, type = 'image/png') => new File([new Uint8Array(size)], name, { type, lastModified: 1 })
const input = view => find(view, node => node.type === 'input')
async function choose(view, files) { input(view).props.onChange({ target: { files } }); await nextTick() }

test('native file controls retain field labels, errors, descriptions and form attributes', async () => {
  const html = await renderToString(createSSRApp({ render: () => h(SField, { id: 'attachments', label: 'Attachments', description: 'PDF only', error: 'Server rejected file', required: true }, { default: ({ control }) => h(SFileUpload, { ...control, label: 'Add attachments', name: 'attachments[]', multiple: true, class: 'layout-only' }) }) }))
  const native = html.match(/<input[^>]+>/)[0]
  assert.match(native, /id="attachments"/)
  assert.match(native, /name="attachments\[\]"/)
  assert.match(native, /aria-invalid="true"/)
  assert.match(native, /aria-required="true"/)
  assert.match(native, /aria-describedby="[^"]*attachments-description[^"]*attachments-error[^"]*"/)
  assert.doesNotMatch(native, /layout-only/)
  assert.match(html, /<label for="attachments"/)
})
test('selection appends accepted files and reports type, size, count and duplicates individually', async () => {
  let selected = [], rejected = []
  const view = mountComponent(SFileUpload, { label: 'Attachments', multiple: true, accept: '.png', maxSize: 20, maxFiles: 2, 'onUpdate:modelValue': value => { selected = value }, onReject: value => { rejected = value } })
  try {
    const a = file('a.PNG'), b = file('b.png')
    await choose(view, [a])
    await choose(view, [a, file('bad.pdf'), file('large.png', 21), b, file('extra.png')])
    assert.deepEqual(selected.map(file => file.name), ['a.PNG', 'b.png'])
    assert.deepEqual(rejected.map(item => item.reason), ['duplicate', 'type', 'size', 'count'])
    assert.equal(find(view, node => node.props.role === 'status').text.includes('4 file(s) not added'), true)
  } finally { view.unmount() }
})
test('single selection replaces only on success and removal returns focus to the picker', async () => {
  let selected = []
  const view = mountComponent(SFileUpload, { label: 'Photo', accept: 'image/*', 'onUpdate:modelValue': value => { selected = value } })
  try {
    await choose(view, [file('first.png')])
    await choose(view, [file('rejected.txt', 10, 'text/plain')])
    assert.equal(selected[0].name, 'first.png')
    await choose(view, [file('replacement.png')])
    assert.equal(selected[0].name, 'replacement.png')
    let focused = false
    input(view).focus = () => { focused = true }
    await find(view, node => node.type === 'button').props.onClick()
    assert.deepEqual(selected, [])
    assert.equal(focused, true)
  } finally { view.unmount() }
})
test('dropping files uses the same limits and disabled pickers block all selection changes', async () => {
  let selected = []
  const view = mountComponent(SFileUpload, { label: 'Files', multiple: true, maxFiles: 1, 'onUpdate:modelValue': value => { selected = value } })
  const zone = () => find(view, node => node.props.onDrop)
  try {
    let prevented = false
    zone().props.onDrop({ dataTransfer: { types: ['Files'], files: [file('one.png'), file('two.png')] }, preventDefault() { prevented = true } })
    await nextTick()
    assert.equal(prevented, true)
    assert.equal(selected.length, 1)
    view.state.value = { ...view.state.value, disabled: true }
    await nextTick()
    await choose(view, [file('three.png')])
    zone().props.onDrop({ dataTransfer: { types: ['Files'], files: [file('four.png')] }, preventDefault() {} })
    await nextTick()
    find(view, node => node.type === 'button').props.onClick()
    await nextTick()
    assert.equal(selected[0].name, 'one.png')
    assert.equal(input(view).props.disabled, true)
  } finally { view.unmount() }
})

test('controlled models announce the new selection count before the parent renders it', async () => {
  let selected
  const view = mountComponent(SFileUpload, { label: 'Files', modelValue: [], 'onUpdate:modelValue': value => { selected = value } })
  try {
    await choose(view, [file('selected.png')])
    assert.equal(selected.length, 1)
    assert.equal(find(view, node => node.props.role === 'status').text, '1 file(s) selected.')
  } finally { view.unmount() }
})

test('native file serialization and required validity follow dropped, removed and externally cleared models', async () => {
  const original = globalThis.DataTransfer
  globalThis.DataTransfer = class {
    files = []
    items = { add: file => { this.files.push(file) } }
  }
  const view = mountComponent(SFileUpload, { label: 'Files', multiple: true, required: true })
  try {
    let validity = ''
    input(view).setCustomValidity = value => { validity = value }
    input(view).focus = () => {}
    await choose(view, [file('one.png'), file('two.png')])
    assert.equal(input(view).files.length, 2)
    assert.equal(validity, '')
    await find(view, node => node.type === 'button').props.onClick()
    assert.deepEqual(input(view).files.map(item => item.name), ['two.png'])
    view.state.value = { ...view.state.value, modelValue: [] }
    await nextTick()
    assert.deepEqual(input(view).files, [])
    assert.equal(validity, 'Please choose a file.')
  } finally {
    view.unmount()
    if (original === undefined) delete globalThis.DataTransfer
    else globalThis.DataTransfer = original
  }
})

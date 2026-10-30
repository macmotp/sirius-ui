import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SCheckbox, SRadio, SSwitch } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = (vnode) => renderToString(createSSRApp({ render: () => vnode }))
function find(node, type) {
  return node.type === type ? node : node.children.map((child) => find(child, type)).find(Boolean)
}
function changed(checked) {
  const event = new Event('change', { cancelable: true })
  Object.defineProperty(event, 'target', { value: { checked } })
  return event
}
function attr(tag, name) {
  return tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1]
}

test('choice labels and descriptions target unique native inputs and merge external descriptions', async () => {
  const html = await render(h('div', [
    h(SCheckbox, { label: 'Email', description: 'Your inbox', error: 'Check this choice', required: true, 'aria-describedby': 'external-help' }),
    h(SSwitch, { label: 'Notifications' }),
  ]))
  const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map(([tag]) => tag)
  const labels = [...html.matchAll(/<label\b[^>]*>/g)].map(([tag]) => tag)
  const id = attr(inputs[0], 'id')
  assert.ok(id)
  assert.equal(attr(labels[0], 'for'), id)
  assert.equal(attr(inputs[0], 'aria-describedby'), `external-help ${id}-description ${id}-error`)
  assert.equal(attr(inputs[0], 'aria-invalid'), 'true')
  assert.match(inputs[0], /\srequired(?:\s|>|=)/)
  assert.notEqual(id, attr(inputs[1], 'id'))
  assert.equal(attr(inputs[1], 'role'), 'switch')
  assert.equal(attr(inputs[1], 'aria-checked'), 'false')
})

test('checkbox updates its boolean model, clears controlled indeterminate state, and forwards change once', async () => {
  const values = [], mixed = [], changes = []
  const view = mountComponent(SCheckbox, { modelValue: false, indeterminate: true, 'onUpdate:modelValue': (value) => values.push(value), 'onUpdate:indeterminate': (value) => mixed.push(value), onChange: (event) => changes.push(event) })
  try {
    const input = find(view.element, 'input')
    assert.equal(input.props.type, 'checkbox')
    assert.equal(input.props['.indeterminate'], true)
    assert.equal(input.props['aria-checked'], 'mixed')
    const event = changed(true)
    input.props.onChange(event)
    assert.deepEqual(values, [true])
    assert.deepEqual(mixed, [false])
    assert.deepEqual(changes, [event])
    view.state.value = { modelValue: true, indeterminate: false }
    await nextTick()
    assert.equal(find(view.element, 'input').props.checked, true)
    assert.equal(find(view.element, 'input').props['.indeterminate'], false)
  } finally { view.unmount() }
})

test('radios retain native grouping and values, and update only when checked', () => {
  const values = []
  const view = mountComponent(SRadio, { name: 'delivery', value: 'express', modelValue: 'standard', 'onUpdate:modelValue': (value) => values.push(value) })
  try {
    const input = find(view.element, 'input')
    assert.equal(input.props.type, 'radio')
    assert.equal(input.props.name, 'delivery')
    assert.equal(input.props.value, 'express')
    assert.equal(input.props.checked, false)
    input.props.onChange(changed(false))
    assert.deepEqual(values, [])
    input.props.onChange(changed(true))
    assert.deepEqual(values, ['express'])
  } finally { view.unmount() }
})

test('switch uses a form-capable native checkbox with switch semantics and a boolean model', () => {
  const values = []
  const view = mountComponent(SSwitch, { id: 'notify', name: 'notifications', value: 'enabled', form: 'settings', modelValue: true, 'aria-label': 'Notifications', class: 'app-layout', 'onUpdate:modelValue': (value) => values.push(value) })
  try {
    const input = find(view.element, 'input')
    assert.equal(input.props.type, 'checkbox')
    assert.equal(input.props.role, 'switch')
    assert.equal(input.props['aria-checked'], true)
    assert.equal(input.props.name, 'notifications')
    assert.equal(input.props.value, 'enabled')
    assert.equal(input.props.form, 'settings')
    assert.equal(input.props.id, 'notify')
    assert.equal(input.props['aria-label'], 'Notifications')
    assert.ok(view.element.props.class.includes('app-layout'))
    assert.ok(!input.props.class.includes('app-layout'))
    input.props.onChange(changed(false))
    assert.deepEqual(values, [false])
  } finally { view.unmount() }
})

test('disabled choices suppress model changes and change events, including synthetic dispatch', () => {
  for (const Component of [SCheckbox, SRadio, SSwitch]) {
    const values = [], changes = []
    const view = mountComponent(Component, { disabled: true, name: 'choice', value: 'yes', 'onUpdate:modelValue': (value) => values.push(value), onChange: (event) => changes.push(event) })
    try {
      const input = find(view.element, 'input')
      assert.equal(input.props.disabled, true)
      const event = changed(true)
      input.props.onChange(event)
      assert.equal(event.defaultPrevented, true)
      assert.deepEqual(values, [])
      assert.deepEqual(changes, [])
    } finally { view.unmount() }
  }
})

test('choice validation rings retain priority when checked, including aria-invalid and error messages', async () => {
  for (const Component of [SCheckbox, SRadio, SSwitch]) {
    const props = { name: 'choice', value: 'yes', modelValue: Component === SRadio ? 'yes' : true, valid: true }
    const valid = await render(h(Component, props))
    assert.ok(valid.includes('checked:ring-control-valid'))
    for (const invalid of [{ invalid: true }, { error: 'Check this choice' }, { 'aria-invalid': true }]) {
      const html = await render(h(Component, { ...props, ...invalid }))
      assert.ok(html.includes('checked:ring-control-invalid'))
      assert.ok(!html.includes('checked:ring-control-valid'))
      assert.ok(html.includes('aria-invalid="true"'))
    }
  }
})


test('unselected radios do not receive checkbox indeterminate fill styles', async () => {
  const html = await render(h(SRadio, { name: 'empty-group', value: 'first', label: 'First' }))
  assert.doesNotMatch(html, /indeterminate:bg-primary/)
  assert.doesNotMatch(html, /indeterminate:ring-primary/)
  assert.doesNotMatch(html.match(/<input\b[^>]*>/)[0], /\schecked(?:\s|>|=)/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { SInput } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

function input(view) {
  return view.element.children.find((node) => node.type === 'input')
}

function event(value, extra = {}) {
  return { target: { value }, ...extra }
}

test('number inputs emit native strings, preserve decimals, and clear to an empty string', () => {
  const values = []
  const events = []
  const view = mountComponent(SInput, { type: 'number', modelValue: '1.00', min: '0', max: '100', step: '0.01', 'onUpdate:modelValue': (value) => values.push(value), onInput: (event) => events.push(event) })
  try {
    const el = input(view)
    assert.equal(el.props.type, 'number')
    assert.equal(el.props.value, '1.00')
    assert.equal(el.props.min, '0')
    assert.equal(el.props.max, '100')
    assert.equal(el.props.step, '0.01')
    const changed = event('12.30')
    el.props.onInput(changed)
    el.props.onInput(event(''))
    assert.deepEqual(values, ['12.30', ''])
    assert.equal(events[0], changed)
  } finally { view.unmount() }
})

test('native picker change commits synchronize the string model and forward the original event', () => {
  const cases = { date: '2026-10-28', time: '09:30', 'datetime-local': '2026-10-28T09:30', month: '2026-10', week: '2026-W44', color: '#22c55e', range: '75' }
  for (const [type, value] of Object.entries(cases)) {
    const values = []
    const changes = []
    const view = mountComponent(SInput, { type, modelValue: '', 'onUpdate:modelValue': (value) => values.push(value), onChange: (event) => changes.push(event) })
    try {
      const changed = event(value)
      input(view).props.onChange(changed)
      assert.deepEqual(values, [value], type)
      assert.deepEqual(changes, [changed], type)
    } finally { view.unmount() }
  }
})

test('text composition defers model updates until commit and recovers on change', () => {
  const values = []
  const view = mountComponent(SInput, { modelValue: '', 'onUpdate:modelValue': (value) => values.push(value) })
  try {
    const el = input(view)
    el.props.onCompositionstart()
    el.props.onInput(event('に', { isComposing: true }))
    assert.deepEqual(values, [])
    el.props.onCompositionend(event('日本'))
    assert.deepEqual(values, ['日本'])
    el.props.onCompositionstart()
    el.props.onInput(event('語', { isComposing: true }))
    el.props.onChange(event('日本語'))
    assert.deepEqual(values, ['日本', '日本語'])
    el.props.onInput(event('ready'))
    assert.equal(values.at(-1), 'ready')
  } finally { view.unmount() }
})

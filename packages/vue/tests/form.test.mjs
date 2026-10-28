import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SField, SForm, SInput, SSelect, STextarea } from '../dist/index.js'

const render = (component) => renderToString(createSSRApp({ render: () => component }))

function attribute(tag, name) {
  return tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1]
}

test('fields link labels, hints, and errors to their input through scoped control attributes', async () => {
  const html = await render(h(SField, { label: 'Email', description: 'Work address', error: 'Check this address', required: true }, {
    default: ({ control }) => h(SInput, { ...control, type: 'email', name: 'email', modelValue: 'hello@example.com' }),
  }))
  const label = html.match(/<label\b[^>]*>/)[0]
  const input = html.match(/<input\b[^>]*>/)[0]
  const id = attribute(input, 'id')
  assert.ok(id)
  assert.equal(attribute(label, 'for'), id)
  assert.equal(attribute(input, 'aria-describedby'), `${id}-description ${id}-error`)
  assert.equal(attribute(input, 'aria-invalid'), 'true')
  assert.match(input, /\srequired(?:\s|>|=)/)
  assert.ok(html.includes(`id="${id}-description"`))
  assert.ok(html.includes(`id="${id}-error"`))
  assert.ok(html.includes('ring-control-invalid'))
})

test('generated field IDs are unique and fields work with native controls', async () => {
  const field = (props) => h(SField, props, { default: ({ control }) => h('input', control) })
  const html = await render(h('div', [field({ label: 'First' }), field({ label: 'Second' }), field({ id: 'custom', label: 'Third' })]))
  const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map(([tag]) => tag)
  const ids = inputs.map((tag) => attribute(tag, 'id'))
  assert.equal(new Set(ids).size, 3)
  assert.equal(ids[2], 'custom')
  assert.equal(attribute(inputs[0], 'aria-describedby'), undefined)
  assert.equal(attribute(inputs[0], 'aria-invalid'), undefined)
})

test('SInput forwards native attributes to the input and layout classes to its wrapper', async () => {
  const html = await render(h(SInput, {
    id: 'account', name: 'account', form: 'profile', autocomplete: 'username', placeholder: 'Account',
    modelValue: 'demo', readonly: true, disabled: true, invalid: true,
    'aria-describedby': 'account-help', class: 'custom-layout', size: 'lg',
  }))
  const wrapper = html.match(/<div\b[^>]*>/)[0]
  const input = html.match(/<input\b[^>]*>/)[0]
  assert.ok(wrapper.includes('custom-layout'))
  assert.equal(attribute(wrapper, 'id'), undefined)
  assert.equal(attribute(input, 'id'), 'account')
  assert.equal(attribute(input, 'name'), 'account')
  assert.equal(attribute(input, 'form'), 'profile')
  assert.equal(attribute(input, 'autocomplete'), 'username')
  assert.equal(attribute(input, 'value'), 'demo')
  assert.equal(attribute(input, 'aria-describedby'), 'account-help')
  assert.equal(attribute(input, 'aria-invalid'), 'true')
  assert.match(input, /\sreadonly(?:\s|>|=)/)
  assert.match(input, /\sdisabled(?:\s|>|=)/)
  assert.ok(!input.includes('custom-layout'))
  assert.equal(attribute(input, 'size'), undefined)
})

test('SForm retains native form attributes, responsive layout, and full-width actions', async () => {
  const html = await render(h(SForm, { columns: 4, method: 'post', action: '/profile', 'aria-label': 'Profile' }, {
    default: () => h(SField, { label: 'Name', fullWidth: true }, { default: ({ control }) => h('input', control) }),
    actions: () => h('button', { type: 'submit' }, 'Save'),
  }))
  const form = html.match(/<form\b[^>]*>/)[0]
  assert.equal(attribute(form, 'method'), 'post')
  assert.equal(attribute(form, 'action'), '/profile')
  assert.equal(attribute(form, 'aria-label'), 'Profile')
  assert.ok(form.includes('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'))
  assert.ok(html.includes('col-span-full'))
  assert.match(html, /<button type="submit">Save<\/button>/)
})


test('valid input highlights use success colors while invalid states retain priority', async () => {
  const valid = await render(h(SInput, { valid: true }))
  assert.ok(valid.includes('ring-control-valid'))
  assert.ok(valid.includes('focus-within:ring-control-valid'))
  assert.equal(attribute(valid.match(/<input\b[^>]*>/)[0], 'aria-invalid'), undefined)
  assert.equal(attribute(valid.match(/<input\b[^>]*>/)[0], 'valid'), undefined)
  for (const invalid of [{ invalid: true }, { 'aria-invalid': true }, { 'aria-invalid': 'spelling' }]) {
    const html = await render(h(SInput, { valid: true, ...invalid }))
    assert.ok(html.includes('ring-control-invalid'))
    assert.ok(!html.includes('ring-control-valid'))
  }
})


test('textarea retains multiline values, constraints, native states, and field associations', async () => {
  const html = await render(h(SField, { id: 'notes', label: 'Notes', description: 'Team notes', error: 'Too long', required: true }, {
    default: ({ control }) => h(STextarea, { ...control, modelValue: 'First line\nSecond <line>', name: 'notes', form: 'profile', rows: 5, maxlength: 200, readonly: true, resize: 'none' }),
  }))
  const textarea = html.match(/<textarea\b[^>]*>/)[0]
  assert.equal(attribute(textarea, 'id'), 'notes')
  assert.equal(attribute(textarea, 'name'), 'notes')
  assert.equal(attribute(textarea, 'form'), 'profile')
  assert.equal(attribute(textarea, 'rows'), '5')
  assert.equal(attribute(textarea, 'maxlength'), '200')
  assert.equal(attribute(textarea, 'aria-describedby'), 'notes-description notes-error')
  assert.equal(attribute(textarea, 'aria-invalid'), 'true')
  assert.match(textarea, /\srequired(?:\s|>|=)/)
  assert.match(textarea, /\sreadonly(?:\s|>|=)/)
  assert.ok(html.includes('First line\nSecond &lt;line&gt;'))
  assert.ok(textarea.includes('resize-none'))
  assert.equal(attribute(textarea, 'resize'), undefined)
})

test('select preserves the selected option during SSR and forwards control attributes', async () => {
  const html = await render(h(SField, { id: 'team', label: 'Team', description: 'Choose your team', required: true }, {
    default: ({ control }) => h(SSelect, {
      ...control, modelValue: 'engineering', name: 'team', form: 'profile', class: 'custom-select', placeholder: 'Choose a team',
      options: [{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }, { value: 'archived', label: 'Archived', disabled: true }],
    }),
  }))
  const wrapper = html.match(/<div class="relative[^>]*>/)[0]
  const select = html.match(/<select\b[^>]*>/)[0]
  assert.ok(wrapper.includes('custom-select'))
  assert.equal(attribute(select, 'id'), 'team')
  assert.equal(attribute(select, 'name'), 'team')
  assert.equal(attribute(select, 'form'), 'profile')
  assert.equal(attribute(select, 'aria-describedby'), 'team-description')
  assert.match(select, /\srequired(?:\s|>|=)/)
  assert.ok(!select.includes('custom-select'))
  const options = [...html.matchAll(/<option\b[^>]*>[^<]*<\/option>/g)].map(([option]) => option)
  assert.equal(options.length, 4)
  assert.match(options[0], /disabled/)
  assert.ok(options[0].includes('Choose a team'))
  assert.equal(options.filter((option) => /\sselected(?:\s|>|=)/.test(option)).length, 1)
  assert.match(options[2], /selected/)
  assert.match(options[3], /disabled/)
  assert.ok(html.includes('pointer-events-none'))
  assert.ok(html.includes('aria-hidden="true"'))
})

test('empty select models show a disabled placeholder and never enable multiple selection', async () => {
  const html = await render(h(SSelect, { multiple: true, disabled: true, options: [{ value: 'a', label: 'A' }] }))
  const select = html.match(/<select\b[^>]*>/)[0]
  const placeholder = html.match(/<option\b[^>]*>/)[0]
  assert.match(select, /\sdisabled(?:\s|>|=)/)
  assert.doesNotMatch(select, /\smultiple(?:\s|>|=)/)
  assert.match(placeholder, /selected/)
  assert.match(placeholder, /disabled/)
  assert.ok(html.includes('Select an option'))
})

test('all three controls share neutral, valid, and invalid ring behavior', async () => {
  for (const Component of [SInput, STextarea, SSelect]) {
    const neutral = await render(h(Component))
    for (const utility of ['bg-control', 'shadow-xs', 'ring-1', 'ring-inset', 'ring-control-line', 'focus-within:ring-control-focus']) assert.ok(neutral.includes(utility))
    const valid = await render(h(Component, { valid: true }))
    assert.ok(valid.includes('ring-control-valid'))
    for (const invalid of [{ invalid: true }, { 'aria-invalid': 'true' }]) {
      const html = await render(h(Component, { valid: true, ...invalid }))
      assert.ok(html.includes('ring-control-invalid'))
      assert.ok(!html.includes('ring-control-valid'))
      assert.ok(html.includes('aria-invalid="true"'))
    }
  }
})

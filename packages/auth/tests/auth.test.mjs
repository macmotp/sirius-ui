import assert from 'node:assert/strict'
import test from 'node:test'
import { h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import {
  SAuthLayout, SLoginForm, SRegisterForm, SForgotPasswordForm,
  SResetPasswordForm, SConfirmPasswordForm, STwoFactorForm, SEmailVerification,
} from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'

function nodes(node, match) {
  return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))]
}
const find = (view, match) => nodes(view.element, match)[0]
const input = (view, name) => find(view, node => node.type === 'input' && node.props.name === name)
const submit = view => find(view, node => node.type === 'form').props.onSubmit({ preventDefault() {} })

test('auth layout and field errors retain unique heading and description associations', async () => {
  const html = await renderToString(h('div', [
    h(SAuthLayout, { title: 'Sign in', variant: 'split' }, {
      default: () => h(SLoginForm, {
        modelValue: { email: '', password: '', remember: false },
        errors: { email: 'Check this email.' },
      }),
    }),
    h(SAuthLayout, { title: 'Register' }),
  ]))
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const [, id] of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)) {
    for (const value of id.split(' ')) assert.ok(ids.includes(value), value)
  }
  assert.match(html, /aria-invalid="true"/)
  assert.match(html, /Check this email\./)
  assert.equal((html.match(/<h1 /g) ?? []).length, 2)
})

test('login replaces its controlled model, reveals passwords, and blocks submissions while processing', async () => {
  const original = Object.freeze({ email: 'alex@acme.example', password: 'sample-secret', remember: false })
  const models = []
  const submissions = []
  const view = mountComponent(SLoginForm, {
    modelValue: original,
    'onUpdate:modelValue': value => models.push(value),
    onSubmit: value => submissions.push(value),
  })
  try {
    input(view, 'email').props.onInput({ target: { value: 'jamie@acme.example' } })
    assert.deepEqual(models[0], { ...original, email: 'jamie@acme.example' })
    assert.equal(original.email, 'alex@acme.example')
    assert.equal(input(view, 'password').props.autocomplete, 'current-password')
    find(view, node => node.props['aria-label'] === 'Show password').props.onClick()
    await nextTick()
    assert.equal(input(view, 'password').props.type, 'text')
    assert.equal(input(view, 'password').props.value, original.password)
    submit(view)
    assert.deepEqual(submissions, [original])
    assert.notEqual(submissions[0], original)
    view.state.value = { ...view.state.value, processing: true }
    await nextTick()
    assert.equal(find(view, node => node.type === 'fieldset').props.disabled, true)
    submit(view)
    assert.equal(submissions.length, 1)
  } finally { view.unmount() }
})

test('register, reset, forgot and confirm forms submit snapshots with native autocomplete contracts', () => {
  const cases = [
    [SRegisterForm, { name: 'Alex', email: 'alex@acme.example', password: 'secret', passwordConfirmation: 'secret' }, 'new-password'],
    [SResetPasswordForm, { email: 'alex@acme.example', password: 'secret', passwordConfirmation: 'secret' }, 'new-password'],
    [SForgotPasswordForm, { email: 'alex@acme.example' }],
    [SConfirmPasswordForm, { password: 'secret' }, 'current-password'],
  ]
  for (const [Component, modelValue, autocomplete] of cases) {
    const submissions = []
    const view = mountComponent(Component, { modelValue, onSubmit: value => submissions.push(value) })
    try {
      submit(view)
      assert.deepEqual(submissions, [modelValue])
      assert.notEqual(submissions[0], modelValue)
      if (autocomplete) assert.equal(input(view, 'password').props.autocomplete, autocomplete)
      if ('passwordConfirmation' in modelValue) assert.equal(input(view, 'password_confirmation').props.autocomplete, 'new-password')
    } finally { view.unmount() }
  }
})

test('two-factor entry preserves leading zeroes and recovery submissions include only the active credential', async () => {
  const submissions = []
  const view = mountComponent(STwoFactorForm, {
    modelValue: { code: '012345', recoveryCode: 'unused' },
    'onUpdate:modelValue': value => { view.state.value = { ...view.state.value, modelValue: value } },
    onSubmit: value => submissions.push(value),
  })
  try {
    assert.equal(input(view, 'code').props.type, 'text')
    assert.equal(input(view, 'code').props.pattern, '[0-9]{6}')
    assert.equal(input(view, 'code').props.autocomplete, 'one-time-code')
    submit(view)
    assert.deepEqual(submissions[0], { mode: 'code', code: '012345' })
    find(view, node => node.type === 'button' && node.props.type === 'button').props.onClick({ preventDefault() {}, stopPropagation() {} })
    await nextTick()
    assert.equal(input(view, 'code'), undefined)
    assert.deepEqual(view.state.value.modelValue, { code: '', recoveryCode: '' })
    input(view, 'recovery_code').props.onInput({ target: { value: 'saved-recovery-code' } })
    await nextTick()
    submit(view)
    assert.deepEqual(submissions[1], { mode: 'recovery', recoveryCode: 'saved-recovery-code' })
  } finally { view.unmount() }
})

test('email verification suppresses resend while disabled and sign-out while processing', async () => {
  let resends = 0
  let signOuts = 0
  const view = mountComponent(SEmailVerification, {
    resendDisabled: true,
    onResend: () => resends++,
    onSignOut: () => signOuts++,
  })
  try {
    submit(view)
    assert.equal(resends, 0)
    view.state.value = { ...view.state.value, resendDisabled: false }
    await nextTick()
    submit(view)
    assert.equal(resends, 1)
    view.state.value = { ...view.state.value, processing: true }
    await nextTick()
    submit(view)
    find(view, node => node.type === 'button' && node.props.type === 'button').props.onClick({ preventDefault() {}, stopPropagation() {} })
    assert.equal(resends, 1)
    assert.equal(signOuts, 0)
  } finally { view.unmount() }
})

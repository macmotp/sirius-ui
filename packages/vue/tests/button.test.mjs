import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createRenderer, defineComponent, h, nextTick, shallowRef } from 'vue'
import { SButton } from '../dist/index.js'

// Exercise the real built component through Vue's renderer without a browser DOM.
function element(type, text = '') {
  return { type, text, props: {}, children: [], parent: null }
}

const renderer = createRenderer({
  createElement: (type) => element(type),
  createText: (text) => element('#text', text),
  createComment: (text) => element('#comment', text),
  setText: (node, text) => { node.text = text },
  setElementText: (node, text) => { node.text = text; node.children = [] },
  parentNode: (node) => node.parent,
  nextSibling: (node) => node.parent?.children[node.parent.children.indexOf(node) + 1] ?? null,
  patchProp: (node, key, previous, value) => { node.props[key] = value },
  insert(node, parent, anchor = null) {
    if (node.parent) node.parent.children.splice(node.parent.children.indexOf(node), 1)
    const index = anchor ? parent.children.indexOf(anchor) : parent.children.length
    parent.children.splice(index, 0, node)
    node.parent = parent
  },
  remove(node) {
    node.parent?.children.splice(node.parent.children.indexOf(node), 1)
    node.parent = null
  },
})

function mount(props = {}, slots = { default: () => 'Save changes' }) {
  const root = element('root')
  const state = shallowRef(props)
  const app = renderer.createApp({ render: () => h(SButton, state.value, slots) })
  app.mount(root)
  return { get button() { return root.children[0] }, state, unmount: () => app.unmount() }
}

function text(node) {
  return (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')
}

function find(node, predicate) {
  return predicate(node) ? node : node.children.map((child) => find(child, predicate)).find(Boolean)
}

test('defaults to a non-submitting native button and forwards attributes and click exactly once', () => {
  const received = []
  const view = mount({ id: 'save', name: 'action', value: 'save', 'aria-describedby': 'help', class: 'custom-button', onClick: (event) => received.push(event) })
  try {
    assert.equal(view.button.type, 'button')
    assert.equal(view.button.props.type, 'button')
    assert.equal(view.button.props.disabled, false)
    assert.equal(view.button.props['aria-busy'], undefined)
    assert.equal(view.button.props.id, 'save')
    assert.equal(view.button.props.name, 'action')
    assert.equal(view.button.props.value, 'save')
    assert.equal(view.button.props['aria-describedby'], 'help')
    assert.ok(view.button.props.class.includes('custom-button'))
    const event = new Event('click', { cancelable: true })
    view.button.props.onClick(event)
    assert.deepEqual(received, [event])
    assert.equal(event.defaultPrevented, false)
  } finally { view.unmount() }
})

test('submit and reset types remain explicit and can be updated', async () => {
  const view = mount({ type: 'submit', form: 'settings' })
  try {
    assert.equal(view.button.props.type, 'submit')
    assert.equal(view.button.props.form, 'settings')
    view.state.value = { type: 'reset', form: 'settings' }
    await nextTick()
    assert.equal(view.button.props.type, 'reset')
  } finally { view.unmount() }
})

test('loading preserves the label, replaces the leading icon, and blocks activation until ready', async () => {
  let clicks = 0
  const onClick = () => { clicks++ }
  const view = mount({ loading: true, onClick }, {
    default: () => 'Save changes',
    leading: () => h('svg', { 'data-icon': 'leading' }),
    trailing: () => h('svg', { 'data-icon': 'trailing' }),
  })
  try {
    assert.equal(view.button.props.disabled, true)
    assert.equal(view.button.props['aria-busy'], true)
    assert.equal(text(view.button), 'Save changes')
    assert.equal(find(view.button, (node) => node.props['data-icon'] === 'leading'), undefined)
    assert.ok(find(view.button, (node) => node.type === 'svg' && node.props.class?.includes('motion-safe:animate-spin')))
    assert.ok(find(view.button, (node) => node.props['data-icon'] === 'trailing'))
    const blocked = new Event('click', { cancelable: true })
    view.button.props.onClick(blocked)
    assert.equal(clicks, 0)
    assert.equal(blocked.defaultPrevented, true)

    view.state.value = { loading: false, onClick }
    await nextTick()
    assert.equal(view.button.props.disabled, false)
    assert.equal(view.button.props['aria-busy'], undefined)
    const leading = find(view.button, (node) => node.props['data-icon'] === 'leading')
    assert.ok(leading)
    assert.equal(leading.parent.props['aria-hidden'], 'true')
    view.button.props.onClick(new Event('click'))
    assert.equal(clicks, 1)

    view.state.value = { disabled: true, onClick }
    await nextTick()
    assert.equal(view.button.props.disabled, true)
    view.button.props.onClick(new Event('click'))
    assert.equal(clicks, 1)
  } finally { view.unmount() }
})

test('the built CSS export includes component utilities and tokens without Preflight', async () => {
  const css = await readFile(new URL('../dist/style.css', import.meta.url), 'utf8')
  assert.ok(css.includes('--sirius-primary'))
  assert.ok(css.includes('.rounded-control'))
  assert.ok(css.includes('.text-danger-content'))
  assert.ok(css.includes('.text-on-solid'))
  assert.doesNotMatch(css, /@(?:import|theme|source|utility)\b/)
  assert.doesNotMatch(css, /box-sizing:border-box/)
})

test('all solid button colors use the shared white-label token', () => {
  for (const color of ['primary', 'success', 'warning', 'danger']) {
    const view = mount({ color, variant: 'solid' })
    try {
      assert.ok(view.button.props.class.includes('text-on-solid'))
      assert.ok(view.button.props.class.includes(`bg-${color}`))
    } finally { view.unmount() }
  }
})


test('href renders a native anchor with download attributes and native link semantics', () => {
  const received = []
  const view = mount({ href: '/exports/users.csv', download: 'users.csv', target: '_blank', rel: 'noopener', onClick: (event) => received.push(event) })
  try {
    assert.equal(view.button.type, 'a')
    assert.equal(view.button.props.href, '/exports/users.csv')
    assert.equal(view.button.props.download, 'users.csv')
    assert.equal(view.button.props.target, '_blank')
    assert.equal(view.button.props.rel, 'noopener')
    assert.equal(view.button.props.type, undefined)
    assert.equal(view.button.props.disabled, undefined)
    assert.equal(view.button.props.role, undefined)
    const event = new Event('click', { cancelable: true })
    view.button.props.onClick(event)
    assert.equal(event.defaultPrevented, false)
    assert.deepEqual(received, [event])
  } finally { view.unmount() }
})

test('custom link components receive navigation props and slots, and are unmounted while blocked', async () => {
  let visits = 0
  const clicks = []
  const Link = defineComponent({
    inheritAttrs: false,
    props: ['href', 'preserveScroll'],
    setup(props, { attrs, slots }) {
      return () => h('a', { ...attrs, href: props.href, 'data-preserve-scroll': props.preserveScroll, onClick: [attrs.onClick, () => { visits++ }] }, slots.default?.())
    },
  })
  const view = mount({ as: Link, href: '/users', preserveScroll: true, class: 'app-link', onClick: (event) => clicks.push(event) })
  try {
    assert.equal(view.button.type, 'a')
    assert.equal(view.button.props.href, '/users')
    assert.equal(view.button.props['data-preserve-scroll'], true)
    assert.ok(view.button.props.class.includes('app-link'))
    assert.equal(text(view.button), 'Save changes')
    for (const listener of view.button.props.onClick) listener(new Event('click'))
    assert.equal(visits, 1)
    assert.equal(clicks.length, 1)
    view.state.value = { as: Link, href: '/users', loading: true }
    await nextTick()
    assert.equal(view.button.type, 'span')
    assert.equal(view.button.props.href, undefined)
    assert.equal(view.button.props['aria-disabled'], true)
    assert.equal(view.button.props['aria-busy'], true)
    assert.equal(view.button.props.tabindex, -1)
    const event = new Event('click', { cancelable: true })
    view.button.props.onClick(event)
    assert.equal(event.defaultPrevented, true)
    assert.equal(visits, 1)
    view.state.value = { as: Link, href: '/users' }
    await nextTick()
    assert.equal(view.button.type, 'a')
    assert.equal(view.button.props.href, '/users')
  } finally { view.unmount() }
})

test('disabled native links remove their destination and restore their attributes when enabled', async () => {
  const view = mount({ as: 'a', href: '/exports', disabled: true, tabindex: 0 })
  try {
    assert.equal(view.button.type, 'span')
    assert.equal(view.button.props.href, undefined)
    assert.equal(view.button.props.role, 'link')
    assert.equal(view.button.props.tabindex, -1)
    assert.equal(view.button.props['aria-disabled'], true)
    view.state.value = { as: 'a', href: '/exports', tabindex: 0 }
    await nextTick()
    assert.equal(view.button.type, 'a')
    assert.equal(view.button.props.href, '/exports')
    assert.equal(view.button.props.tabindex, 0)
    assert.equal(view.button.props['aria-disabled'], undefined)
  } finally { view.unmount() }
})

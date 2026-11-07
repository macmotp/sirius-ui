import { createRenderer, h, markRaw, shallowRef } from 'vue'

// Exercise the real built component through Vue's renderer without a browser DOM.
function element(type, text = '') {
  // Native DOM nodes are not reactive proxies; give mock nodes the same identity.
  const node = markRaw({ type, text, props: {}, style: {}, children: [], parent: null })
  if (type === 'input') node.setCustomValidity = message => { node.validationMessage = message }
  // Vue's native select v-model directive uses these DOM APIs. Keep them local
  // to select/option nodes so composition tests can exercise the actual directive.
  if (type === 'option') Object.defineProperties(node, {
    value: { get: () => node.props.value ?? node.text },
    selected: { get: () => Boolean(node.props.selected), set: value => { node.props.selected = value } },
  })
  if (type === 'select' || type === 'textarea') {
    node.listeners = {}
    node.addEventListener = (event, handler) => { node.listeners[event] = handler }
  }
  if (type === 'select') {
    Object.defineProperties(node, {
      options: { get: () => node.children.filter(child => child.type === 'option') },
      multiple: { get: () => Boolean(node.props.multiple) },
      selectedIndex: {
        get: () => node.options.findIndex(option => option.selected),
        set: index => node.options.forEach((option, position) => { option.selected = index === position }),
      },
      value: {
        get: () => node.options[node.selectedIndex]?.value ?? '',
        set: value => { node.selectedIndex = node.options.findIndex(option => option.value === value) },
      },
    })
  }
  return node
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

export function mountComponent(Component, props = {}, slots) {
  const root = element('root')
  const state = shallowRef(props)
  const app = renderer.createApp({ render: () => h(Component, state.value, slots) })
  app.mount(root)
  return { get element() { return root.children[0] }, state, unmount: () => app.unmount() }
}

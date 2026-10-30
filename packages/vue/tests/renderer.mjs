import { createRenderer, h, markRaw, shallowRef } from 'vue'

// Exercise the real built component through Vue's renderer without a browser DOM.
function element(type, text = '') {
  // Native DOM nodes are not reactive proxies; give mock nodes the same identity.
  return markRaw({ type, text, props: {}, style: {}, children: [], parent: null })
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

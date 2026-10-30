import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SAvatar } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

const render = node => renderToString(createSSRApp({render: () => node}))
function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
function text(node) { return node.text + node.children.map(text).join('') }

test('avatar initials derive from the first and last names, with explicit overrides and a full accessible name', async () => {
  const named = await render(h(SAvatar,{name:'  Alex Marie Morgan  '}))
  assert.match(named,/aria-label="Alex Marie Morgan"/)
  assert.match(named,/>AM<\/span>/)
  const single = await render(h(SAvatar,{name:'Taylor'}))
  assert.match(single,/>T<\/span>/)
  const override = await render(h(SAvatar,{name:'Design workspace',initials:'su',shape:'rounded'}))
  assert.match(override,/>SU<\/span>/)
  assert.match(override,/rounded-2xl/)
})

test('decorative avatars hide all visual content while meaningful avatars expose a single accessible image', async () => {
  const decorative = await render(h(SAvatar,{src:'/avatar.jpg',name:'Alex',alt:''}))
  assert.match(decorative,/<span aria-hidden="true"/)
  assert.doesNotMatch(decorative,/role="img"|aria-label=/)
  const named = await render(h(SAvatar,{src:'/avatar.jpg',alt:'Workspace owner'}))
  assert.match(named,/role="img" aria-label="Workspace owner"/)
  assert.match(named,/<img[^>]*alt(?:="")? aria-hidden="true"/)
})

test('image load/error events switch fallback state and a changed source retries the image', async () => {
  const loads = [], errors = []
  const view = mountComponent(SAvatar,{src:'/first.jpg',name:'Alex Morgan',onLoad:event => loads.push(event),onError:event => errors.push(event)})
  try {
    let img = nodes(view.element,node => node.type === 'img')[0]
    assert.match(img.props.class,/opacity-0/)
    assert.match(text(view.element),/AM/)
    const load = new Event('load')
    img.props.onLoad(load)
    await nextTick()
    assert.match(img.props.class,/opacity-100/)
    assert.doesNotMatch(text(view.element),/AM/)
    assert.deepEqual(loads,[load])
    const error = new Event('error')
    img.props.onError(error)
    await nextTick()
    assert.equal(nodes(view.element,node => node.type === 'img').length,0)
    assert.match(text(view.element),/AM/)
    assert.deepEqual(errors,[error])
    view.state.value = {...view.state.value,src:'/second.jpg'}
    await nextTick()
    img = nodes(view.element,node => node.type === 'img')[0]
    assert.equal(img.props.src,'/second.jpg')
    assert.match(img.props.class,/opacity-0/)
  } finally { view.unmount() }
})

test('custom fallback content is decorative and keeps the supplied accessible name', async () => {
  const html = await render(h(SAvatar,{name:'Workspace',class:'app-layout'}, {fallback:({initials}) => h('strong',{},initials)}))
  assert.match(html,/aria-label="Workspace"/)
  assert.match(html,/app-layout/)
  assert.match(html,/<strong>W<\/strong>/)
  assert.match(html,/aria-hidden="true" class="contents"/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SBadge, SCard, SGrid } from '../dist/index.js'

const render = (node) => renderToString(createSSRApp({ render: () => node }))

test('grid preserves attributes and child order while exposing the six-column responsive layout', async () => {
  const html = await render(h(SGrid, { columns: 6, id: 'summary', 'aria-label': 'Summary' }, {
    default: () => [h(SCard, {}, () => 'First'), h(SCard, {}, () => 'Second')],
  }))
  assert.match(html, /id="summary"/)
  assert.match(html, /aria-label="Summary"/)
  assert.match(html, /grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6/)
  assert.ok(html.indexOf('First') < html.indexOf('Second'))
  assert.doesNotMatch(html, /columns="/)
})

test('cards compose optional content slots and preserve corner selection on the ring overlay', async () => {
  const html = await render(h(SCard, { bento: ['top-left', 'bottom-right'], 'aria-labelledby': 'card-title' }, {
    header: () => h('h2', { id: 'card-title' }, 'Title'),
    default: () => h('p', {}, 'Body'),
    footer: () => h('button', {}, 'Action'),
  }))
  assert.match(html, /rounded-tl-4xl/)
  assert.match(html, /rounded-br-4xl/)
  assert.doesNotMatch(html, /rounded-tr-4xl|rounded-bl-4xl|bento="/)
  assert.match(html, /after:rounded-\[inherit\]/)
  assert.match(html, /after:pointer-events-none/)
  assert.ok(html.indexOf('Title') < html.indexOf('Body'))
  assert.ok(html.indexOf('Body') < html.indexOf('Action'))
  const bodyOnly = await render(h(SCard, { bento: 'top-right' }, () => 'Content'))
  assert.match(bodyOnly, /rounded-tr-4xl/)
  assert.doesNotMatch(bodyOnly, /px-6 pt-6|px-6 pb-6/)
})

test('badges retain their visible label while hiding decorative icons and keeping passive semantics', async () => {
  const html = await render(h(SBadge, { color: 'success', variant: 'solid', 'data-status': 'published' }, {
    leading: () => h('svg', {}, h('path')),
    default: () => 'Published',
    trailing: () => h('svg', {}, h('path')),
  }))
  assert.match(html, /text-on-success/)
  assert.match(html, /data-status="published"/)
  assert.equal((html.match(/aria-hidden="true"/g) ?? []).length, 2)
  assert.match(html.replace(/<!--[\s\S]*?-->/g, ''), />Published<\/span>/)
  assert.doesNotMatch(html, /<button|tabindex|role="button"|color="success"|variant="solid"/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SProgress } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'
const render = props => renderToString(createSSRApp({ render: () => h(SProgress, { label: 'Uploading files', ...props }) }))
function nodes(node, test) { return [...(test(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, test))] }

test('determinate progress exposes actual units and an optional value description', async () => {
  const html = await render({ value: 3, max: 8, showValue: true, valueText: '3 of 8 files uploaded' })
  assert.match(html, /role="progressbar" aria-label="Uploading files" aria-valuemin="0" aria-valuemax="8" aria-valuenow="3" aria-valuetext="3 of 8 files uploaded"/)
  assert.match(html, /width:37.5%/)
  assert.match(html, /38%/)
})
test('unknown progress omits aria-valuenow instead of reporting zero', async () => {
  for (const value of [undefined, null, NaN, Infinity]) {
    const html = await render({ value, showValue: true })
    assert.doesNotMatch(html, /aria-valuenow|width:/)
    assert.match(html, /sirius-progress-indeterminate/)
    assert.match(html, /Loading…/)
  }
})
test('progress clamps finite values and normalizes unusable maxima', async () => {
  assert.match(await render({ value: -20 }), /aria-valuenow="0"/)
  assert.match(await render({ value: 200 }), /aria-valuenow="100"/)
  for (const max of [0, -1, NaN, Infinity]) {
    const html = await render({ value: 50, max })
    assert.match(html, /aria-valuemax="100" aria-valuenow="50"/)
    assert.match(html, /width:50%/)
  }
})
test('wrapper layout attributes and progress descriptions reach their intended elements', async () => {
  const html = await render({ value: 0, showLabel: false, class: 'custom-layout', style: { maxWidth: '200px' }, id: 'upload-progress', 'aria-describedby': 'upload-hint' })
  assert.match(html, /^<div[^>]*class="custom-layout [^"]*"[^>]*style="max-width:200px;"/)
  const bar = html.match(/<div[^>]*role="progressbar"[^>]*>/)[0]
  assert.match(bar, /id="upload-progress"/)
  assert.match(bar, /aria-describedby="upload-hint"/)
  assert.doesNotMatch(bar, /custom-layout|max-width/)
  assert.doesNotMatch(html, /<span/)
})
test('reactive values transition between unknown and complete without internal job state', async () => {
  const view = mountComponent(SProgress, { label: 'Export', value: null })
  try {
    const bar = () => nodes(view.element, node => node.props.role === 'progressbar')[0]
    assert.equal(bar().props['aria-valuenow'], undefined)
    view.state.value = { label: 'Export', value: 5, max: 10 }
    await nextTick()
    assert.equal(bar().props['aria-valuenow'], 5)
    assert.equal(bar().children[0].props.style.width, '50%')
    view.state.value = { label: 'Export', value: 10, max: 10 }
    await nextTick()
    assert.equal(bar().props['aria-valuenow'], 10)
  } finally { view.unmount() }
})

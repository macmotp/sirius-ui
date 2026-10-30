import assert from 'node:assert/strict'
import test from 'node:test'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SDivider, SEmptyState, SSkeleton } from '../dist/index.js'

const render = node => renderToString(createSSRApp({render: () => node}))

test('skeletons are decorative and accept numeric/CSS dimensions without claiming loading-region semantics', async () => {
  const html = await render(h(SSkeleton,{shape:'circle',width:48,height:'3rem',animated:false,'data-placeholder':'avatar'}))
  assert.match(html,/aria-hidden="true"/)
  assert.match(html,/width:48px;height:3rem/)
  assert.match(html,/data-placeholder="avatar"/)
  assert.doesNotMatch(html,/role="|aria-busy|animate-pulse|shape="|animated=/)
})

test('skeleton animation opts into motion-safe behavior and uses sensible shape dimensions', async () => {
  const html = await render(h(SSkeleton,{shape:'rounded'}))
  assert.match(html,/motion-safe:animate-pulse/)
  assert.match(html,/width:100%/)
  assert.match(html,/height:calc\(var\(--sirius-spacing\) \* 24\)/)
})

test('dividers use native horizontal semantics and uniquely associated labels, including custom content', async () => {
  const plain = await render(h(SDivider))
  assert.match(plain,/^<hr\b/)
  const decorative = await render(h(SDivider,{orientation:'vertical',decorative:true}))
  assert.match(decorative,/role="separator" aria-orientation="vertical"/)
  assert.match(decorative,/aria-hidden="true"/)
  const html = await render(h('div',[
    h(SDivider,{label:'Workspace'}),
    h(SDivider,{}, {default:() => h('strong',{},'Continue')}),
  ]))
  const ids = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size,2)
  for (const id of ids) assert.ok(html.includes(`id="${id}"`))
  assert.match(html,/<strong>Continue<\/strong>/)
})

test('empty states preserve heading hierarchy and action semantics while hiding decorative icons', async () => {
  const html = await render(h(SEmptyState,{title:'Fallback title',description:'Fallback description',headingLevel:2}, {
    title:() => 'No projects', description:() => 'Create your first project.',
    icon:() => h('svg',{'data-custom-icon':'true'}),
    actions:() => [h('button',{type:'button'},'Create project'),h('a',{href:'/help'},'Learn more')],
  }))
  assert.match(html,/<h2[^>]*>/)
  assert.match(html,/No projects/)
  assert.doesNotMatch(html,/Fallback title|Fallback description|role="alert"|role="status"/)
  assert.match(html,/aria-hidden="true"/)
  assert.match(html,/data-custom-icon="true"/)
  assert.match(html,/<button type="button">Create project<\/button>/)
  assert.match(html,/<a href="\/help">Learn more<\/a>/)
  const noIcon = await render(h(SEmptyState,{title:'Caught up',icon:false}))
  assert.doesNotMatch(noIcon,/<svg/)
})

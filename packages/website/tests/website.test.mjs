import assert from 'node:assert/strict'
import test from 'node:test'
import { h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { SWebsiteLayout, SArticleCard, SWebsiteHeader, SWebsiteHero, SWebsiteSection, SWebsiteFooter, SProjectCard, SWebsiteFeatures, SWebsiteCta, SWebsiteNewsletter, SWebsiteStats, SWebsiteTestimonials, SWebsiteBlog, SWebsiteContact, SWebsiteTeam } from '../dist/index.js'
import { mountComponent } from '../../vue/tests/renderer.mjs'
import { loadDemo } from '../../dashboard/tests/demo-loader.mjs'

function nodes(node, match) {
  return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))]
}
const find = (view, match) => nodes(view.element.parent ?? view.element, match)[0]
const text = node => (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('')
const click = (extra = {}) => ({ button: 0, preventDefault() { this.defaultPrevented = true }, ...extra })

test('website landmarks, headings and skip links have unique associations', async () => {
  const page = () => h(SWebsiteLayout, {}, {
    default: () => [h(SWebsiteHero, { title: 'Thoughtfully made' }), h(SWebsiteSection, { title: 'Our work' })],
    footer: () => h(SWebsiteFooter, { groups: [{ id: 'explore', label: 'Explore', items: [{ id: 'home', label: 'Home', href: '/' }] }] }),
  })
  const html = await renderToString(h('div', [page(), page()]))
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, new Set(ids).size)
  for (const [, id] of html.matchAll(/aria-labelledby="([^"]+)"/g)) assert.ok(ids.includes(id))
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target))
  assert.equal((html.match(/<main /g) ?? []).length, 2)
  assert.equal((html.match(/<h1 /g) ?? []).length, 2)
})

test('mobile navigation preserves modified clicks and focuses content after a route closes it', async () => {
  const selected = []
  const previousDocument = globalThis.document
  const focused = []
  globalThis.document = { getElementById: id => ({ focus: options => focused.push({ id, options }) }) }
  const items = [{ id: 'home', label: 'Home', href: '#home' }, { id: 'projects', label: 'Projects', href: '#projects' }]
  const view = mountComponent(SWebsiteHeader, { items, current: 'home', contentId: 'content', navigationKey: 'home', onSelect: (item, event) => selected.push({ item, event }) })
  try {
    const dialog = find(view, node => node.type === 'dialog')
    dialog.open = false
    dialog.showModal = () => { dialog.open = true }
    dialog.close = () => { dialog.open = false }
    const trigger = find(view, node => node.props['aria-label'] === 'Open navigation')
    trigger.props.onClick(click())
    await nextTick()
    const link = nodes(dialog, node => node.type === 'a' && node.props.href === '#projects')[0]
    const modified = click({ ctrlKey: true })
    link.props.onClick(modified)
    await nextTick()
    assert.equal(trigger.props['aria-expanded'], true)
    assert.equal(selected[0].event, modified)
    assert.equal(modified.defaultPrevented, undefined)
    view.state.value = { ...view.state.value, navigationKey: 'projects', current: 'projects' }
    await nextTick()
    assert.equal(trigger.props['aria-expanded'], false)
    dialog.props.onAnimationend({ target: dialog, animationName: 'sirius-dialog-out' })
    dialog.open = false
    dialog.props.onClose({ target: dialog })
    await nextTick()
    assert.deepEqual(focused, [{ id: 'content', options: { preventScroll: true } }])
  } finally {
    view.unmount()
    if (previousDocument === undefined) delete globalThis.document
    else globalThis.document = previousDocument
  }
})

test('project cards render escaped titles, native destinations and image descriptions', async () => {
  const html = await renderToString(h(SProjectCard, { title: '<Fieldwork>', href: '/projects/fieldwork', imageSrc: '/fieldwork.svg', imageAlt: 'Fieldwork identity study' }))
  assert.match(html, /href="\/projects\/fieldwork"/)
  assert.match(html, /&lt;Fieldwork&gt;/)
  assert.match(html, /alt="Fieldwork identity study"/)
  assert.match(html, /loading="lazy"/)
  assert.equal((html.match(/<a /g) ?? []).length, 1)
})

test('project filters show the matching records and keep native detail links', async () => {
  const demo = await loadDemo('website')
  const Projects = await demo.component('pages/StudioProjects.vue')
  const view = mountComponent(Projects)
  try {
    const button = label => find(view, node => node.type === 'button' && text(node).trim() === label)
    button('Brand').props.onClick(click())
    await nextTick()
    assert.equal(nodes(view.element.parent, node => node.type === 'article').length, 2)
    assert.match(text(find(view, node => node.props.role === 'status')), /2 projects · Brand/)
    assert.ok(find(view, node => node.type === 'a' && node.props.href === '#projects/northline'))
    assert.equal(find(view, node => node.type === 'a' && node.props.href === '#projects/orbit'), undefined)
    button('All work').props.onClick(click())
    await nextTick()
    assert.equal(nodes(view.element.parent, node => node.type === 'article').length, 4)
  } finally { view.unmount(); await demo.close() }
})

test('every studio page supplies one page heading and each project detail uses its own data', async () => {
  const demo = await loadDemo('website')
  try {
    for (const name of ['StudioHome', 'StudioAbout', 'StudioProjects', 'StudioContact', 'StudioServiceIndex', 'StudioPricing', 'StudioFaq', 'StudioJournal', 'StudioSections']) {
      const Component = await demo.component(`pages/${name}.vue`)
      const html = await renderToString(h(Component))
      assert.equal((html.match(/<h1 /g) ?? []).length, 1, name)
      assert.match(html, /id="studio-page-title"/)
      if (name === 'StudioSections') {
        assert.match(html, /Acme mobile workspace concept/)
        assert.match(html, /With an angled image/)
        assert.match(html, /alt="An airy creative workspace/)
        assert.match(html, /Meet your new pocket workspace/)
        assert.match(html, /Photo by Patrik Michalicka/)
      }
    }
    const Detail = await demo.component('pages/StudioProjectDetail.vue')
    const { projects } = await demo.module('data.ts')
    for (const project of projects) {
      const html = await renderToString(h(Detail, { project }))
      assert.equal((html.match(/<h1 /g) ?? []).length, 1)
      assert.ok(html.includes(project.tagline))
      assert.ok(html.includes(project.artLabel))
    }
  } finally { await demo.close() }
})

test('pricing switches both monthly equivalents and annual totals while retaining the project option', async () => {
  const demo = await loadDemo('website')
  const Pricing = await demo.component('pages/StudioPricing.vue')
  const view = mountComponent(Pricing)
  try {
    const card = title => nodes(view.element.parent, node => node.type === 'article').find(node => nodes(node, child => child.type === 'h3' && text(child) === title).length)
    const button = label => find(view, node => node.type === 'button' && text(node).trim() === label)
    assert.match(text(card('Essentials')), /1,200/)
    button('Yearly · 2 months included').props.onClick(click())
    await nextTick()
    assert.match(text(card('Essentials')), /1,000.*12,000 billed yearly/)
    assert.match(text(card('Studio partner')), /2,000.*24,000 billed yearly/)
    assert.match(text(card('A focused project')), /Let’s talk/)
    assert.match(text(find(view, node => node.props.role === 'status')), /paid upfront/)
    button('Monthly').props.onClick(click())
    await nextTick()
    assert.match(text(card('Essentials')), /1,200/)
    assert.doesNotMatch(text(card('Essentials')), /12,000 billed yearly/)
  } finally { view.unmount(); await demo.close() }
})

test('FAQ search includes answer text, combines topic filters, and restores results after clearing', async () => {
  const demo = await loadDemo('website')
  const Faq = await demo.component('pages/StudioFaq.vue')
  const view = mountComponent(Faq)
  try {
    const search = find(view, node => node.type === 'input')
    let focusCount = 0
    search.focus = () => focusCount++
    for (const node of nodes(view.element.parent, node => node.type === 'div')) node.querySelector = () => search
    search.props.onInput({ target: { value: '  UPFRONT  ' } })
    await nextTick()
    assert.match(text(find(view, node => node.props.role === 'status')), /1 question found/)
    assert.ok(find(view, node => node.type === 'button' && text(node).includes('How does annual billing work?')))
    find(view, node => node.type === 'button' && text(node).trim() === 'Projects & delivery').props.onClick(click())
    await nextTick()
    assert.match(text(find(view, node => node.props.role === 'status')), /0 questions found/)
    find(view, node => node.type === 'button' && text(node).trim() === 'Clear search and filters').props.onClick(click())
    await nextTick()
    await nextTick()
    assert.match(text(find(view, node => node.props.role === 'status')), /9 questions found/)
    assert.equal(focusCount, 1)
  } finally { view.unmount(); await demo.close() }
})

test('service and article routes resolve their own records and support article section links', async () => {
  const demo = await loadDemo('website')
  try {
    const { resolveDestination } = await demo.module('routes.ts')
    const { services } = await demo.module('data.ts')
    const { articles } = await demo.module('content.ts')
    const Service = await demo.component('pages/StudioServiceDetail.vue')
    for (const service of services) {
      const route = resolveDestination(`services/${service.id}`)
      assert.equal(route.service.id, service.id)
      const html = await renderToString(h(Service, { service: route.service }))
      assert.equal((html.match(/<h1 /g) ?? []).length, 1)
      assert.ok(html.includes(`#projects/${service.projectId}`))
    }
    const Article = await demo.component('pages/StudioArticle.vue')
    for (const article of articles) {
      const destination = `journal/${article.id}/${article.sections[0].id}`
      const route = resolveDestination(destination)
      assert.equal(route.article.id, article.id)
      assert.equal(route.anchor, destination)
      const html = await renderToString(h(Article, { article: route.article }))
      assert.equal((html.match(/<h1 /g) ?? []).length, 1)
      assert.ok(html.includes(`href="#${destination}"`))
      assert.ok(html.includes(`id="${destination}"`))
    }
    assert.equal(resolveDestination('services/unknown').page, 'services')
    assert.equal(resolveDestination('journal/unknown').page, 'journal')
    assert.equal(resolveDestination(`journal/${articles[0].id}/unknown`).anchor, undefined)
  } finally { await demo.close() }
})

test('article figures retain captions and code blocks copy their original text as plain text', async t => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  const writes = []
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async value => writes.push(value) } } })
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'navigator', previous)
    else delete globalThis.navigator
  })
  const demo = await loadDemo('website')
  try {
    const Article = await demo.component('pages/StudioArticle.vue')
    const { articles } = await demo.module('content.ts')
    for (const article of articles) {
      const html = await renderToString(h(Article, { article }))
      for (const section of article.sections) {
        if (section.figure) {
          assert.ok(html.includes(section.figure.src))
          assert.ok(html.includes(section.figure.caption))
          assert.ok(html.includes(section.figure.creditHref))
        }
        if (section.code) assert.ok(html.includes(`Code example: ${section.code.title}`))
      }
    }
    const Block = await demo.component('components/StudioCodeBlock.vue')
    const source = 'const html = "<script>plain text</script>"\n  return html\n'
    const code = { title: 'Example', language: 'JavaScript', text: source }
    const view = mountComponent(Block, { code })
    try {
      assert.equal(text(find(view, node => node.type === 'pre')), source)
      assert.equal(find(view, node => node.type === 'script'), undefined)
      find(view, node => node.type === 'button').props.onClick(click())
      await Promise.resolve()
      await nextTick()
      assert.deepEqual(writes, [source])
    } finally { view.unmount() }
  } finally { await demo.close() }
})


test('feature variants preserve heading associations, scoped icons, and contextual native links', async () => {
  const features = [
    { id: 'share', title: '<Share safely>', description: 'A clear & useful handover.', href: '/sharing' },
    { id: 'review', title: 'Review together', description: 'Keep decisions close.' },
  ]
  const panels = ['small-icons', 'large-icons', 'grid', 'image'].map(variant => h(SWebsiteFeatures, {
    title: 'A better workflow', headingLevel: 4, features, variant,
  }, {
    icon: ({ feature }) => h('svg', { 'data-feature': feature.id, viewBox: '0 0 20 20' }),
    ...(variant === 'image' ? { media: () => h('img', { src: '/workspace.png', alt: 'Workspace preview' }) } : {}),
  }))
  const html = await renderToString(h('div', panels))
  const ids = [...html.matchAll(/<h4 id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, 4)
  assert.equal(new Set(ids).size, 4)
  for (const id of ids) assert.ok(html.includes(`aria-labelledby="${id}"`))
  assert.equal((html.match(/href="\/sharing"/g) ?? []).length, 4)
  assert.equal((html.match(/<a /g) ?? []).length, 4)
  assert.equal((html.match(/data-feature="review"/g) ?? []).length, 4)
  assert.match(html, /&lt;Share safely&gt;/)
  assert.match(html, /class="sr-only">: &lt;Share safely&gt;/)
  assert.match(html, /alt="Workspace preview"/)
  const defaultHtml = await renderToString(h(SWebsiteFeatures, { title: 'Defaults', features: [] }))
  assert.match(defaultHtml, /<h2 /)
})


test('CTA variants retain their heading semantics, native actions, and optional media', async () => {
  const panels = ['banner', 'simple', 'centered', 'gradient', 'image'].map(variant => h(SWebsiteCta, {
    title: '<Let’s talk>', headingLevel: 4, description: 'Your next step.', variant,
  }, {
    actions: () => h('a', { href: '/contact' }, 'Get in touch'),
    ...(variant === 'image' ? { media: () => h('img', { src: '/studio.jpg', alt: 'Acme studio desk' }) } : {}),
  }))
  const html = await renderToString(h('div', panels))
  const ids = [...html.matchAll(/<h4 id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, 5)
  assert.equal(new Set(ids).size, 5)
  for (const id of ids) assert.ok(html.includes(`aria-labelledby="${id}"`))
  assert.equal((html.match(/href="\/contact"/g) ?? []).length, 5)
  assert.match(html, /&lt;Let’s talk&gt;/)
  assert.match(html, /alt="Acme studio desk"/)
  const defaultHtml = await renderToString(h(SWebsiteCta, { title: 'Original banner' }))
  assert.match(defaultHtml, /<h2 /)
  assert.match(defaultHtml, /bg-primary-soft/)
  assert.equal((defaultHtml.match(/<a /g) ?? []).length, 0)
  const noMedia = await renderToString(h(SWebsiteCta, { title: 'An invitation', variant: 'image' }))
  assert.match(noMedia, /An invitation/)
  assert.doesNotMatch(noMedia, /<img/)
})


test('newsletter sections associate unique email labels, errors, and heading landmarks', async () => {
  const html = await renderToString(h('div', ['details', 'simple'].map(variant => h(SWebsiteNewsletter, {
    modelValue: '', title: 'Stay in the loop', variant, headingLevel: 4, error: 'Please try another email.', status: 'Ready when you are.',
    details: [{ id: 'notes', title: 'Studio notes', description: 'Occasional inspiration.' }],
  }, { icon: () => h('svg', { viewBox: '0 0 20 20' }) }))))
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  const labels = [...html.matchAll(/<label for="([^"]+)"/g)].map(match => match[1])
  assert.equal(labels.length, 2)
  for (const id of labels) assert.ok(html.includes(`id="${id}"`))
  for (const [, id] of html.matchAll(/aria-describedby="([^"]+)"/g)) assert.ok(ids.includes(id))
  assert.equal((html.match(/type="email"/g) ?? []).length, 2)
  assert.equal((html.match(/autocomplete="email"/g) ?? []).length, 2)
  assert.equal((html.match(/role="alert"/g) ?? []).length, 2)
  assert.equal((html.match(/role="status"/g) ?? []).length, 2)
  assert.equal((html.match(/<dt /g) ?? []).length, 1)
})

test('newsletter submits trimmed email and blocks processing, disabled, and empty submissions', async () => {
  const submissions = []
  const view = mountComponent(SWebsiteNewsletter, { modelValue: '  alex@acme.example  ', title: 'Stay in touch', onSubmit: email => submissions.push(email) })
  try {
    const submit = () => find(view, node => node.type === 'form').props.onSubmit({ preventDefault() {} })
    submit()
    assert.deepEqual(submissions, ['alex@acme.example'])
    for (const state of [{ processing: true }, { processing: false, disabled: true }, { disabled: false, modelValue: '   ' }]) {
      view.state.value = { ...view.state.value, ...state }
      await nextTick()
      submit()
    }
    assert.equal(submissions.length, 1)
  } finally { view.unmount() }
})


test('stats variants preserve formatted values, definition pairs, and unique heading associations', async () => {
  const stats = [
    { id: 1, label: '<Partner teams>', value: '1.234,50 €' },
    { id: 'zero', label: 'Unresolved reviews', value: '0' },
  ]
  const html = await renderToString(h('div', ['simple', 'image', 'description'].map(variant => h(SWebsiteStats, {
    title: 'Our story', headingLevel: 4, description: 'A shared direction.', variant, stats,
  }, {
    ...(variant === 'image' ? { media: () => h('img', { src: '/studio.jpg', alt: 'Acme workspace' }) } : {}),
    ...(variant === 'description' ? { default: () => h('p', 'More of the story.') } : {}),
  }))))
  const ids = [...html.matchAll(/<h4 id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, 3)
  assert.equal(new Set(ids).size, 3)
  for (const id of ids) assert.ok(html.includes(`aria-labelledby="${id}"`))
  assert.equal((html.match(/<dt /g) ?? []).length, 6)
  assert.equal((html.match(/<dd /g) ?? []).length, 6)
  assert.equal((html.match(/1.234,50 €/g) ?? []).length, 3)
  assert.match(html, /&lt;Partner teams&gt;/)
  assert.match(html, />0<\/dd>/)
  assert.match(html, /alt="Acme workspace"/)
  assert.match(html, /More of the story/)
  const defaultHtml = await renderToString(h(SWebsiteStats, { title: 'Defaults', stats }))
  assert.match(defaultHtml, /<h2 /)
  const noMedia = await renderToString(h(SWebsiteStats, { title: 'Without media', stats, variant: 'image' }))
  assert.match(noMedia, /Without media/)
  assert.doesNotMatch(noMedia, /<img/)
})


test('testimonial variants retain semantic quotes, attribution, scoped brands, and unique headings', async () => {
  const testimonials = [
    { id: 'maya', quote: '<A clearer direction> & a better handover.', name: 'Maya Chen', role: 'Co-founder', company: 'Fieldwork' },
    { id: 'alex', quote: 'A thoughtful process.', name: 'Alex Morgan' },
  ]
  const html = await renderToString(h('div', ['simple', 'image', 'multiple'].map(variant => h(SWebsiteTestimonials, {
    title: 'Partner stories', headingLevel: 4, variant, testimonials,
  }, {
    brand: ({ testimonial }) => h('span', { 'data-partner': testimonial.id }, testimonial.company ?? testimonial.name),
    ...(variant === 'image' ? { media: ({ testimonial }) => h('img', { src: '/studio.jpg', alt: `Workspace for ${testimonial.name}` }) } : {}),
  }))))
  const ids = [...html.matchAll(/<h4 id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, 3)
  assert.equal(new Set(ids).size, 3)
  for (const id of ids) assert.ok(html.includes(`aria-labelledby="${id}"`))
  assert.equal((html.match(/<blockquote /g) ?? []).length, 6)
  assert.equal((html.match(/<figcaption /g) ?? []).length, 6)
  assert.equal((html.match(/data-partner="maya"/g) ?? []).length, 3)
  assert.equal((html.match(/data-partner="alex"/g) ?? []).length, 3)
  assert.match(html, /&lt;A clearer direction&gt; &amp; a better handover/)
  assert.match(html, /Co-founder · Fieldwork/)
  assert.match(html, /alt="Workspace for Alex Morgan"/)
  assert.doesNotMatch(html, /<A clearer direction>/)
  const defaultHtml = await renderToString(h(SWebsiteTestimonials, { title: 'Defaults', testimonials }))
  assert.match(defaultHtml, /<h2 /)
  const noMedia = await renderToString(h(SWebsiteTestimonials, { title: 'Text only', testimonials, variant: 'image' }))
  assert.equal((noMedia.match(/<blockquote /g) ?? []).length, 2)
  assert.doesNotMatch(noMedia, /<img/)
})


test('blog layouts reuse post records without duplicate IDs and preserve independent metadata links', async () => {
  const posts = [{ id: 'a-post', title: '<A good question>', href: '/journal/question', excerpt: 'A thoughtful & useful beginning.',
    publishedAt: '2026-11-05', dateLabel: '5 November 2026', category: 'Process', categoryHref: '/topics/process',
    author: 'Alex Morgan', authorRole: 'Designer', authorHref: '/authors/alex', imageSrc: '/notebook.jpg', imageAlt: 'An open notebook' }]
  const html = await renderToString(h('div', ['columns', 'images', 'list'].map(variant => h(SWebsiteBlog, {
    title: 'From the journal', headingLevel: 4, posts, variant,
  }))))
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(!ids.includes('a-post'))
  assert.equal((html.match(/<h4 /g) ?? []).length, 3)
  assert.equal((html.match(/<h5 /g) ?? []).length, 3)
  assert.equal((html.match(/<article /g) ?? []).length, 3)
  for (const href of ['/journal/question', '/topics/process', '/authors/alex']) {
    assert.equal(html.split(`href="${href}"`).length - 1, 3)
  }
  assert.equal((html.match(/alt="An open notebook"/g) ?? []).length, 2)
  assert.equal((html.match(/datetime="2026-11-05"/g) ?? []).length, 3)
  assert.match(html, /&lt;A good question&gt;/)
  const defaultHtml = await renderToString(h(SArticleCard, { title: 'Existing card', href: '/story', author: 'Alex Morgan' }))
  assert.match(defaultHtml, /<h3 /)
  assert.match(defaultHtml, /By Alex Morgan/)
  const mediaHtml = await renderToString(h(SWebsiteBlog, { title: 'Cover replacement', posts, variant: 'images' }, {
    media: ({ post }) => h('div', { role: 'img', 'aria-label': `Original cover for ${post.title}` }),
  }))
  assert.match(mediaHtml, /Original cover for/)
  assert.doesNotMatch(mediaHtml, /src="\/notebook.jpg"/)
})


test('contact sections preserve label/value semantics, address lines, headings, and app-owned forms', async () => {
  const panels = ['split', 'locations'].map(variant => h(SWebsiteContact, {
    title: 'Get in touch', headingLevel: 4, variant,
    details: [{ id: 'email', label: 'Email', value: 'alex@acme.example', href: 'mailto:alex@acme.example' }],
    locations: [{ id: 'studio', title: 'Studio <North>', address: ['Example Street', 'Singapore'] }],
  }, {
    form: () => h('form', { 'aria-label': 'Write to the studio' }, h('input', { name: 'email', type: 'email' })),
    icon: ({ detail }) => h('svg', { 'data-detail': detail.id }),
  }))
  const html = await renderToString(h('div', panels))
  const ids = [...html.matchAll(/<h4 id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, 2)
  assert.equal(new Set(ids).size, 2)
  for (const id of ids) assert.ok(html.includes(`aria-labelledby="${id}"`))
  assert.equal((html.match(/<form /g) ?? []).length, 1)
  assert.match(html, /href="mailto:alex@acme.example"/)
  assert.match(html, /<address /)
  assert.match(html, /<h5 /)
  assert.match(html, /Studio &lt;North&gt;/)
  assert.match(html, /data-detail="email"/)
  const plain = await renderToString(h(SWebsiteContact, { title: 'Contact', details: [{ id: 'phone', label: 'Telephone', value: 'Example number' }] }))
  assert.match(plain, /Telephone/)
  assert.match(plain, /<h2 /)
  assert.doesNotMatch(plain, /<form/)
})

test('contact preview checks whitespace, focuses the first error, and completes without sending', async () => {
  const demo = await loadDemo('website')
  const Form = await demo.component('components/StudioContactForm.vue')
  const view = mountComponent(Form)
  const focused = []
  view.element.querySelector = () => ({ focus: () => focused.push('first-invalid') })
  const input = name => find(view, node => node.type === 'input' && node.props.name === name)
  const setInput = (name, value) => input(name).props.onInput({ target: { value } })
  const submit = () => find(view, node => node.type === 'form').props.onSubmit({ preventDefault() {} })
  try {
    setInput('first-name', '   ')
    submit()
    await nextTick()
    await nextTick()
    assert.match(text(find(view, node => node.props.role === 'alert')), /highlighted fields/)
    assert.deepEqual(focused, ['first-invalid'])
    setInput('first-name', 'Alex')
    setInput('last-name', 'Morgan')
    setInput('email', 'alex@acme.example')
    const textarea = find(view, node => node.type === 'textarea')
    textarea.value = 'A new idea for the studio.'
    textarea.listeners.input({ target: textarea })
    submit()
    await nextTick()
    assert.equal(find(view, node => node.props.role === 'alert'), undefined)
    assert.match(text(find(view, node => node.props.role === 'status')), /No message was sent/)
  } finally { view.unmount(); await demo.close() }
})


test('team layouts preserve semantic member lists, heading levels, profiles, and portrait fallbacks', async () => {
  const members = [
    { id: 'alex', name: '<Alex Morgan>', role: 'Creative direction', imageSrc: '/team/alex.jpg', href: '/people/alex' },
    { id: 'jamie', name: 'Jamie Lim', role: 'Brand design' },
  ]
  const html = await renderToString(h('div', ['small-images', 'round-images'].map(variant => h(SWebsiteTeam, {
    title: 'Meet the team', headingLevel: 4, variant, members,
  }))))
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  assert.equal((html.match(/<h4 /g) ?? []).length, 2)
  assert.equal((html.match(/<h5 /g) ?? []).length, 4)
  assert.equal((html.match(/role="list"/g) ?? []).length, 2)
  assert.equal((html.match(/<li /g) ?? []).length, 4)
  assert.equal((html.match(/href="\/people\/alex"/g) ?? []).length, 2)
  assert.equal((html.match(/src="\/team\/alex.jpg"/g) ?? []).length, 2)
  assert.match(html, /&lt;Alex Morgan&gt;/)
  assert.match(html, /JL/)
  const defaultHtml = await renderToString(h(SWebsiteTeam, { title: 'Defaults', members }))
  assert.match(defaultHtml, /<h2 /)
  assert.match(defaultHtml, /<h3 /)
  const custom = await renderToString(h(SWebsiteTeam, { title: 'Custom portraits', members }, {
    portrait: ({ member }) => h('span', { 'aria-hidden': 'true', 'data-person': member.id }, 'Portrait placeholder'),
  }))
  assert.match(custom, /data-person="alex"/)
  assert.match(custom, /data-person="jamie"/)
  assert.doesNotMatch(custom, /src="\/team\/alex.jpg"/)
})


test('centered footer preserves native navigation, accessible social labels, and icon-free fallbacks', async () => {
  const items = [{ id: 'about', label: 'The studio', href: '/about' }]
  const socials = [{ id: 'social', label: 'Social profile', href: 'https://example.com/profile', target: '_blank', rel: 'noopener noreferrer' }]
  const html = await renderToString(h(SWebsiteFooter, {
    variant: 'centered', items, socials, navigationLabel: 'Explore Acme', socialLabel: 'Find Acme elsewhere',
  }, {
    socialIcon: ({ item }) => h('svg', { 'data-social': item.id, 'aria-hidden': 'true' }),
    bottom: () => h('p', '© 2026 Acme Studio'),
  }))
  assert.match(html, /aria-label="Explore Acme"/)
  assert.match(html, /aria-label="Find Acme elsewhere"/)
  assert.match(html, /href="\/about"/)
  assert.match(html, /href="https:\/\/example.com\/profile"/)
  assert.match(html, /target="_blank"/)
  assert.match(html, /rel="noopener noreferrer"/)
  assert.match(html, /class="sr-only">Social profile/)
  assert.match(html, /data-social="social"/)
  assert.match(html, /© 2026 Acme Studio/)
  const fallback = await renderToString(h(SWebsiteFooter, { variant: 'centered', socials }))
  assert.match(fallback, />Social profile<\/span>/)
  assert.doesNotMatch(fallback, /sr-only/)
  const grouped = await renderToString(h(SWebsiteFooter, { groups: [{ id: 'explore', label: 'Explore', items }], socials }))
  assert.match(grouped, /Explore/)
  assert.match(grouped, /href="\/about"/)
  assert.doesNotMatch(grouped, /Social profile/)
})


test('showcase menu targets resolve to focusable collections with unique IDs and an ordered heading hierarchy', async () => {
  const demo = await loadDemo('website')
  try {
    const Page = await demo.component('pages/StudioSections.vue')
    const { showcaseSections } = await demo.module('showcaseSections.ts')
    const { resolveDestination } = await demo.module('routes.ts')
    const html = await renderToString(h(Page, { activeSection: 'contact' }))
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
    assert.equal(ids.length, new Set(ids).size, 'repeated previews must not duplicate control/heading IDs')
    assert.equal((html.match(/<h1 /g) ?? []).length, 1)
    for (const collection of showcaseSections) {
      const target = `sections/${collection.id}`
      assert.match(html, new RegExp(`href="#${target}"`))
      assert.match(html, new RegExp(`id="${target}"[^>]*tabindex="-1"`))
      const route = resolveDestination(target)
      assert.equal(route.page, 'sections')
      assert.equal(route.anchor, target)
    }
    assert.equal(resolveDestination('sections/menu').anchor, 'sections/menu')
    assert.equal(resolveDestination('sections/unknown').page, 'sections')
    assert.equal(resolveDestination('sections/unknown').anchor, undefined)
    assert.match(html, /id="sections\/menu" tabindex="-1"/)
    assert.match(html, /href="#sections\/contact" aria-current="location"/)
    for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
      for (const [, references] of html.matchAll(new RegExp(`${attribute}="([^"]+)"`, 'g'))) {
        for (const reference of references.split(' ')) assert.ok(ids.includes(reference), `${attribute}: ${reference}`)
      }
    }
    const headings = [...html.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]))
    for (let index = 1; index < headings.length; index++) assert.ok(headings[index] <= headings[index - 1] + 1, `heading level jumped from ${headings[index - 1]} to ${headings[index]}`)
    for (const original of ['hero-example-studio-original', 'feature-example-services-original', 'feature-example-process-original', 'projects-example-studio-original', 'cta-example-banner-original', 'blog-example-journal-original', 'contact-example-enquiry-original', 'team-example-cards-original', 'pricing-example-studio-original', 'faq-example-studio-original', 'footer-example-columns-original']) {
      assert.ok(ids.includes(original), original)
    }
  } finally { await demo.close() }
})

test('switching the selected showcase category preserves form drafts and updates native menu links', async () => {
  const demo = await loadDemo('website')
  const Page = await demo.component('pages/StudioSections.vue')
  const view = mountComponent(Page, { activeSection: 'heroes' })
  try {
    const input = find(view, node => node.type === 'input' && node.props.name === 'name')
    input.props.onInput({ target: { value: 'Alex Morgan' } })
    await nextTick()
    view.state.value = { activeSection: 'contact' }
    await nextTick()
    assert.equal(find(view, node => node.type === 'input' && node.props.name === 'name'), input)
    assert.equal(input.props.value, 'Alex Morgan')
    const link = find(view, node => node.type === 'a' && node.props.href === '#sections/contact')
    assert.equal(link.props['aria-current'], 'location')
    assert.equal(link.props.onClick, undefined, 'category links keep native modified-click and history behavior')
    const hero = find(view, node => node.type === 'a' && node.props.href === '#sections/heroes' && text(node) === 'Heroes')
    assert.equal(hero.props['aria-current'], undefined)
  } finally { view.unmount(); await demo.close() }
})

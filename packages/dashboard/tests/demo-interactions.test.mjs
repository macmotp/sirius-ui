import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick } from 'vue'
import { mountComponent } from '../../vue/tests/renderer.mjs'
import { loadDemo } from './demo-loader.mjs'

function nodes(node, match) { return [...(match(node) ? [node] : []), ...node.children.flatMap(child => nodes(child, match))] }
const find = (view, match) => nodes(view.element.parent ?? view.element, match)[0]
function text(node) { return (node.type === '#comment' ? '' : node.text) + node.children.map(text).join('') }
function prepareDialog(view) {
  const dialog = find(view, node => node.type === 'dialog')
  dialog.open = false
  dialog.showModal = () => { dialog.open = true }
  dialog.close = () => { dialog.open = false }
  return dialog
}
const click = () => ({ button: 0, preventDefault() { this.defaultPrevented = true } })

test('demo search filters immediately through SInput and selected records navigate to their destination', async () => {
  const demo = await loadDemo()
  const Search = await demo.component('components/DemoSearch.vue')
  const navigated = []
  const view = mountComponent(Search, { onNavigate: page => navigated.push(page) })
  try {
    prepareDialog(view)
    find(view, node => node.props['aria-label'] === 'Search Acme').props.onClick()
    await nextTick()
    const input = () => find(view, node => node.type === 'input')
    input().props.onInput({ target: { value: '1048' } })
    await nextTick()
    const result = find(view, node => node.type === 'a')
    assert.match(text(result), /Order #1048/)
    assert.match(text(find(view, node => node.props.role === 'status')), /1 result found/)
    input().props.onInput({ target: { value: 'no-such-record' } })
    await nextTick()
    assert.equal(find(view, node => node.type === 'a'), undefined)
    assert.match(text(find(view, node => node.props.role === 'status')), /No results found/)
    input().props.onInput({ target: { value: '  DARK  ' } })
    await nextTick()
    find(view, node => node.type === 'a').props.onClick(click())
    await nextTick()
    assert.deepEqual(navigated, ['settings'])
    assert.equal(find(view, node => node.props['aria-label'] === 'Search Acme').props['aria-expanded'], false)
  } finally { view.unmount(); await demo.close() }
})
test('notification read actions update both drawer status and the trigger unread count', async () => {
  const demo = await loadDemo()
  const Notifications = await demo.component('components/DemoNotifications.vue')
  const view = mountComponent(Notifications)
  try {
    prepareDialog(view)
    const trigger = () => find(view, node => node.type === 'button' && String(node.props['aria-label']).startsWith('Notifications,'))
    assert.equal(trigger().props['aria-label'], 'Notifications, 3 unread')
    trigger().props.onClick()
    await nextTick()
    find(view, node => String(node.props['aria-label']).startsWith('Mark read:')).props.onClick()
    await nextTick()
    assert.equal(trigger().props['aria-label'], 'Notifications, 2 unread')
    find(view, node => node.type === 'button' && text(node).includes('Mark all as read')).props.onClick(click())
    await nextTick()
    assert.equal(trigger().props['aria-label'], 'Notifications, 0 unread')
    assert.match(text(find(view, node => node.props.role === 'status')), /caught up/)
  } finally { view.unmount(); await demo.close() }
})
test('appearance controls live on Settings and their models survive page navigation', async () => {
  const demo = await loadDemo()
  const App = await demo.component('App.vue')
  const previousWindow = globalThis.window
  globalThis.window = { location: { hash: '' }, addEventListener() {}, removeEventListener() {} }
  const view = mountComponent(App)
  try {
    assert.equal(find(view, node => node.props.role === 'combobox'), undefined)
    const go = async href => {
      find(view, node => node.type === 'a' && node.props.href === href).props.onClick(click())
      await nextTick()
    }
    await go('#settings')
    find(view, node => node.props.role === 'tab' && text(node) === 'Appearance').props.onClick()
    await nextTick()
    const iconSelect = () => {
      const label = find(view, node => node.type === 'label' && text(node) === 'Icon set')
      return find(view, node => node.type === 'select' && node.props.id === label.props.for)
    }
    assert.ok(find(view, node => node.type === 'svg' && node.props.class?.includes('lucide-search')))
    iconSelect().value = 'heroicons'
    iconSelect().listeners.change()
    await nextTick()
    assert.equal(find(view, node => node.type === 'svg' && node.props.class?.includes('lucide-search')), undefined)
    const heroicon = find(view, node => node.type === 'svg' && node.props['data-slot'] === 'icon')
    assert.ok(heroicon)
    assert.equal(heroicon.props.focusable, 'false')
    assert.equal(heroicon.props['aria-hidden'], 'true')
    const palette = label => {
      const field = find(view, node => node.type === 'label' && text(node).includes(label))
      return field && find(view, node => node.type === 'input' && node.props.id === field.props.for)
    }
    const chooseColor = async label => {
      const listboxes = nodes(view.element.parent ?? view.element, node => node.props.role === 'listbox')
      listboxes.forEach(list => { list.querySelector = () => null })
      find(view, node => node.props.role === 'option' && text(node).trim() === label).props.onClick()
      await nextTick()
    }
    assert.ok(palette('Background color'))
    await chooseColor('Stone')
    await chooseColor('Pink')
    find(view, node => node.type === 'input' && node.props.role === 'switch').props.onChange({ target: { checked: true } })
    await nextTick()
    await go('#activity')
    assert.equal(palette('Background color'), undefined)
    await go('#settings')
    assert.equal(iconSelect().value, 'heroicons')
    assert.equal(palette('Background color').props.value, 'Stone')
    assert.equal(palette('Primary color').props.value, 'Pink')
    assert.equal(find(view, node => node.props.role === 'switch').props.checked, true)
  } finally {
    view.unmount()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    await demo.close()
  }
})

test('the account popover presents identity details, routes profile links and keeps sign-out demonstrative', async () => {
  const demo = await loadDemo()
  const Account = await demo.component('components/DemoAccountMenu.vue')
  const navigated = [], notices = []
  const view = mountComponent(Account, { onNavigate: page => navigated.push(page), onNotice: message => notices.push(message) })
  const trigger = () => find(view, node => node.props['aria-label'] === 'Open account menu for Alex Morgan')
  try {
    trigger().props.onClick({ currentTarget: {} })
    await nextTick()
    const panel = find(view, node => node.props.role === 'dialog')
    assert.match(text(panel), /Alex Morgan/)
    assert.match(text(panel), /alex@acme.example/)
    assert.match(text(panel), /Operations manager/)
    find(view, node => node.type === 'a' && node.props.href === '#profile').props.onClick(click())
    await nextTick()
    assert.deepEqual(navigated, ['profile'])
    assert.equal(trigger().props['aria-expanded'], false)
    trigger().props.onClick({ currentTarget: {} })
    await nextTick()
    find(view, node => node.type === 'button' && text(node).includes('Sign out')).props.onClick()
    await nextTick()
    assert.match(notices[0], /still signed in/)
    assert.deepEqual(navigated, ['profile'])
    assert.equal(trigger().props['aria-expanded'], false)
  } finally { view.unmount(); await demo.close() }
})

async function mountSettingsApp() {
  const demo = await loadDemo()
  const App = await demo.component('App.vue')
  const previousWindow = globalThis.window
  globalThis.window = { location: { hash: '#settings' }, addEventListener() {}, removeEventListener() {} }
  const view = mountComponent(App)
  await nextTick()
  // DOM focus behavior is verified in the browser. The lightweight renderer
  // supplies the methods used by the page's post-submit focus restoration.
  for (const node of nodes(view.element.parent ?? view.element, () => true)) {
    node.querySelector = () => null
    node.focus = () => {}
  }
  return { view, async close() {
    view.unmount()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    await demo.close()
  } }
}
const section = async (view, name) => {
  find(view, node => node.props.role === 'tab' && text(node) === name).props.onClick()
  await nextTick()
}
const edit = async (view, name, value) => {
  find(view, node => node.type === 'input' && node.props.name === name).props.onInput({ target: { value } })
  await nextTick()
}
const submitSettings = async view => {
  find(view, node => node.type === 'form' && node.props['aria-label'] === 'Workspace settings').props.onSubmit(click())
  await nextTick()
  await nextTick()
}

test('profile drafts survive page navigation; save updates the account and discard restores the last saved snapshot', async () => {
  const fixture = await mountSettingsApp()
  const { view } = fixture
  try {
    await edit(view, 'name', 'Alex Rivers')
    assert.ok(find(view, node => node.type === 'button' && text(node) === 'Save changes'))
    assert.ok(find(view, node => node.props['aria-label'] === 'Open account menu for Alex Morgan'))
    find(view, node => node.type === 'a' && node.props.href === '#activity').props.onClick(click())
    await nextTick()
    find(view, node => node.type === 'a' && node.props.href === '#settings').props.onClick(click())
    await nextTick()
    assert.equal(find(view, node => node.props.name === 'name').props.value, 'Alex Rivers')
    // The form's root is replaced after navigation.
    for (const node of nodes(view.element.parent ?? view.element, () => true)) {
      node.querySelector = () => null
      node.focus = () => {}
    }
    await submitSettings(view)
    assert.ok(find(view, node => node.props['aria-label'] === 'Open account menu for Alex Rivers'))
    assert.equal(find(view, node => node.type === 'button' && text(node) === 'Save changes'), undefined)
    await edit(view, 'name', 'Another draft')
    find(view, node => node.type === 'button' && text(node) === 'Discard').props.onClick()
    await nextTick()
    assert.equal(find(view, node => node.props.name === 'name').props.value, 'Alex Rivers')
  } finally { await fixture.close() }
})

test('saving from another tab reveals required-field errors and never commits an invalid draft', async () => {
  const fixture = await mountSettingsApp()
  const { view } = fixture
  try {
    await edit(view, 'email', 'not-an-email')
    await section(view, 'Notifications')
    await submitSettings(view)
    assert.equal(find(view, node => node.props.role === 'tab' && node.props['aria-selected']).children.map(text).join(''), 'Profile')
    const email = find(view, node => node.props.name === 'email')
    assert.equal(email.props['aria-invalid'], true)
    assert.match(email.props['aria-describedby'], /-error/)
    assert.match(text(find(view, node => node.props.role === 'alert')), /valid email address/)
    await edit(view, 'email', 'alex@acme.example')
    await section(view, 'Workspace')
    await edit(view, 'workspaceHandle', 'invalid handle!')
    await section(view, 'Notifications')
    await submitSettings(view)
    assert.ok(find(view, node => node.props.role === 'tab' && node.props['aria-selected'] && text(node) === 'Workspace'))
    assert.equal(find(view, node => node.props.name === 'workspaceHandle').props['aria-invalid'], true)
    assert.ok(find(view, node => node.type === 'button' && text(node) === 'Save changes'))
  } finally { await fixture.close() }
})

test('notification preferences save together and remain selected after remounting the settings page', async () => {
  const fixture = await mountSettingsApp()
  const { view } = fixture
  try {
    await section(view, 'Notifications')
    const digest = () => find(view, node => node.type === 'input' && node.props.name === 'digest')
    assert.equal(digest().props.checked, false)
    digest().props.onChange({ target: { checked: true } })
    await nextTick()
    await submitSettings(view)
    find(view, node => node.type === 'a' && node.props.href === '#activity').props.onClick(click())
    await nextTick()
    find(view, node => node.type === 'a' && node.props.href === '#settings').props.onClick(click())
    await nextTick()
    assert.equal(digest().props.checked, true)
    assert.equal(find(view, node => node.type === 'button' && text(node) === 'Save changes'), undefined)
  } finally { await fixture.close() }
})

test('settings validation normalizes valid drafts and retains independent saved and editable objects', async () => {
  const demo = await loadDemo()
  try {
    const { useDemoSettings } = await demo.module('composables/useDemoSettings.ts')
    const settings = useDemoSettings()
    settings.draft.value.profile.name = '  Alex Rivers  '
    settings.draft.value.profile.bio = '  A new introduction.  '
    settings.draft.value.workspace.name = '  Acme Studio  '
    settings.draft.value.workspace.handle = 'acme-studio'
    assert.equal(settings.save(), undefined)
    assert.equal(settings.saved.value.profile.name, 'Alex Rivers')
    assert.equal(settings.saved.value.profile.bio, 'A new introduction.')
    assert.equal(settings.saved.value.workspace.name, 'Acme Studio')
    assert.equal(settings.dirty.value, false)
    settings.draft.value.profile.bio = 'An unsaved introduction.'
    settings.draft.value.notifications.digest = true
    assert.equal(settings.saved.value.profile.bio, 'A new introduction.')
    assert.equal(settings.saved.value.notifications.digest, false)
    settings.discard()
    assert.equal(settings.draft.value.profile.bio, 'A new introduction.')
    assert.equal(settings.draft.value.notifications.digest, false)
    settings.draft.value.workspace.timezone = 'unknown-zone'
    assert.equal(settings.save(), 'workspace')
    assert.ok(settings.errors.value.workspace.timezone)
    assert.equal(settings.saved.value.workspace.timezone, 'Asia/Singapore')
  } finally { await demo.close() }
})

test('dashboard uses one shell title and groups examples under Tables with upcoming pages clearly disabled', async () => {
  const fixture = await mountSettingsApp()
  const { view } = fixture
  try {
    find(view, node => node.type === 'a' && node.props.href === '#tables').props.onClick(click())
    await nextTick()
    const headings = nodes(view.element.parent ?? view.element, node => node.type === 'h1')
    assert.equal(headings.length, 1)
    assert.equal(text(headings[0]), 'Tables')
    assert.equal(find(view, node => node.type === 'main').props['aria-labelledby'], headings[0].props.id)
    assert.equal(find(view, node => node.type === 'a' && node.props.href === '#tables').props['aria-current'], 'page')
    assert.ok(find(view, node => node.type === 'p' && text(node) === 'Page examples'))
    find(view, node => node.type === 'a' && node.props.href === '#charts').props.onClick(click())
    await nextTick()
    assert.equal(text(find(view, node => node.type === 'h1')), 'Charts')
    assert.ok(find(view, node => node.type === 'title' && text(node) === 'Daily sales'))
    for (const name of ['Cards', 'Timeline']) assert.ok(find(view, node => node.props.role === 'link' && node.props['aria-disabled'] && text(node).includes(name)))
    find(view, node => node.type === 'a' && node.props.href === '#overview').props.onClick(click())
    await nextTick()
    assert.equal(text(find(view, node => node.type === 'h1')), 'Overview')
    assert.ok(find(view, node => node.type === 'h2' && text(node) === 'Recent orders'))
  } finally { await fixture.close() }
})

test('Charts is an enabled example, period changes update the line chart, and request states replace graphics', async () => {
  const demo = await loadDemo()
  let view
  try {
    const Charts = await demo.component('components/DemoCharts.vue')
    view = mountComponent(Charts)
    const select = label => {
      const field = find(view, node => node.type === 'select' && node.props['aria-label'] === label)
      return { choose(value) { field.value = value; field.listeners.change() } }
    }
    const chartFigures = () => nodes(view.element, node => node.type === 'figure')
    assert.equal(chartFigures().length, 8)
    const dataRows = () => nodes(chartFigures()[0], node => node.type === 'tbody')[0].children.filter(node => node.type === 'tr')
    assert.equal(dataRows().length, 7)
    select('Sales chart period').choose('fortnight')
    await nextTick()
    assert.equal(dataRows().length, 14)
    const barRects = index => nodes(chartFigures()[index], node => node.type === 'rect' && node.props.fill)
    assert.equal(barRects(4).length, 15)
    assert.equal(barRects(5).length, 15)
    select('Online bar color').choose('pink')
    await nextTick()
    assert.equal(barRects(4)[0].props.fill, 'var(--acme-chart-pink)')
    assert.equal(barRects(5)[0].props.fill, 'var(--acme-chart-pink)')
    select('Bar chart series count').choose('one')
    await nextTick()
    assert.equal(barRects(4).length, 5)
    assert.equal(barRects(5).length, 5)
    select('Bar chart series count').choose('three')
    await nextTick()
    assert.equal(barRects(4).length, 15)
    assert.equal(barRects(4)[0].props.fill, 'var(--acme-chart-pink)')
    const donutSlices = index => nodes(chartFigures()[index], node => node.props.class === 'sirius-donut-chart__slice')
    assert.equal(donutSlices(6).length, 3)
    assert.equal(donutSlices(7).length, 4)
    select('Online donut color').choose('pink')
    select('Donut ring thickness').choose('thin')
    const originalRing = donutSlices(6)[0].props.d
    await nextTick()
    assert.equal(donutSlices(6)[0].props.fill, 'var(--acme-chart-pink)')
    assert.notEqual(donutSlices(6)[0].props.d, originalRing)
    select('Donut request state').choose('single')
    await nextTick()
    assert.equal(donutSlices(7).length, 1)
    select('Donut request state').choose('empty')
    await nextTick()
    assert.match(text(chartFigures()[7]), /No data to display/)
    select('Donut request state').choose('error')
    await nextTick()
    assert.ok(nodes(chartFigures()[7], node => node.props.role === 'alert').length)
    const comparison = () => chartFigures()[1]
    const linePaths = () => nodes(comparison(), node => node.type === 'path')
    assert.equal(linePaths().length, 3)
    assert.ok(linePaths().every(path => path.props.d.includes('C')))
    const originalData = text(nodes(comparison(), node => node.type === 'table')[0])
    select('Online line color').choose('pink')
    select('Online line pattern').choose('dotted')
    await nextTick()
    assert.equal(linePaths()[0].props['stroke-dasharray'], '2 5')
    assert.equal(linePaths()[0].parent.props.style['--sirius-chart-color'], 'var(--acme-chart-pink)')
    assert.equal(text(nodes(comparison(), node => node.type === 'table')[0]), originalData)
    select('Comparison series count').choose('two')
    select('Comparison line style').choose('straight')
    await nextTick()
    assert.equal(linePaths().length, 2)
    assert.ok(linePaths().every(path => !path.props.d.includes('C')))
    select('Comparison series count').choose('three')
    await nextTick()
    assert.equal(linePaths().length, 3)
    assert.equal(linePaths()[0].props['stroke-dasharray'], '2 5')
    assert.equal(linePaths()[0].parent.props.style['--sirius-chart-color'], 'var(--acme-chart-pink)')
    select('Chart request state').choose('empty')
    await nextTick()
    assert.match(text(chartFigures()[3]), /No data to display/)
    assert.equal(nodes(chartFigures()[3], node => node.type === 'svg').length, 0)
    select('Chart request state').choose('loading')
    await nextTick()
    assert.match(text(chartFigures()[3]), /Loading chart/)
    select('Chart request state').choose('error')
    await nextTick()
    assert.ok(nodes(chartFigures()[3], node => node.props.role === 'alert').length)
  } finally { view?.unmount(); await demo.close() }
})

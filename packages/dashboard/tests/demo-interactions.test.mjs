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
    await go('#cards')
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

async function mountSettingsApp(initialHash = '#settings') {
  const demo = await loadDemo()
  const App = await demo.component('App.vue')
  const previousWindow = globalThis.window
  globalThis.window = { location: { hash: initialHash }, addEventListener() {}, removeEventListener() {} }
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
    find(view, node => node.type === 'a' && node.props.href === '#cards').props.onClick(click())
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
    find(view, node => node.type === 'a' && node.props.href === '#cards').props.onClick(click())
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

test('dashboard uses one shell title and navigates to the page examples', async () => {
  const fixture = await mountSettingsApp('#lists')
  const { view } = fixture
  try {
    assert.equal(text(find(view, node => node.type === 'h1')), 'Cards')
    assert.ok(find(view, node => node.props.id === 'lists'))
    const nav = find(view, node => node.type === 'nav')
    const entries = nodes(nav, node => node.type === 'a' || node.props.role === 'link')
    assert.deepEqual(entries.map(node => node.props.href), [
      '#overview', '#cards', '#tables', '#calendar', '#charts', '#settings',
    ])
    entries[3].props.onClick(click())
    await nextTick()
    assert.equal(text(find(view, node => node.type === 'h1')), 'Calendar')
    assert.ok(find(view, node => node.props['aria-label'] === 'Month calendar'))
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
    find(view, node => node.type === 'a' && node.props.href === '#cards').props.onClick(click())
    await nextTick()
    assert.equal(text(find(view, node => node.type === 'h1')), 'Cards')
    assert.equal(find(view, node => node.type === 'a' && node.props.href === '#cards').props['aria-current'], 'page')
    assert.match(text(find(view, node => node.props.id === 'activity')), /Order #1048 is ready to dispatch/)
    const people = find(view, node => node.type === 'ul' && node.props['aria-label'] === 'Acme teammates')
    assert.equal(nodes(people, node => node.type === 'li').length, 4)
    assert.equal(nodes(people, node => node.type === 'a' && node.props.href === '#profile').length, 1)
    assert.equal(nodes(people, node => node.type === 'a' && node.props.href === 'mailto:jamie@acme.example').length, 1)
    assert.equal(nodes(people, node => node.type === 'time')[0].props.datetime, '2026-11-06T15:20:00+08:00')
    assert.match(text(people), /Online/)
    assert.ok(find(view, node => node.type === 'dd' && text(node).startsWith('0')))
    const cards = find(view, node => node.props['aria-labelledby'] === 'metric-card-examples')
    assert.equal(nodes(cards, node => node.type === 'svg' && node.props.class === 'sirius-sparkline').length, 3)
    assert.ok(find(view, node => node.type === 'p' && text(node) === 'Jamie Lim'))
    const team = find(view, node => node.props['aria-labelledby'] === 'user-card-examples')
    assert.equal(nodes(team, node => node.type === 'li').length, 3)
    assert.equal(nodes(team, node => node.type === 'img').length, 0)
    assert.equal(nodes(team, node => node.type === 'a' && node.props['aria-label'] === 'Email Jamie Lim')[0].props.href, 'mailto:jamie@acme.example')
    assert.equal(nodes(team, node => node.type === 'a' && node.props['aria-label'] === 'Call Jamie Lim')[0].props.href, 'tel:+12025550114')
    assert.ok(find(view, node => node.props.role === 'progressbar' && node.props['aria-valuetext'] === '7.2 GB of 10 GB'))
    const option = label => {
      const id = nodes(cards, node => node.type === 'label' && text(node) === label)[0].props.for
      return nodes(cards, node => node.props.role === 'switch' && node.props.id === id)[0]
    }
    assert.equal(option('Tinted backgrounds').props.checked, false)
    assert.equal(option('Rounded lines').props.checked, true)
    assert.equal(find(view, node => node.type === 'p' && text(node) === 'After refunds and discounts'), undefined)
    assert.equal(nodes(cards, node => node.props.style?.backgroundColor).length, 0)
    option('Tinted backgrounds').props.onChange({ target: { checked: true } })
    option('Show subtitles').props.onChange({ target: { checked: true } })
    await nextTick()
    assert.ok(find(view, node => node.type === 'p' && text(node) === 'After refunds and discounts'))
    assert.equal(nodes(cards, node => node.props.style?.backgroundColor === 'var(--sirius-success-soft)').length, 1)
    const toggle = option('Show loading state')
    toggle.props.onChange({ target: { checked: true } })
    await nextTick()
    assert.equal(nodes(view.element.parent ?? view.element, node => node.props['aria-busy'] === true).length, 3)
    assert.equal(find(view, node => node.type === 'dd' && text(node).includes('+8.4%')), undefined)
    assert.equal(nodes(cards, node => node.type === 'svg' && node.props.class === 'sirius-sparkline').length, 0)
    toggle.props.onChange({ target: { checked: false } })
    await nextTick()
    assert.ok(find(view, node => node.type === 'dd' && text(node).includes('+8.4%')))
    find(view, node => node.type === 'a' && node.props.href === '#overview').props.onClick(click())
    await nextTick()
    assert.equal(text(find(view, node => node.type === 'h1')), 'Overview')
    assert.ok(find(view, node => node.type === 'h2' && text(node) === 'Recent orders'))
    find(view, node => node.type === 'button' && text(node) === 'View activity').props.onClick(click())
    await nextTick()
    assert.equal(text(find(view, node => node.type === 'h1')), 'Cards')
    assert.equal(window.location.hash.replace(/^#/, ''), 'activity')
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

test('utility card options open the invoice for the selected client', async () => {
  const demo = await loadDemo()
  try {
    const UtilityCards = await demo.component('components/DemoUtilityCards.vue')
    const view = mountComponent(UtilityCards)
    try {
      const dialog = prepareDialog(view)
      const options = find(view, node => node.props['aria-label'] === 'Options for Harbor Goods')
      options.props.onClick({ currentTarget: {} })
      await nextTick()
      await find(view, node => node.type === 'button' && text(node) === 'View invoice').props.onClick()
      await nextTick()
      assert.equal(options.props['aria-expanded'], false)
      assert.match(text(dialog), /INV-1019/)
      assert.match(text(dialog), /Harbor Goods/)
      assert.match(text(dialog), /Overdue/)
      assert.equal(nodes(dialog, node => node.type === 'time')[0].props.datetime, '2026-10-21')
    } finally { view.unmount() }
  } finally { await demo.close() }
})

test('feedback comments append to the feedback timeline and clear the draft', async () => {
  const demo = await loadDemo()
  const previousDocument = globalThis.Document
  globalThis.Document ??= class {}
  try {
    const ActivityCards = await demo.component('components/DemoActivityCards.vue')
    const view = mountComponent(ActivityCards, {
      account: { name: 'Alex Morgan', email: 'alex@acme.example', role: 'Workspace owner', jobTitle: 'Operations manager' },
    })
    try {
      const feedback = find(view, node => node.props['aria-label'] === 'Team feedback timeline')
      const orders = find(view, node => node.props['aria-label'] === 'Order #1048 status history')
      const textarea = find(view, node => node.type === 'textarea')
      textarea.getRootNode = () => new Document()
      const submit = () => find(view, node => node.type === 'form').props.onSubmit(click())

      submit()
      await nextTick()
      assert.equal(nodes(feedback, node => node.type === 'li').length, 3)
      textarea.value = '  Confirm the new delivery copy.  '
      textarea.listeners.input({ target: textarea })
      await nextTick()
      submit()
      await nextTick()
      assert.match(text(feedback), /Alex Morgan left feedback.*Confirm the new delivery copy\./)
      assert.equal(nodes(feedback, node => node.type === 'li').length, 4)
      assert.equal(nodes(orders, node => node.type === 'li').length, 4)
      assert.equal(textarea.value, '')
    } finally { view.unmount() }
  } finally {
    if (previousDocument === undefined) delete globalThis.Document
    else globalThis.Document = previousDocument
    await demo.close()
  }
})

test('calendar switches between month, week and day and opens the selected date', async () => {
  const demo = await loadDemo()
  try {
    const Calendar = await demo.component('components/DemoCalendar.vue')
    const { calendarEvents } = await demo.module('data/calendar.ts')
    const view = mountComponent(Calendar, { events: calendarEvents })
    try {
      const button = label => find(view, node => node.type === 'button' && (node.props['aria-label'] === label || text(node) === label))
      const month = () => find(view, node => node.props['aria-label'] === 'Month calendar')
      const week = () => find(view, node => node.props['aria-label'] === 'Weekly schedule')
      const day = () => find(view, node => node.props['aria-label'] === 'Daily schedule')
      const picker = () => find(view, node => node.props['aria-label'] === 'Date picker calendar')
      const rows = schedule => nodes(schedule, node => node.type === 'tbody')[0].children.filter(node => node.type === 'tr')
      assert.equal(nodes(month(), node => node.type === 'td').length, 42)
      button('Week').props.onClick(click())
      await nextTick()
      assert.equal(month(), undefined)
      assert.equal(nodes(week(), node => node.type === 'button').length, 7)
      const weekRows = rows(week())
      assert.equal(weekRows.length, 24)
      assert.ok(weekRows.every(row => row.children.filter(node => node.type === 'td').length === 7))
      assert.match(text(weekRows[0]), /^00:00/)
      assert.match(text(weekRows[23]), /^23:00/)
      assert.match(text(weekRows[9].children.filter(node => node.type === 'td')[1]), /09:30Courier pickup/)
      button('Tuesday, 10 November 2026').props.onClick(click())
      await nextTick()
      assert.equal(button('Day').props['aria-pressed'], true)
      button('Month').props.onClick(click())
      await nextTick()
      find(view, node => node.type === 'button' && /10 November 2026, 2 events/.test(node.props['aria-label'] ?? '')).props.onClick(click())
      await nextTick()
      const dayRows = rows(day())
      assert.equal(dayRows.length, 24)
      assert.match(text(dayRows[9]), /Courier pickup.*Acme dispatch desk/)
      assert.match(text(dayRows[14]), /Stock check/)
      assert.equal(button('Day').props['aria-pressed'], true)
      assert.equal(button('Tuesday, 10 November 2026').props['aria-pressed'], true)
      button('Next day').props.onClick(click())
      await nextTick()
      assert.equal(button('Wednesday, 11 November 2026').props['aria-pressed'], true)
      assert.doesNotMatch(text(day()), /Courier pickup|Stock check/)
      button('Next month in date picker').props.onClick(click())
      await nextTick()
      assert.equal(text(find(view, node => node.props.id === 'calendar-period')), 'Wednesday, 11 November 2026')
      nodes(picker(), node => node.props['aria-label'] === 'Tuesday, 1 December 2026')[0].props.onClick(click())
      await nextTick()
      assert.equal(text(find(view, node => node.props.id === 'calendar-period')), 'Tuesday, 1 December 2026')
      assert.equal(button('Tuesday, 1 December 2026').props['aria-pressed'], true)
    } finally { view.unmount() }
  } finally { await demo.close() }
})

test('calendar creates an all-day event on a different date and discards cancelled drafts', async () => {
  const fixture = await mountSettingsApp('#calendar')
  const { view } = fixture
  try {
    const button = (root, label) => nodes(root, node => node.type === 'button' && text(node).trim() === label)[0]
    const calendar = () => find(view, node => node.props['aria-labelledby'] === 'calendar-period')
    const dialog = nodes(calendar(), node => node.type === 'dialog')[0]
    dialog.open = false
    dialog.showModal = () => { dialog.open = true }
    dialog.close = () => { dialog.open = false }
    const open = async () => {
      button(calendar(), 'Add event').props.onClick(click())
      await nextTick()
      assert.equal(dialog.open, true)
    }
    const input = name => nodes(dialog, node => node.props.name === name)[0]
    const finishClose = async () => {
      dialog.props.onAnimationend({ target: dialog, animationName: 'sirius-dialog-out' })
      await nextTick()
    }
    const navigate = async hash => {
      find(view, node => node.type === 'a' && node.props.href === hash).props.onClick(click())
      await nextTick()
    }
    const submit = async () => {
      nodes(dialog, node => node.type === 'form')[0].props.onSubmit(click())
      await nextTick()
    }

    await open()
    assert.equal(input('date').props.value, '2026-11-10')
    await edit(view, 'title', '   ')
    await submit()
    assert.equal(input('title').props['aria-invalid'], true)
    await edit(view, 'title', 'Discarded draft')
    button(dialog, 'Cancel').props.onClick(click())
    await nextTick()
    await finishClose()
    assert.doesNotMatch(text(calendar()), /Discarded draft/)

    await open()
    assert.equal(input('title').props.value, '')
    await edit(view, 'title', '  Stocktake  ')
    await edit(view, 'date', '2026-12-01')
    await submit()
    await finishClose()
    assert.match(text(calendar()), /December 2026.*Stocktake/)
    assert.ok(find(view, node => node.type === 'div' && text(node) === 'Event added'))
    button(calendar(), 'Day').props.onClick(click())
    await nextTick()
    const schedule = find(view, node => node.props['aria-label'] === 'Daily schedule')
    assert.match(text(nodes(schedule, node => node.type === 'thead')[0]), /All dayStocktake/)

    await navigate('#cards')
    await navigate('#calendar')
    find(view, node => node.type === 'button' && node.props['aria-label'] === 'Next month').props.onClick(click())
    await nextTick()
    assert.match(text(calendar()), /Stocktake/)
  } finally { await fixture.close() }
})

test('calendar dates handle month end, year boundaries and Singapore midnight', async () => {
  const demo = await loadDemo()
  try {
    const { dateKey, moveDate, weekStart, todayInSingapore } = await demo.module('data/calendar.ts')
    assert.equal(dateKey(moveDate(new Date('2028-01-31'), 'month', 1)), '2028-02-29')
    assert.equal(dateKey(moveDate(new Date('2026-12-31'), 'day', 1)), '2027-01-01')
    assert.equal(dateKey(moveDate(new Date('0099-12-31'), 'day', 1)), '0100-01-01')
    assert.equal(dateKey(weekStart(new Date('2026-11-01'))), '2026-10-26')
    assert.equal(dateKey(todayInSingapore(new Date('2026-11-09T16:00:00Z'))), '2026-11-10')
  } finally { await demo.close() }
})

<script setup lang="ts">
import { provideDemoIcons } from '../../shared/iconSets'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useId, watchEffect } from 'vue'
import { SDashboardLayout } from '@sirius-ui/dashboard'
import { SAvatar, SBadge, SCard, SToaster, useToasts } from '@sirius-ui/vue'
import DemoNavigation from './components/DemoNavigation.vue'
import DemoSettings from './components/DemoSettings.vue'
import { useDemoSettings } from './composables/useDemoSettings'
import DemoCards from './components/DemoCards.vue'
import DemoCalendar from './components/DemoCalendar.vue'
import DemoCharts from './components/DemoCharts.vue'
import DemoOrders from './components/DemoOrders.vue'
import { createDemoOrdersApi } from './data/mockOrdersApi'
import DemoOverview from './components/DemoOverview.vue'
import DemoAccountMenu from './components/DemoAccountMenu.vue'
import DemoSearch from './components/DemoSearch.vue'
import DemoActions from './components/DemoActions.vue'
import DemoNotifications from './components/DemoNotifications.vue'
import { calendarEvents } from './data/calendar'
import type { CalendarEventDraft } from './data/calendar'
import type { DemoDestination, DemoPage } from './data/demo'

provideDemoIcons()

const ordersApi = createDemoOrdersApi()
const events = shallowRef(calendarEvents)
const pageHeadingId = useId()
const page = shallowRef<DemoPage>('overview')
const settingsTab = shallowRef('profile')
const { draft, saved, savedUser, errors, dirty, save, discard } = useDemoSettings()

const dark = shallowRef(false)
const background = shallowRef('slate')
const primary = shallowRef('teal')
const { items: toasts, notify, dismiss } = useToasts()
function addCalendarEvent(event: CalendarEventDraft) {
  events.value = [...events.value, { ...event, id: `demo-event-${events.value.length}`, color: 'primary' }]
  notify({ title: 'Event added', color: 'success' })
}
function saveSettings() {
  const invalidSection = save()
  if (invalidSection) settingsTab.value = invalidSection
  else notify({ title: 'Preferences saved', description: 'Your changes are saved for this demo session.', color: 'success' })
}
const pageLabels = { overview: 'Overview', orders: 'Tables', cards: 'Cards', calendar: 'Calendar', charts: 'Charts', settings: 'Settings', profile: 'Profile' }
const pageTitle = computed(() => pageLabels[page.value])
watchEffect(() => {
  if (typeof document === 'undefined') return
  document.title = `${pageTitle.value} · Sirius Dashboard`
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
  document.documentElement.dataset.siriusBackground = background.value
  document.documentElement.dataset.siriusColor = primary.value
})
function showDestination(destination: string) {
  if (destination === 'activity' || destination === 'lists') {
    page.value = 'cards'
    void nextTick(() => {
      if (typeof document !== 'undefined' && window.location.hash.replace(/^#/, '') === destination) {
        document.getElementById(destination)?.scrollIntoView()
      }
    })
  } else {
    const target = destination === 'tables' ? 'orders' : destination
    page.value = Object.hasOwn(pageLabels, target) ? target as DemoPage : 'overview'
  }
}
function readLocation() {
  showDestination(window.location.hash.replace(/^#/, ''))
}
function navigate(value: DemoDestination, close?: () => void) {
  window.location.hash = value === 'orders' ? 'tables' : value
  showDestination(value)
  close?.()
}
function showNotice(description: string, close?: () => void) {
  close?.()
  notify({ title: 'Example action', description })
}
onMounted(() => { readLocation(); window.addEventListener('hashchange', readLocation) })
onBeforeUnmount(() => window.removeEventListener('hashchange', readLocation))
</script>

<template>
  <SDashboardLayout :navigation-key="page" :main-labelledby="pageHeadingId">
    <template #brand="{ close }"><a href="#overview" class="flex min-w-0 items-center gap-3" @click.prevent="navigate('overview', close)"><span aria-hidden="true" class="sirius-logo block size-10 shrink-0 bg-primary"></span><span class="min-w-0"><span class="block break-words text-lg font-semibold tracking-tight">{{ saved.workspace.name }}</span><span class="mt-0.5 block text-xs text-content-subtle">Business workspace</span></span></a></template>
    <template #navigation="{ close }"><DemoNavigation :current="page" @navigate="navigate($event, close)" /></template>
    <template #sidebarFooter="{ close }"><DemoAccountMenu :user="savedUser" @navigate="navigate($event, close)" @notice="showNotice($event, close)" /></template>
    <template #header><div class="flex min-w-0 items-center gap-3 text-xs"><span class="hidden truncate text-content-subtle sm:inline">{{ saved.workspace.name }}</span><span aria-hidden="true" class="hidden text-content-subtle sm:inline">/</span><h1 :id="pageHeadingId" class="truncate text-xs font-semibold">{{ pageTitle }}</h1></div></template>
    <template #headerActions><DemoSearch @navigate="navigate($event)" /><DemoActions @notice="showNotice($event)" /><DemoNotifications @navigate="navigate($event)" /></template>
    <DemoOverview v-if="page === 'overview'" :api="ordersApi" @tables="navigate('orders')" @charts="navigate('charts')" @activity="navigate('activity')" />
    <DemoOrders v-else-if="page === 'orders'" :api="ordersApi" @simulate-error="ordersApi.failNextList" @notice="(title, description) => notify({ title, description })" />
    <DemoCards v-else-if="page === 'cards'" :account="savedUser" />
    <DemoCalendar v-else-if="page === 'calendar'" :events="events" @create="addCalendarEvent" />
    <DemoCharts v-else-if="page === 'charts'" />
    <SCard v-else-if="page === 'profile'">
      <div class="flex flex-wrap items-center gap-4"><SAvatar :name="savedUser.name" size="xl" aria-hidden="true" /><div><h2 class="text-lg font-semibold">{{ savedUser.name }}</h2><p class="mt-1 text-sm text-content-muted">{{ savedUser.jobTitle }}</p><SBadge class="mt-2">{{ savedUser.role }}</SBadge></div></div>
      <dl class="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-2"><div><dt class="text-xs text-content-subtle">Email address</dt><dd class="mt-1 break-all text-sm">{{ savedUser.email }}</dd></div><div><dt class="text-xs text-content-subtle">Business</dt><dd class="mt-1 text-sm">{{ saved.workspace.name }}</dd></div></dl>
    </SCard>
    <DemoSettings v-else
      v-model:tab="settingsTab"
      v-model:profile="draft.profile"
      v-model:workspace="draft.workspace"
      v-model:notifications="draft.notifications"
      v-model:primary="primary"
      v-model:dark="dark"
      v-model:background="background"
      :dirty="dirty" :errors="errors"
      @save="saveSettings" @discard="discard"
    />
    <footer class="mt-10 flex flex-wrap justify-between gap-3 border-t border-line pt-5 text-xs text-content-subtle"><span>Sirius Dashboard · Original layout</span><span>Local demonstration · No live data</span></footer>
  </SDashboardLayout>
  <SToaster :toasts="toasts" label="Demo action feedback" @dismiss="dismiss" />
</template>
